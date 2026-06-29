import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Users,
  UserCheck,
  Map,
  Plus,
  Download,
} from "lucide-react";

import { Topbar } from "@/components/sgr/Topbar";
import { DataTable, type Column } from "@/components/sgr/DataTable";
import { AddSupervisorModal } from "@/components/sgr/AddSupervisorModal";
import { SUPERVISORS, type Supervisor } from "@/lib/sgr-data";

export const Route = createFileRoute("/_app/supervisors")({
  head: () => ({ meta: [{ title: "Supervisors · SGR Guardian" }] }),
  component: SupervisorsPage,
});

const STATUS_FILTERS = ["All", "On duty", "Briefing", "Off duty"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function initials(name: string) {
  return name
    .replace(/^(Col\.|Maj\.|Capt\.|Lt\.)\s/, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const STATUS_STYLE: Record<Supervisor["status"], string> = {
  "On duty": "bg-success/10 text-success ring-success/20",
  Briefing: "bg-sky/15 text-sky ring-sky/25",
  "Off duty": "bg-muted text-muted-foreground ring-border",
};

function SupervisorsPage() {
  const [status, setStatus] = useState<StatusFilter>("All");
  const [addOpen, setAddOpen] = useState(false);

  const data = useMemo(
    () => (status === "All" ? SUPERVISORS : SUPERVISORS.filter((s) => s.status === status)),
    [status],
  );

  const onDuty = SUPERVISORS.filter((s) => s.status === "On duty").length;
  const avgRating = (
    SUPERVISORS.reduce((a, s) => a + s.rating, 0) / SUPERVISORS.length
  ).toFixed(1);

  const columns: Column<Supervisor>[] = [
    {
      key: "name",
      header: "Supervisor",
      sortAccessor: (s) => s.name,
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
            {initials(s.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-foreground">{s.name}</div>
            <div className="truncate text-[12px] text-muted-foreground">{s.rank}</div>
          </div>
        </div>
      ),
    },
    {
      key: "zone",
      header: "Sector",
      sortAccessor: (s) => s.zone,
      cell: (s) => <span className="text-foreground/80">{s.zone}</span>,
    },
    {
      key: "teams",
      header: "Teams",
      align: "center",
      hideOnMobile: true,
      sortAccessor: (s) => s.teams,
      cell: (s) => <span className="font-semibold tabular-nums">{s.teams}</span>,
    },
    {
      key: "officers",
      header: "Officers",
      align: "center",
      hideOnMobile: true,
      sortAccessor: (s) => s.officers,
      cell: (s) => <span className="font-semibold tabular-nums">{s.officers}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      align: "center",
      sortAccessor: (s) => s.rating,
      cell: (s) => (
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <Star className="size-3.5 fill-warning text-warning" />
          {s.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortAccessor: (s) => s.status,
      cell: (s) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_STYLE[s.status]}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {s.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (s) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <IconAction href={`tel:${s.phone}`} label={`Call ${s.name}`}>
            <Phone className="size-4" />
          </IconAction>
          <IconAction href={`mailto:${s.email}`} label={`Email ${s.name}`}>
            <Mail className="size-4" />
          </IconAction>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary-light">
            <ShieldCheck className="size-3.5" /> Assign
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Topbar title="Supervisors" eyebrow="Section commanders across the corridor" />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={Users} label="Total supervisors" value={String(SUPERVISORS.length)} tone="primary" />
          <StatTile icon={UserCheck} label="On duty now" value={String(onDuty)} tone="success" />
          <StatTile icon={Map} label="Sectors covered" value="16/16" tone="sky" />
          <StatTile icon={Star} label="Avg rating" value={avgRating} tone="warning" />
        </section>

        <DataTable
          data={data}
          columns={columns}
          getRowKey={(s) => s.id}
          rowLabel="supervisors"
          searchAccessor={(s) => `${s.name} ${s.rank} ${s.zone} ${s.email}`}
          searchPlaceholder="Search by name, rank or sector…"
          emptyMessage="No supervisors match your filters."
          toolbar={
            <>
              <div className="flex items-center gap-1 rounded-lg bg-secondary/60 p-1">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatus(f)}
                    className={[
                      "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                      status === f
                        ? "bg-card text-primary shadow-soft"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition hover:bg-secondary">
                <Download className="size-3.5" /> Export
              </button>
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary-light"
              >
                <Plus className="size-3.5" /> Add supervisor
              </button>
            </>
          }
        />
      </div>

      <AddSupervisorModal open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}

function IconAction({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-accent hover:text-primary"
    >
      {children}
    </a>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "primary" | "sky" | "success" | "warning";
}) {
  const map: Record<string, string> = {
    primary: "bg-primary/8 text-primary",
    sky: "bg-sky/15 text-sky",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className={`grid size-11 shrink-0 place-items-center rounded-xl ${map[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  );
}
