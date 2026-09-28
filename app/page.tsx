"use client";

import { useState } from "react";

const modes = [
  { name: "Buddy", icon: "🧠" },
  { name: "Code", icon: "💻" },
  { name: "Builder", icon: "🛠️" },
  { name: "Agent", icon: "⚡" },
  { name: "Research", icon: "🌐" },
  { name: "Overnight", icon: "🌙" },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-green-400/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          {/* SARO Logo */}
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-black via-[#17121d] to-[#00ff66]">
            <span className="text-xl font-bold text-purple-400">∞</span>
          </div>

          <span className="text-lg font-semibold tracking-wide">SARO</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-white/30 sm:block">
            Local Test
          </span>

          <div className="flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_#00ff66]" />
            <span className="text-xs text-green-300">Online</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 pb-16">
        <div className="w-full max-w-3xl text-center">
          {/* Logo */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-br from-black via-purple-950 to-green-400 shadow-[0_0_80px_rgba(140,0,255,0.2)]">
            <span className="text-5xl font-light text-purple-300">∞</span>
          </div>

          <p className="mb-3 text-sm font-medium tracking-[0.25em] text-purple-300/70">
            PERSONAL AI WORKSPACE
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Meet <span className="text-purple-300">SARO.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/40 sm:text-lg">
            One AI. Every mode. Fully yours.
            <br />
            Build, code, research, create, and automate from one workspace.
          </p>

          {/* Composer */}
          <div className="mx-auto mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] text-left shadow-2xl shadow-black/40 backdrop-blur-xl transition focus-within:border-purple-500/30">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSent(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="What do you want SARO to do?"
              className="min-h-[130px] w-full resize-none bg-transparent px-5 py-5 text-sm text-white outline-none placeholder:text-white/25"
            />

            <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white">
                  + Add
                </button>

                <span className="rounded-full bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300">
                  🧠 Buddy
                </span>
              </div>

              <button
                onClick={handleSend}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
              >
                Send →
              </button>
            </div>
          </div>

          {/* Modes */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {modes.map((mode) => (
              <button
                key={mode.name}
                onClick={() => setMessage(`/${mode.name.toLowerCase()} `)}
                className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-white/50 transition hover:border-purple-500/30 hover:bg-purple-500/5 hover:text-white"
              >
                {mode.icon} {mode.name}
              </button>
            ))}
          </div>

          {/* Test response */}
          {sent && (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 text-left">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20">
                  ∞
                </div>

                <span className="text-sm font-semibold">SARO</span>

                <span className="text-xs text-white/30">
                  Local Test Response
                </span>
              </div>

              <p className="text-sm leading-6 text-white/70">
                ⚡ Got it. SARO received:
              </p>

              <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-purple-200">
                {message}
              </div>

              <p className="mt-4 text-xs text-white/30">
                This is a local test response. Real AI will be connected later.
              </p>
            </div>
          )}

          {/* Footer */}
          <p className="mt-10 text-xs text-white/20">
            SARO v0.1 • Local Test Build
          </p>
        </div>
      </section>
    </main>
  );
}