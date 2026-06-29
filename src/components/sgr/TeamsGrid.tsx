import { TEAMS } from "@/lib/sgr-data";
import { Users, AlertTriangle, ChevronRight } from "lucide-react";

const STATUS: Record<string, { label: string; cls: string }> = {
  operational: { label: "Operational", cls: "bg-success/10 text-success ring-success/20" },
  alert:       { label: "On Alert",    cls: "bg-destructive/10 text-destructive ring-destructive/20" },
  standby:     { label: "Standby",     cls: "bg-warning/10 text-warning ring-warning/20" },
};

export function TeamsGrid() {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-soft backdrop-blur-md">
      <header className="flex items-center justify-between border-b border-border/70 px-6 py-5 glass-tint">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Patrol Teams</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{TEAMS.length} active units across the corridor</p>
        </div>
        <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-light transition-colors">
          + New team
        </button>
      </header>

      <div className="grid flex-1 grid-cols-1 content-start gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
        {TEAMS.map((t) => {
          const s = STATUS[t.status];
          const pct = Math.round((t.online / t.members) * 100);
          return (
            <article
              key={t.id}
              className="group relative overflow-hidden rounded-xl border border-border/80 bg-card/70 p-4 backdrop-blur-sm transition-all hover:border-primary/25 hover:bg-card hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {t.code}
                  </div>
                  <div className="mt-1 text-base font-extrabold text-foreground">Team {t.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.section}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${s.cls}`}>
                  {s.label}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</div>
                  <div className="mt-0.5 text-sm font-bold text-foreground flex items-center justify-center gap-1">
                    <Users className="size-3.5 text-primary" /> {t.members}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Online</div>
                  <div className="mt-0.5 text-sm font-bold text-success">{t.online}/{t.members}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Issues</div>
                  <div className="mt-0.5 text-sm font-bold text-foreground flex items-center justify-center gap-1">
                    <AlertTriangle className="size-3.5 text-warning" /> {t.incidents}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Coverage</span>
                  <span className="font-semibold text-foreground">{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1C50A8] to-[#5B9BD5]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button className="mt-4 flex w-full items-center justify-between rounded-lg bg-secondary/80 px-3 py-2 text-xs font-semibold text-primary hover:bg-accent transition-colors">
                Open team
                <ChevronRight className="size-3.5" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
