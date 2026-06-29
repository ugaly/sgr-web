import { Fragment, useState } from "react";
import { INCIDENTS, type Incident } from "@/lib/sgr-data";
import { ChevronDown, MapPin, Phone, MessageSquare, Navigation, User2, Clock, Hash, ExternalLink } from "lucide-react";
import { Stepper, type Step } from "./Stepper";

const STATUS_STYLE: Record<Incident["status"], string> = {
  Submitted:     "bg-info/10 text-info ring-info/20",
  "In Progress": "bg-warning/10 text-warning ring-warning/20",
  Review:        "bg-sky/15 text-primary ring-sky/30",
  Resolved:      "bg-success/10 text-success ring-success/20",
};

const PRIORITY_DOT: Record<Incident["priority"], string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-info",
};

const STATUS_INDEX: Record<Incident["status"], number> = {
  Submitted: 0,
  "In Progress": 1,
  Review: 2,
  Resolved: 3,
};

function buildSteps(i: Incident): Step[] {
  const idx = STATUS_INDEX[i.status];
  return [
    { key: "sub", label: "Submitted", hint: `Reported by ${i.reporter}`, time: i.time, by: i.team },
    { key: "prog", label: "Acknowledged", hint: idx >= 1 ? "Dispatched patrol unit" : "Awaiting supervisor", time: idx >= 1 ? "+3 min" : undefined },
    { key: "rev", label: "Under Review", hint: idx >= 2 ? "Evidence collected, supervisor reviewing" : "Pending field report", time: idx >= 2 ? "+18 min" : undefined },
    { key: "res", label: "Resolved", hint: idx >= 3 ? "Incident closed and logged" : "Pending closure", time: idx >= 3 ? "+42 min" : undefined },
  ];
}

export function IncidentsTable() {
  const [openId, setOpenId] = useState<string | null>(INCIDENTS[0]?.id ?? null);
  const [filter, setFilter] = useState<"All" | Incident["status"]>("All");

  const rows = filter === "All" ? INCIDENTS : INCIDENTS.filter((i) => i.status === filter);

  return (
    <section className="rounded-2xl border border-border bg-card shadow-soft">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Reported Incidents</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Click a row to expand the case file</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-secondary/60 p-1">
          {(["All", "Submitted", "In Progress", "Review", "Resolved"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                filter === c
                  ? "bg-card text-primary shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground bg-secondary/30">
              <th className="px-6 py-3 w-8" />
              <th className="px-3 py-3">Report</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Section</th>
              <th className="px-3 py-3">Team</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-6 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const isOpen = openId === i.id;
              return (
                <Fragment key={i.id}>
                  <tr
                    key={i.id}
                    onClick={() => setOpenId(isOpen ? null : i.id)}
                    className={[
                      "border-t border-border cursor-pointer transition-colors",
                      isOpen ? "bg-accent/40" : "hover:bg-secondary/60",
                    ].join(" ")}
                  >
                    <td className="px-6 py-4">
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 size-2 rounded-full ${PRIORITY_DOT[i.priority]}`} />
                        <div>
                          <div className="font-semibold text-foreground leading-tight">{i.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {i.code} · by {i.reporter}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-foreground/80">{i.type}</td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1 text-foreground/80">
                        <MapPin className="size-3 text-muted-foreground" />
                        {i.section}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-foreground/80">{i.team}</td>
                    <td className="px-3 py-4">
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold capitalize ring-1",
                          i.priority === "high"
                            ? "bg-destructive/10 text-destructive ring-destructive/20"
                            : i.priority === "medium"
                              ? "bg-warning/10 text-warning ring-warning/20"
                              : "bg-info/10 text-info ring-info/20",
                        ].join(" ")}
                      >
                        {i.priority}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_STYLE[i.status]}`}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground whitespace-nowrap">{i.time}</td>
                  </tr>

                  {isOpen && (
                    <tr key={`${i.id}-detail`} className="bg-accent/20 border-t border-border">
                      <td colSpan={8} className="px-6 py-6">
                        <div className="grid gap-6 lg:grid-cols-5">
                          {/* Case overview */}
                          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                Case file
                              </div>
                              <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                                Open full <ExternalLink className="size-3" />
                              </button>
                            </div>
                            <h4 className="mt-2 text-[16px] font-extrabold tracking-tight text-foreground leading-tight">
                              {i.title}
                            </h4>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                              <Meta icon={Hash} label="Case ID" value={i.code} />
                              <Meta icon={Clock} label="Reported" value={i.time} />
                              <Meta icon={User2} label="Reporter" value={i.reporter} />
                              <Meta icon={MapPin} label="Section" value={i.section} />
                            </div>

                            <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-[12.5px] leading-relaxed text-foreground/80">
                              Incident reported via mobile patrol app. Geo-tagged at
                              <span className="font-mono text-foreground"> {i.lat.toFixed(3)}, {i.lng.toFixed(3)}</span>.
                              Field unit dispatched and corridor surveillance confirms situation.
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground hover:bg-primary-light">
                                <Phone className="size-3.5" /> Call team
                              </button>
                              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary">
                                <MessageSquare className="size-3.5" /> Message
                              </button>
                              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary">
                                <Navigation className="size-3.5 text-sky" /> Route
                              </button>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                  Resolution progress
                                </div>
                                <h5 className="mt-1 text-[14px] font-bold text-foreground">
                                  Lifecycle timeline
                                </h5>
                              </div>
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_STYLE[i.status]}`}>
                                {i.status}
                              </span>
                            </div>
                            <div className="mt-5">
                              <Stepper steps={buildSteps(i)} activeIndex={STATUS_INDEX[i.status]} />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-[12.5px] font-semibold text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
