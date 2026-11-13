
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_URL = (
  process.env.ARO_MINI_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function GET() {
  try {
    const response = await fetch(`${MODEL_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Aro Mini is unavailable." },
        { status: 503 }
      );
    }

    const health = await response.json();

    return NextResponse.json(
      {
        status: health.model_loaded ? "online" : "offline",
        model: "aro-mini-v0.1",
      },
      { status: health.model_loaded ? 200 : 503 }
    );
  } catch {
    return NextResponse.json(
      { error: "Cannot connect to the Aro Mini server." },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const modes: string[] = Array.isArray(body.modes)
      ? body.modes.filter(
          (mode: unknown): mode is string =>
            typeof mode === "string" &&
            [
              "Buddy",
              "Code",
              "Builder",
              "Agent",
              "Research",
              "Overnight",
            ].includes(mode)
        )
      : ["Buddy"];

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: "Message must contain 1–2000 characters." },
        { status: 400 }
      );
    }

    const response = await fetch(`${MODEL_URL}/v1/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(120000),
      body: JSON.stringify({
        prompt: message,
        max_new_tokens: 200,
        temperature: 0.8,
        top_k: 20,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Aro Mini returned HTTP ${response.status}.` },
        { status: 502 }
      );
    }

    const result = await response.json();

    if (
      typeof result.response !== "string" ||
      !result.response.trim()
    ) {
      return NextResponse.json(
        { error: "Aro Mini returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      reply: result.response,
      model: result.model,
      modes,
    });
  } catch (error) {
    const timedOut =
      error instanceof Error && error.name === "TimeoutError";

    return NextResponse.json(
      {
        error: timedOut
          ? "Aro Mini took too long to respond."
          : "Could not connect to Aro Mini. Check that the Python server is running.",
      },
      { status: 502 }
    );
  }
}
