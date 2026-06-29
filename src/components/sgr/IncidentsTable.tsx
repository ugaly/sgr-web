import { useState } from "react";
import { INCIDENTS, type Incident } from "@/lib/sgr-data";
import { MapPin, Paperclip, ExternalLink } from "lucide-react";
import { IncidentDetailModal } from "./IncidentDetailModal";

const STATUS_STYLE: Record<Incident["status"], string> = {
  Submitted: "bg-info/10 text-info ring-info/20",
  "In Progress": "bg-warning/10 text-warning ring-warning/20",
  Review: "bg-sky/15 text-primary ring-sky/30",
  Resolved: "bg-success/10 text-success ring-success/20",
};

const PRIORITY_DOT: Record<Incident["priority"], string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-info",
};

export function IncidentsTable() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | Incident["status"]>("All");

  const rows = filter === "All" ? INCIDENTS : INCIDENTS.filter((i) => i.status === filter);

  function openIncident(incident: Incident) {
    setSelected(incident);
    setModalOpen(true);
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <h3 className="text-[15px] font-bold text-foreground">Reported Incidents</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Click a row to open the full case file</p>
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
              <tr className="bg-secondary/30 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-6 py-3">Report</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Section</th>
                <th className="px-3 py-3">Team</th>
                <th className="px-3 py-3">Files</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-6 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => openIncident(i)}
                  className="cursor-pointer border-t border-border transition-colors hover:bg-secondary/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${PRIORITY_DOT[i.priority]}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold leading-tight text-foreground">{i.title}</span>
                          <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
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
                    {i.attachments.length > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        <Paperclip className="size-3" />
                        {i.attachments.length}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/50">—</span>
                    )}
                  </td>
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
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_STYLE[i.status]}`}>
                      {i.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-xs text-muted-foreground">{i.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <IncidentDetailModal
        incident={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
