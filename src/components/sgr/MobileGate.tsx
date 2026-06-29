import { Laptop, Monitor, TrainFront, Smartphone } from "lucide-react";

export function MobileGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile / tablet blocker — CSS-only, no flash */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary to-primary-deep px-6 text-white lg:hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-20 size-64 rounded-full bg-sky/20 blur-3xl" />
          <div className="absolute -right-16 bottom-16 size-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <TrainFront className="size-8" />
          </div>
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
            SGR Guardian
          </div>

          <div className="relative mx-auto mt-8 flex items-center justify-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Smartphone className="size-7 text-white/50" />
            </div>
            <div className="flex gap-1">
              <span className="size-1.5 rounded-full bg-white/30" />
              <span className="size-1.5 rounded-full bg-white/50" />
              <span className="size-1.5 rounded-full bg-white/30" />
            </div>
            <div className="grid size-14 place-items-center rounded-2xl bg-white/20 ring-2 ring-white/30 shadow-elevated">
              <Laptop className="size-7" />
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-extrabold leading-tight tracking-tight">
            Desktop required
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-white/75">
            SGR Guardian Command Center is built for corridor operations on a{" "}
            <span className="font-semibold text-white">laptop or desktop</span>. Please open
            this app on a larger screen to continue.
          </p>

          <div className="mt-8 space-y-2.5 rounded-xl bg-white/10 p-4 text-left ring-1 ring-white/15 backdrop-blur">
            <Tip icon={Monitor} text="Use a laptop or desktop computer" />
            <Tip icon={Laptop} text="Minimum recommended width: 1024px" />
            <Tip icon={TrainFront} text="Full map, SOS and team management" />
          </div>

          <p className="mt-6 text-[11px] text-white/45">
            Tanzania Railways Corporation · Command Dashboard
          </p>
        </div>
      </div>

      {/* App — desktop only */}
      <div className="hidden min-h-screen lg:block">{children}</div>
    </>
  );
}

function Tip({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-white/85">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10">
        <Icon className="size-4" />
      </div>
      {text}
    </div>
  );
}
