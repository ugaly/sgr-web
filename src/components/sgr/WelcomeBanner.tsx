import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const MOTTOS = [
  {
    eyebrow: "Corridor command",
    title: "Welcome back, Emmanuel.",
    sub: "Every kilometre of the Dar — Dodoma corridor is monitored and secure.",
  },
  {
    eyebrow: "Safety first",
    title: "Eyes on every kilometre of rail.",
    sub: "78 officers on duty · 96% corridor coverage right now.",
  },
  {
    eyebrow: "Rapid response",
    title: "Faster every shift.",
    sub: "Average alert-to-response time is down to 4m 12s this week.",
  },
  {
    eyebrow: "One command center",
    title: "Teams, supervisors & incidents — unified.",
    sub: "Coordinate the whole corridor from a single live dashboard.",
  },
];

export function WelcomeBanner() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MOTTOS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const m = MOTTOS[i];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-light to-primary-deep p-6 text-white shadow-elevated sm:p-7">
      {/* Decorative four-point stars */}
      <Star className="absolute right-[34%] top-6 size-10 text-white/15" />
      <Star className="absolute right-[20%] top-16 size-20 text-white/10" />
      <Star className="absolute right-[8%] bottom-6 size-14 text-white/15" />
      {/* glow orbs */}
      <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-sky/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/3 size-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex items-center justify-between gap-6">
        {/* Text — rotating */}
        <div key={i} className="min-w-0 max-w-xl animate-[welcomeIn_0.6s_ease-out]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="size-3.5" />
            {m.eyebrow}
          </div>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-[28px]">
            {m.title}
          </h2>
          <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-white/75">{m.sub}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("live-corridor-map")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-foreground/90"
            >
              View live corridor
              <span className="grid size-5 place-items-center rounded-full bg-white text-foreground">
                <ArrowRight className="size-3" />
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              {MOTTOS.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Show message ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === idx ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Animated 3D-style train illustration */}
        <div className="relative hidden shrink-0 md:block" style={{ perspective: "900px" }}>
          <div
            className="animate-[floaty_4s_ease-in-out_infinite]"
            style={{ transform: "rotateY(-14deg) rotateX(6deg)", transformStyle: "preserve-3d" }}
          >
            <TrainIllustration />
          </div>
          <div className="pointer-events-none absolute -bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded-[100%] bg-black/25 blur-md animate-[shadowPulse_4s_ease-in-out_infinite]" />
          {/* soft glow behind train */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden>
      <path d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0 Z" />
    </svg>
  );
}

function TrainIllustration() {
  return (
    <svg width="176" height="132" viewBox="0 0 176 132" fill="none" aria-hidden>
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#DCE9F8" />
        </linearGradient>
        <linearGradient id="nose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B9BD5" />
          <stop offset="100%" stopColor="#1C50A8" />
        </linearGradient>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10367D" />
          <stop offset="100%" stopColor="#081C45" />
        </linearGradient>
      </defs>

      {/* track */}
      <rect x="8" y="112" width="160" height="5" rx="2.5" fill="#ffffff" opacity="0.35" />
      <rect x="22" y="120" width="10" height="6" rx="2" fill="#ffffff" opacity="0.2" />
      <rect x="58" y="120" width="10" height="6" rx="2" fill="#ffffff" opacity="0.2" />
      <rect x="94" y="120" width="10" height="6" rx="2" fill="#ffffff" opacity="0.2" />
      <rect x="130" y="120" width="10" height="6" rx="2" fill="#ffffff" opacity="0.2" />

      {/* train body */}
      <path
        d="M30 36 C30 26 38 18 50 18 H150 C162 18 170 26 170 38 V92 C170 100 163 106 154 106 H30 C20 106 14 98 14 88 V70 C14 60 22 52 32 50 L30 50 Z"
        fill="url(#body)"
        transform="translate(-6 0)"
      />
      {/* nose */}
      <path d="M14 70 C14 60 22 52 32 50 L40 50 V104 H30 C20 104 14 98 14 88 Z" fill="url(#nose)" />
      {/* windshield */}
      <path d="M20 66 C22 60 27 56 33 55 V78 H22 C20 78 19 74 19 70 Z" fill="url(#win)" opacity="0.92" />
      {/* side windows */}
      <rect x="54" y="34" width="26" height="20" rx="5" fill="url(#win)" />
      <rect x="88" y="34" width="26" height="20" rx="5" fill="url(#win)" />
      <rect x="122" y="34" width="26" height="20" rx="5" fill="url(#win)" />
      {/* door */}
      <rect x="54" y="62" width="92" height="34" rx="6" fill="#EFF4FB" />
      <rect x="96" y="62" width="2.5" height="34" fill="#C7D3E6" />
      {/* accent stripe */}
      <rect x="44" y="58" width="120" height="4" rx="2" fill="#F79009" />
      {/* headlight */}
      <circle cx="22" cy="92" r="4" fill="#FDB022" />
      {/* wheels */}
      <circle cx="58" cy="106" r="9" fill="#10367D" stroke="#fff" strokeWidth="2.5" />
      <circle cx="118" cy="106" r="9" fill="#10367D" stroke="#fff" strokeWidth="2.5" />
      <circle cx="58" cy="106" r="3" fill="#fff" />
      <circle cx="118" cy="106" r="3" fill="#fff" />
    </svg>
  );
}
