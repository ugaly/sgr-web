import { SUPERVISORS } from "@/lib/sgr-data";
import { Phone, MessageSquare } from "lucide-react";

function initials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

export function SupervisorsList() {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Supervisors on Duty</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{SUPERVISORS.filter(s => s.online).length} of {SUPERVISORS.length} online</p>
        </div>
        <button className="text-xs font-semibold text-primary hover:text-primary-light">View all</button>
      </header>

      <ul className="divide-y divide-border">
        {SUPERVISORS.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-6 py-4 hover:bg-secondary/60 transition-colors">
            <div className="relative">
              <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary text-[12px] font-bold ring-2 ring-card">
                {initials(s.name)}
              </div>
              <span
                className={[
                  "absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-card",
                  s.online ? "bg-success" : "bg-offline",
                ].join(" ")}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <div className="truncate text-sm font-semibold text-foreground">{s.name}</div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.rank}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {s.zone} · {s.teams} teams · {s.officers} officers
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="grid size-8 place-items-center rounded-lg bg-secondary text-primary hover:bg-accent">
                <Phone className="size-4" />
              </button>
              <button className="grid size-8 place-items-center rounded-lg bg-secondary text-primary hover:bg-accent">
                <MessageSquare className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
