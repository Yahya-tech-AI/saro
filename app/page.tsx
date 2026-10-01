"use client";

import { useEffect, useState, type ReactNode } from "react";

const modes = [
  { name: "Buddy", icon: "🧠" },
  { name: "Code", icon: "💻" },
  { name: "Builder", icon: "🛠️" },
  { name: "Agent", icon: "⚡" },
  { name: "Research", icon: "🌐" },
  { name: "Overnight", icon: "🌙" },
];

const navigation = [
  { name: "Home", icon: "⌂" },
  { name: "Chat", icon: "✦" },
  { name: "Projects", icon: "◈" },
  { name: "Agents", icon: "⚡" },
  { name: "Research", icon: "◎" },
];

function SidebarIcon({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-2 text-sm transition-all duration-300 ${
        active
          ? "bg-purple-500/[0.12] text-purple-200 shadow-[0_0_15px_rgba(112,0,255,0.1)]"
          : "bg-white/[0.025] text-white/45 group-hover:bg-white/[0.05] group-hover:text-white/80"
      }`}
    >
      <span className="flex h-full w-full items-center justify-center">
        {children}
      </span>
    </span>
  );
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home");
  const [activeModes, setActiveModes] = useState<string[]>(["Buddy"]);
  const [isSending, setIsSending] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const currentCommand =
    activeModes.length > 0
      ? `/${activeModes.map((mode) => mode.toLowerCase()).join("+")}`
      : "";

  function handleSend() {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setSent(false);

    window.setTimeout(() => {
      setSent(true);
      setIsSending(false);
    }, 450);
  }

  function clearComposer() {
    setMessage("");
    setSent(false);
    setActiveModes(["Buddy"]);
  }

  function selectMode(modeName: string, modifierPressed: boolean) {
    const command = modeName.toLowerCase();

    if (modifierPressed) {
      setActiveModes((current) => {
        if (current.includes(modeName)) {
          return current;
        }

        return [...current, modeName];
      });

      setMessage((current) => {
        const existing = current
          .trim()
          .replace(/^\//, "")
          .split("+")
          .filter(Boolean);

        if (existing.includes(command)) {
          return `/${existing.join("+")} `;
        }

        return `/${[...existing, command].join("+")} `;
      });
    } else {
      setActiveModes([modeName]);
      setMessage(`/${command} `);
    }

    setSent(false);
  }

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

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">
      {/* ========================================================= */}
      {/* AMBIENT BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-[42%] top-[32%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/[0.16] blur-[180px] transition-transform duration-1000 ${
            logoHovered ? "scale-110" : "scale-100"
          }`}
        />

        <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-violet-700/[0.10] blur-[170px]" />

        <div className="absolute -right-48 bottom-[-100px] h-[600px] w-[600px] rounded-full bg-green-500/[0.07] blur-[190px]" />

        <div className="absolute left-[70%] top-[8%] h-[280px] w-[280px] rounded-full bg-fuchsia-500/[0.07] blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_76%)]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* SIDEBAR */}
      {/* ========================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/[0.06] bg-[#060608]/90 backdrop-blur-2xl transition-[width] duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
          sidebarOpen ? "w-[260px]" : "w-[76px]"
        }`}
      >
        {/* BRAND */}

        <div className="group relative flex h-[78px] items-center border-b border-white/[0.06] px-3">
          <div
            className={`flex w-full items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            }`}
          >
            <img
              src="/brand/saro-icon.svg"
              alt="Saro"
              className="h-11 w-11 shrink-0 rounded-xl shadow-[0_0_28px_rgba(112,0,255,0.3)]"
            />

            <div
              className={`overflow-hidden transition-all duration-500 ${
                sidebarOpen
                  ? "w-[140px] opacity-100"
                  : "pointer-events-none w-0 opacity-0"
              }`}
            >
              <div className="whitespace-nowrap text-sm font-bold tracking-[0.25em]">
                SARO
              </div>

              <div className="mt-0.5 whitespace-nowrap text-[8px] tracking-[0.35em] text-white/25">
                BY ARO
              </div>
            </div>
          </div>

          {/* SIDEBAR TOGGLE */}

          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="absolute -right-4 top-1/2 z-[70] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-purple-400/20 bg-[#09090d]/95 text-white/40 opacity-0 shadow-[0_0_25px_rgba(112,0,255,0.15)] backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white hover:shadow-[0_0_30px_rgba(112,0,255,0.35)]"
          >
            <span
              className={`text-sm transition-transform duration-500 ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            >
              ‹
            </span>
          </button>
        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-hidden px-3 py-5">
          <div
            className={`mb-3 px-3 text-[8px] font-bold tracking-[0.3em] text-white/20 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            WORKSPACE
          </div>

          <div className="space-y-1">
            {navigation.map((item) => {
              const active = activePage === item.name;

              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setActivePage(item.name)}
                  title={!sidebarOpen ? item.name : undefined}
                  className={`group relative flex h-12 w-full items-center rounded-xl px-2 transition-all duration-300 ${
                    sidebarOpen ? "gap-3" : "justify-center"
                  } ${
                    active
                      ? "bg-purple-500/[0.12] text-white"
                      : "text-white/35 hover:bg-white/[0.035] hover:text-white"
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 h-5 w-[2px] rounded-full bg-gradient-to-b from-purple-400 to-green-400 shadow-[0_0_12px_#7000ff]" />
                  )}

                  <SidebarIcon active={active}>
                    {item.icon}
                  </SidebarIcon>

                  <span
                    className={`whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                      sidebarOpen
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none -translate-x-3 opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="my-5 h-px bg-white/[0.05]" />

          <div
            className={`mb-3 px-3 text-[8px] font-bold tracking-[0.3em] text-white/20 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            SYSTEM
          </div>

          {/* SETTINGS */}

          <button
            type="button"
            title={!sidebarOpen ? "Settings" : undefined}
            className={`group flex h-12 w-full items-center rounded-xl px-2 text-white/35 transition-all duration-300 hover:bg-white/[0.035] hover:text-white ${
              sidebarOpen ? "gap-3" : "justify-center"
            }`}
          >
            <SidebarIcon>⚙</SidebarIcon>

            <span
              className={`whitespace-nowrap text-xs transition-all duration-300 ${
                sidebarOpen
                  ? "opacity-100"
                  : "pointer-events-none -translate-x-3 opacity-0"
              }`}
            >
              Settings
            </span>
          </button>
        </div>

        {/* GUEST PROFILE */}

        <div className="border-t border-white/[0.06] p-3">
          <button
            type="button"
            className={`group flex w-full items-center rounded-xl bg-white/[0.025] p-2 transition-all duration-300 hover:bg-white/[0.05] ${
              sidebarOpen ? "gap-3" : "justify-center"
            }`}
          >
            {/* Empty profile icon */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.025] p-2 text-white/25">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-full w-full"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />

                <path
                  d="M5.5 20c.8-3.5 3-5.5 6.5-5.5s5.7 2 6.5 5.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                sidebarOpen
                  ? "w-[130px] opacity-100"
                  : "pointer-events-none w-0 opacity-0"
              }`}
            >
              <div className="whitespace-nowrap text-xs font-semibold text-white/50">
                Guest
              </div>

              <div className="mt-0.5 whitespace-nowrap text-[9px] text-white/20">
                Not signed in
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================================= */}

      <div
        className={`relative z-10 min-h-screen transition-[margin] duration-500 ${
          sidebarOpen ? "ml-[260px]" : "ml-[76px]"
        }`}
      >
        {/* NAVBAR */}

        <header className="flex h-[78px] items-center justify-between border-b border-white/[0.06] px-6 md:px-10">
          <div>
            <div className="text-[9px] font-bold tracking-[0.3em] text-purple-300/40">
              SARO WORKSPACE
            </div>

            <div className="mt-1 text-xs font-medium text-white/50">
              {activePage}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 sm:flex">
              <span className="text-[9px] text-white/20">Press</span>

              <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-white/30">
                /
              </kbd>

              <span className="text-[9px] text-white/20">
                to focus
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/[0.05] px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />

              <span className="text-[9px] font-medium text-green-300">
                ONLINE
              </span>
            </div>
          </div>
        </header>

        {/* HERO */}

        <section className="flex min-h-[calc(100vh-78px)] items-center justify-center px-5 pb-20 pt-10">
          <div className="w-full max-w-4xl text-center">
            {/* LOGO */}

            <div
              className="group relative mx-auto mb-9 flex h-32 w-32 items-center justify-center"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <div
                className={`absolute inset-[-25px] rounded-[45px] bg-purple-600/20 blur-[45px] transition-all duration-700 ${
                  logoHovered
                    ? "scale-125 opacity-100"
                    : "scale-100 opacity-70"
                }`}
              />

              <div
                className={`absolute inset-[-12px] rounded-[40px] border border-dashed border-purple-400/[0.08] transition-transform duration-1000 ${
                  logoHovered ? "rotate-180 scale-110" : ""
                }`}
              />

              <div
                className={`relative rounded-[32px] border bg-black/50 p-1 backdrop-blur-xl transition-all duration-500 ${
                  logoHovered
                    ? "scale-110 border-purple-400/50 shadow-[0_0_100px_rgba(112,0,255,0.45)]"
                    : "border-purple-400/20 shadow-[0_0_70px_rgba(112,0,255,0.2)]"
                }`}
              >
                <img
                  src="/brand/saro-animated.svg"
                  alt="Saro"
                  className="h-28 w-28 rounded-[28px]"
                />
              </div>

              {/* LOGO SIDEBAR BUTTON */}

              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label={
                  sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                }
                title={
                  sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                }
                className={`pointer-events-none absolute -right-16 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-purple-400/25 bg-[#09090d]/90 text-white/50 shadow-[0_0_30px_rgba(112,0,255,0.18)] backdrop-blur-xl transition-all duration-500 ${
                  logoHovered
                    ? "pointer-events-auto translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                } hover:scale-110 hover:border-purple-400/60 hover:bg-purple-500/10 hover:text-white hover:shadow-[0_0_40px_rgba(112,0,255,0.4)]`}
              >
                <span
                  className={`text-lg transition-transform duration-500 ${
                    sidebarOpen ? "" : "rotate-180"
                  }`}
                >
                  ‹
                </span>
              </button>
            </div>

            {/* EYEBROW */}

            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/40" />

              <p className="text-[9px] font-bold tracking-[0.4em] text-purple-300/70">
                PERSONAL AI WORKSPACE
              </p>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-green-500/40" />
            </div>

            {/* TITLE */}

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Meet{" "}
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-green-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(112,0,255,0.3)]">
                SARO.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-lg">
              One AI. Every mode. Fully yours.
              <br />
              Build, code, research, create, and automate from one workspace.
            </p>

            {/* COMPOSER */}

            <div className="mx-auto mt-10 overflow-visible rounded-[28px] border border-purple-400/[0.14] bg-[#09090d]/90 text-left shadow-[0_0_80px_rgba(112,0,255,0.08)] backdrop-blur-2xl transition-all duration-500 focus-within:border-purple-400/40 focus-within:shadow-[0_0_100px_rgba(112,0,255,0.15)]">
              <div className="relative">
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
                  className="min-h-[155px] w-full resize-none bg-transparent px-6 py-6 text-sm leading-7 text-white outline-none placeholder:text-white/[0.16]"
                />

                {message && (
                  <button
                    type="button"
                    onClick={clearComposer}
                    className="absolute right-4 top-4 rounded-lg bg-white/[0.04] px-2 py-1 text-[9px] text-white/20 transition hover:bg-white/[0.08] hover:text-white/60"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* COMPOSER CONTROLS */}

              <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {/* ADD MENU */}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAddMenu((open) => !open)}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-white/40 transition hover:border-purple-400/30 hover:bg-purple-500/[0.08] hover:text-white"
                    >
                      ＋ Add
                    </button>

                    {showAddMenu && (
                      <div className="absolute bottom-12 left-0 z-30 w-48 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0f]/95 p-1.5 shadow-2xl backdrop-blur-2xl">
                        {[
                          ["📎", "File"],
                          ["🌐", "Web"],
                          ["🖼️", "Image"],
                          ["📁", "Project"],
                        ].map(([icon, name]) => (
                          <button
                            type="button"
                            key={name}
                            onClick={() => setShowAddMenu(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-white/45 transition hover:bg-purple-500/10 hover:text-white"
                          >
                            <span>{icon}</span>
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ACTIVE MODES */}

                  {activeModes.map((modeName) => {
                    const mode = modes.find(
                      (item) => item.name === modeName,
                    );

                    return (
                      <span
                        key={modeName}
                        className="rounded-xl border border-purple-400/15 bg-purple-500/[0.08] px-3 py-2 text-xs text-purple-200 shadow-[0_0_15px_rgba(112,0,255,0.05)]"
                      >
                        {mode?.icon} {modeName}
                      </span>
                    );
                  })}

                  <span className="hidden text-[9px] text-white/[0.14] lg:block">
                    Ctrl + Click to combine
                  </span>
                </div>

                {/* SEND */}

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className="rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 px-7 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(112,0,255,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(208,0,255,0.45)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                >
                  {isSending ? "Thinking..." : "Send →"}
                </button>
              </div>
            </div>

            {/* MODES */}

            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {modes.map((mode) => {
                const active = activeModes.includes(mode.name);

                return (
                  <button
                    type="button"
                    key={mode.name}
                    onClick={(e) =>
                      selectMode(
                        mode.name,
                        e.ctrlKey || e.metaKey,
                      )
                    }
                    className={`group relative overflow-hidden rounded-full border px-4 py-2.5 text-xs transition-all duration-300 ${
                      active
                        ? "border-purple-400/40 bg-purple-500/[0.14] text-white shadow-[0_0_25px_rgba(112,0,255,0.12)]"
                        : "border-white/[0.07] bg-white/[0.025] text-white/35 hover:border-purple-400/30 hover:bg-purple-500/[0.08] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.10] via-transparent to-green-500/[0.08]" />
                    )}

                    <span className="relative">
                      {mode.icon} {mode.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* COMBINED COMMAND */}

            {activeModes.length > 1 && (
              <div className="mx-auto mt-5 w-fit rounded-full border border-purple-400/10 bg-purple-500/[0.04] px-4 py-2">
                <span className="text-[9px] text-white/20">
                  COMBINED MODE
                </span>

                <span className="ml-2 font-mono text-[10px] text-purple-300/70">
                  {currentCommand}
                </span>
              </div>
            )}

            {/* RESPONSE */}

            {sent && (
              <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-green-500/[0.025] p-5 text-left shadow-[0_0_60px_rgba(112,0,255,0.08)] backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src="/brand/saro-icon.svg"
                    alt="Saro"
                    className="h-8 w-8 rounded-lg"
                  />

                  <div>
                    <div className="text-sm font-semibold">SARO</div>

                    <div className="flex items-center gap-1 text-[9px] text-green-400/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Local Test Response
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-6 text-white/70">
                  ⚡ Got it. SARO received:
                </p>

                <div className="mt-3 rounded-xl border border-white/[0.05] bg-black/30 p-4 font-mono text-sm text-purple-200">
                  {message}
                </div>

                <p className="mt-4 text-[10px] text-white/20">
                  Real AI engine will be connected later.
                </p>
              </div>
            )}

            {/* STATUS */}

            <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 text-[9px] tracking-[0.15em] text-white/[0.18]">
              <span>⚡ AI READY</span>
              <span>•</span>
              <span>∞ SARO ENGINE</span>
              <span>•</span>
              <span>POSTGRESQL</span>
              <span>•</span>
              <span>ONLINE</span>
            </div>

            <p className="mt-6 text-[9px] tracking-[0.3em] text-white/[0.12]">
              SARO v0.1 • LOCAL TEST BUILD
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}