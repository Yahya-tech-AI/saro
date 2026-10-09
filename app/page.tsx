
"use client";

import { useEffect, useState, type FormEvent } from "react";

type IconName =
  | "home"
  | "chat"
  | "projects"
  | "agents"
  | "research"
  | "brain"
  | "user"
  | "plus"
  | "file"
  | "web"
  | "image";

function AppIcon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...shared}>
          <path d="m3.5 10 8.5-7 8.5 7" />
          <path d="M5.5 9v11h13V9" />
          <path d="M9.5 20v-6h5v6" />
        </svg>
      );

    case "chat":
      return (
        <svg {...shared}>
          <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.4-.7L4 20l1.3-4A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
          <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" strokeWidth="2.5" />
        </svg>
      );

    case "projects":
      return (
        <svg {...shared}>
          <path d="m12 2.8 9 5.1v8.2l-9 5.1-9-5.1V7.9l9-5.1Z" />
          <path d="m3.5 8.2 8.5 4.9 8.5-4.9M12 13.1v7.7" />
        </svg>
      );

    case "agents":
      return (
        <svg {...shared}>
          <path d="m13 2.5-9 11h7l-1 8 10-12h-7l1-7Z" />
        </svg>
      );

    case "research":
      return (
        <svg {...shared}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
          <path d="M8.3 10.8h5M10.8 8.3v5" />
        </svg>
      );

    case "brain":
      return (
        <svg {...shared}>
          <path d="M9.2 4.2a3.2 3.2 0 0 0-5.5 2.3 3.5 3.5 0 0 0-.3 6.1 3.6 3.6 0 0 0 3.1 5.5 3.1 3.1 0 0 0 2.7 1.7H12V4.9a3 3 0 0 0-2.8-.7Z" />
          <path d="M14.8 4.2a3.2 3.2 0 0 1 5.5 2.3 3.5 3.5 0 0 1 .3 6.1 3.6 3.6 0 0 1-3.1 5.5 3.1 3.1 0 0 1-2.7 1.7H12V4.9a3 3 0 0 1 2.8-.7Z" />
          <path d="M8 8.2c1.5 0 2.3 1 2.3 2.2M7 14.4c1.5-.2 2.6.6 3.1 1.8M16 8.2c-1.5 0-2.3 1-2.3 2.2M17 14.4c-1.5-.2-2.6.6-3.1 1.8" />
        </svg>
      );

    case "user":
      return (
        <svg {...shared}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.7-3.3 3.2-5 7-5s6.3 1.7 7 5" />
        </svg>
      );

    case "plus":
      return (
        <svg {...shared}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "file":
      return (
        <svg {...shared}>
          <path d="M6 3.5h8l4 4V20H6z" />
          <path d="M14 3.5V8h4M9 12h6M9 16h6" />
        </svg>
      );

    case "web":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );

    case "image":
      return (
        <svg {...shared}>
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m4 17 5-5 4 4 3-3 4 4" />
        </svg>
      );
  }
}

const modes = [
  { name: "Buddy", icon: "🧠" },
  { name: "Code", icon: "💻" },
  { name: "Builder", icon: "🛠️" },
  { name: "Agent", icon: "⚡" },
  { name: "Research", icon: "🌐" },
  { name: "Overnight", icon: "🌙" },
];

const navigation: {
  name: string;
  icon: IconName;
}[] = [
  { name: "Home", icon: "home" },
  { name: "Chat", icon: "chat" },
  { name: "Projects", icon: "projects" },
  { name: "Agents", icon: "agents" },
  { name: "Research", icon: "research" },
];

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home");
  const [activeModes, setActiveModes] = useState<string[]>(["Buddy"]);
  const [isSending, setIsSending] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");
  const [modelStatus, setModelStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  const currentCommand =
    activeModes.length > 0
      ? `/${activeModes.map((mode) => mode.toLowerCase()).join("+")}`
      : "";

  useEffect(() => {
    let cancelled = false;

    async function checkModel() {
      try {
        const response = await fetch("/api/aro-mini", {
          method: "GET",
          cache: "no-store",
        });

        if (!cancelled) {
          setModelStatus(response.ok ? "online" : "offline");
        }
      } catch {
        if (!cancelled) {
          setModelStatus("offline");
        }
      }
    }

    void checkModel();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "INPUT" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        document.querySelector<HTMLTextAreaElement>("textarea")?.focus();
      }

      if (event.key === "Escape") {
        setShowAddMenu(false);
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  function selectMode(modeName: string, combine: boolean) {
    let nextModes: string[];

    if (combine) {
      nextModes = activeModes.includes(modeName)
        ? activeModes.filter((mode) => mode !== modeName)
        : [...activeModes, modeName];
    } else {
      nextModes = [modeName];
    }

    if (nextModes.length === 0) {
      nextModes = [modeName];
    }

    setActiveModes(nextModes);

    setMessage((current) => {
      const prompt = current.replace(/^\/[a-z+]+\s*/i, "").trim();
      const command = `/${nextModes
        .map((mode) => mode.toLowerCase())
        .join("+")}`;

      return prompt ? `${command} ${prompt}` : `${command} `;
    });

    setError("");
  }

  function clearChat() {
    setMessages([]);
    setMessage("");
    setError("");
    setActiveModes(["Buddy"]);
    setShowAddMenu(false);
  }

  async function handleSend(event?: FormEvent) {
    event?.preventDefault();

    if (!message.trim() || isSending) {
      return;
    }

    const rawPrompt = message.trim();
    const prompt = rawPrompt.replace(/^\/[a-z+]+\s*/i, "").trim();

    if (!prompt) {
      setError("Type a message after selecting a mode.");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: prompt,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/aro-mini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          modes: activeModes,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `Aro Mini API returned HTTP ${response.status}.`,
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The API returned no text response.");
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.reply,
        },
      ]);

      setModelStatus("online");
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "Unknown connection error.";

      setError(`Couldn't get a response from Aro Mini. ${reason}`);
      setModelStatus("offline");
    } finally {
      setIsSending(false);
    }
  }

const statusLabel = {
  checking: "CHECKING AI",
  online: "AI ONLINE",
  offline: "AI OFFLINE",
}[modelStatus];

  const statusColor = {
    checking: "bg-yellow-400",
    online: "bg-green-400",
    offline: "bg-red-400",
  }[modelStatus];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
      {/* Custom SARO scrollbar */}
      <style jsx global>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #7135a8 #08080b;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #08080b;
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            #a855f7 0%,
            #7135a8 48%,
            #22c55e 100%
          );
          border: 2px solid #08080b;
          border-radius: 999px;
          transition: filter 200ms ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            #c084fc 0%,
            #9333ea 48%,
            #4ade80 100%
          );
          border-width: 1px;
        }

        ::-webkit-scrollbar-corner {
          background: #08080b;
        }

        html {
          scrollbar-gutter: stable;
          scroll-behavior: smooth;
        }

        body {
          background-color: #050506;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[35%] top-[15%] h-[550px] w-[550px] rounded-full bg-purple-700/[0.13] blur-[160px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-green-500/[0.06] blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050506_80%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/[0.07] bg-[#08080b]/95 backdrop-blur-2xl transition-[width] duration-300 ${
          sidebarOpen ? "w-[250px]" : "w-[72px]"
        }`}
      >
        {/* The SARO logo itself toggles the sidebar */}
        <div
          className={`flex h-[76px] shrink-0 items-center overflow-hidden border-b border-white/[0.06] px-3 ${
            sidebarOpen ? "gap-3" : "justify-center"
          }`}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl outline-none transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <span className="absolute inset-0 rounded-xl bg-purple-500/0 transition-colors duration-300 group-hover:bg-purple-500/10" />
            <img
              src="/brand/saro-icon.svg"
              alt="SARO"
              className="relative h-10 w-10 rounded-xl transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.65)]"
            />
          </button>

          {sidebarOpen && (
            <div className="min-w-0 overflow-hidden">
              <div className="whitespace-nowrap text-sm font-bold tracking-[0.24em]">
                SARO
              </div>
              <div className="mt-1 whitespace-nowrap text-[9px] tracking-[0.3em] text-white/35">
                POWERED BY ARO
              </div>
            </div>
          )}
        </div>

        {/* Navigation and model */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-5">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[9px] font-semibold tracking-[0.25em] text-white/30">
              WORKSPACE
            </p>
          )}

          <nav className="space-y-1" aria-label="Workspace navigation">
            {navigation.map((item) => {
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActivePage(item.name)}
                  title={!sidebarOpen ? item.name : undefined}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.name}
                  className={`group flex h-11 w-full items-center rounded-xl text-left text-sm transition-all duration-200 ${
                    sidebarOpen
                      ? "gap-3 px-3"
                      : "justify-center px-0"
                  } ${
                    active
                      ? "border border-purple-400/20 bg-purple-500/[0.12] text-white shadow-[inset_0_0_18px_rgba(168,85,247,0.04)]"
                      : "border border-transparent text-white/50 hover:bg-white/[0.045] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-purple-400/[0.13] text-purple-200"
                        : "bg-white/[0.025] text-white/55 group-hover:bg-white/[0.06] group-hover:text-purple-200"
                    }`}
                  >
                    <AppIcon name={item.icon} className="h-[19px] w-[19px]" />
                  </span>

                  {sidebarOpen && (
                    <span className="truncate">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="my-5 h-px bg-white/[0.07]" />

          {sidebarOpen && (
            <p className="mb-3 px-3 text-[9px] font-semibold tracking-[0.25em] text-white/30">
              YOUR MODEL
            </p>
          )}

          {/* Model card: aligned in both sidebar sizes */}
          <div
            title={
              sidebarOpen
                ? `Aro Mini v0.1 · ${statusLabel}`
                : `Aro Mini v0.1 · ${statusLabel}`
            }
            className={`rounded-xl border border-green-400/10 bg-green-400/[0.035] transition-all duration-300 ${
              sidebarOpen
                ? "p-3"
                : "mx-auto flex h-12 w-12 items-center justify-center p-0"
            }`}
          >
            {sidebarOpen ? (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-300/10 bg-green-300/[0.06] text-green-100/80">
                  <AppIcon name="brain" className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs font-semibold text-white/90">
                    Aro Mini
                  </p>

                  <p className="mt-1 text-[10px] text-white/45">
                    Experimental · v0.1
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusColor} ${
                        modelStatus === "checking" ? "animate-pulse" : ""
                      }`}
                    />
                    <p
                      className={`text-[9px] font-medium tracking-[0.08em] ${
                        modelStatus === "online"
                          ? "text-green-300/80"
                          : modelStatus === "checking"
                            ? "text-yellow-200/70"
                            : "text-red-300/75"
                      }`}
                    >
                      {statusLabel}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-green-300/10 bg-green-300/[0.06] text-green-100/80">
                <AppIcon name="brain" className="h-6 w-6" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#08080b] ${statusColor} ${
                    modelStatus === "checking" ? "animate-pulse" : ""
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Signed-out profile footer */}
        <div className="shrink-0 border-t border-white/[0.06] p-3">
          <div
            title="Account unavailable — not signed in"
            aria-disabled="true"
            className={`flex min-h-[52px] w-full items-center overflow-hidden rounded-xl bg-white/[0.025] opacity-55 ${
              sidebarOpen
                ? "gap-3 p-2"
                : "mx-auto h-11 w-11 min-h-0 justify-center p-0"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-dashed border-white/[0.12] bg-white/[0.02] text-white/35">
              <AppIcon name="user" className="h-5 w-5" />
            </div>

            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="whitespace-nowrap text-xs font-medium text-white/55">
                  Guest
                </p>
                <p className="mt-1 whitespace-nowrap text-[10px] text-white/30">
                  Not signed in
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main workspace */}
      <div
        className={`relative z-10 min-h-screen transition-[margin] duration-300 ${
          sidebarOpen ? "ml-[250px]" : "ml-[72px]"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#050506]/75 px-4 backdrop-blur-xl sm:px-6 md:px-9">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.24em] text-purple-300/70">
              SARO WORKSPACE
            </p>
            <p className="mt-1 text-xs text-white/60">{activePage}</p>
          </div>

          <div
            className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-2 sm:px-3"
            title={`Aro Mini status: ${statusLabel}`}
            role="status"
            aria-live="polite"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusColor} ${
                modelStatus === "checking" ? "animate-pulse" : ""
              }`}
            />
            <span className="text-[8px] tracking-wider text-white/55 sm:text-[9px]">
              {statusLabel}
            </span>
          </div>
        </header>

        {/* Chat workspace */}
        <section className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-5xl flex-col px-3 pb-10 pt-8 sm:px-6 md:px-8">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
              <div className="relative mb-7">
                <div className="absolute -inset-8 rounded-[40px] bg-purple-600/20 blur-3xl" />
                <img
                  src="/brand/saro-animated.svg"
                  alt="SARO"
                  className="relative h-24 w-24 rounded-[26px] border border-purple-400/20 bg-black/50 p-1 shadow-[0_0_65px_rgba(112,0,255,0.17)] sm:h-28 sm:w-28"
                />
              </div>

              <p className="mb-4 text-[9px] font-semibold tracking-[0.4em] text-purple-300/70">
                YOUR AI WORKSPACE
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Make room for{" "}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-green-300 bg-clip-text text-transparent">
                  ideas.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">
                One AI. Every mode. Fully yours.
                <br />
                Explore ideas, write code, and build your next project.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {[
                  "Explain a concept",
                  "Help me write code",
                  "Plan a project",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setMessage(suggestion);
                      setError("");
                    }}
                    className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs text-white/55 transition hover:border-purple-400/30 hover:bg-purple-500/[0.08] hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 py-5">
              {messages.map((item) => (
                <article
                  key={item.id}
                  className={`flex gap-3 ${
                    item.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {item.role === "assistant" && (
                    <img
                      src="/brand/saro-icon.svg"
                      alt="SARO"
                      className="h-8 w-8 shrink-0 rounded-lg"
                    />
                  )}

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 ${
                      item.role === "user"
                        ? "border border-purple-400/15 bg-purple-500/[0.12] text-white"
                        : "border border-white/[0.07] bg-white/[0.025] text-white/80"
                    }`}
                  >
                    {item.content}
                  </div>
                </article>
              ))}

              {isSending && (
                <div
                  role="status"
                  className="flex items-center gap-3 text-sm text-white/45"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
                  Aro Mini is processing your request…
                </div>
              )}
            </div>
          )}

          {/* Message composer */}
          <div className="mx-auto mt-6 w-full max-w-3xl">
            {error && (
              <div
                role="alert"
                className="mb-3 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-3 text-xs leading-5 text-red-200/90"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSend}
              className="overflow-visible rounded-[24px] border border-purple-400/15 bg-[#0b0b10]/95 shadow-[0_0_65px_rgba(112,0,255,0.07)] transition focus-within:border-purple-400/35 focus-within:shadow-[0_0_80px_rgba(112,0,255,0.12)]"
            >
              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Message SARO…"
                aria-label="Message SARO"
                rows={3}
                className="max-h-48 min-h-[100px] w-full resize-y bg-transparent px-5 py-5 text-sm leading-7 text-white outline-none placeholder:text-white/25 sm:px-6"
              />

              <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Add menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAddMenu((open) => !open)}
                      aria-expanded={showAddMenu}
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <AppIcon name="plus" className="h-4 w-4" />
                      Add
                    </button>

                    {showAddMenu && (
                      <div className="absolute bottom-12 left-0 z-30 w-44 rounded-xl border border-white/10 bg-[#101015] p-1.5 shadow-2xl">
                        {(
                          [
                            { label: "File", icon: "file" },
                            { label: "Web", icon: "web" },
                            { label: "Image", icon: "image" },
                            { label: "Project", icon: "projects" },
                          ] as { label: string; icon: IconName }[]
                        ).map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setShowAddMenu(false)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-white/55 transition hover:bg-purple-500/10 hover:text-white"
                          >
                            <AppIcon
                              name={item.icon}
                              className="h-4 w-4"
                            />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active modes */}
                  {activeModes.map((name) => (
                    <span
                      key={name}
                      className="rounded-lg border border-purple-400/15 bg-purple-500/[0.08] px-2.5 py-2 text-xs text-purple-200"
                    >
                      {modes.find((mode) => mode.name === name)?.icon} {name}
                    </span>
                  ))}

                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="rounded-lg px-2 py-2 text-xs text-white/35 transition hover:text-white"
                    >
                      New chat
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!message.trim() || isSending}
                  className="rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 px-6 py-2.5 text-sm font-semibold shadow-[0_0_25px_rgba(112,0,255,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {isSending ? "Thinking…" : "Send ↑"}
                </button>
              </div>
            </form>

            {/* Composer hints */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[9px] text-white/30">
              <span>Enter to send · Shift + Enter for a new line</span>
              <span>{currentCommand || "/buddy"}</span>
            </div>

            {/* Mode selector */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {modes.map((mode) => {
                const active = activeModes.includes(mode.name);

                return (
                  <button
                    key={mode.name}
                    type="button"
                    aria-pressed={active}
                    onClick={(event) =>
                      selectMode(
                        mode.name,
                        event.ctrlKey || event.metaKey,
                      )
                    }
                    className={`rounded-full border px-3.5 py-2 text-xs transition ${
                      active
                        ? "border-purple-400/35 bg-purple-500/[0.12] text-white"
                        : "border-white/[0.07] bg-white/[0.02] text-white/45 hover:border-purple-400/25 hover:text-white"
                    }`}
                  >
                    {mode.icon} {mode.name}
                  </button>
                );
              })}
            </div>

            {activeModes.length > 1 && (
              <p className="mt-3 text-center text-[10px] text-purple-200/60">
                Combined mode: {currentCommand} · Ctrl/Cmd-click to combine
              </p>
            )}

            <p className="mt-6 text-center text-[9px] tracking-[0.2em] text-white/20">
              SARO · ARO MINI EXPERIMENTAL INTEGRATION
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}