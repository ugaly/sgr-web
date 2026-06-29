import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/sgr/Topbar";
import { DataTable, type Column } from "@/components/sgr/DataTable";
import { TeamDetailModal } from "@/components/sgr/TeamDetailModal";
import { ROSTER, TEAMS, type RosterOfficer, type Team } from "@/lib/sgr-data";
import { Users, ShieldCheck, Activity, MapPin, Phone, AlertTriangle, Eye } from "lucide-react";

export const Route = createFileRoute("/_app/teams")({
  head: () => ({ meta: [{ title: "Patrol Teams · SGR Guardian" }] }),
  component: TeamsPage,
});

const STATUS_FILTERS = ["All", "Active", "Idle", "SOS", "Offline"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_PILL: Record<RosterOfficer["status"], string> = {
  Active: "bg-success/10 text-success ring-success/20",
  Idle: "bg-warning/10 text-warning ring-warning/20",
  SOS: "bg-destructive/10 text-destructive ring-destructive/20",
  Offline: "bg-muted text-muted-foreground ring-border",
};

const TEAM_STATUS: Record<Team["status"], { label: string; cls: string }> = {
  operational: { label: "Operational", cls: "bg-success/10 text-success ring-success/20" },
  alert: { label: "On Alert", cls: "bg-destructive/10 text-destructive ring-destructive/20" },
  standby: { label: "Standby", cls: "bg-warning/10 text-warning ring-warning/20" },
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function TeamsPage() {
  const [status, setStatus] = useState<StatusFilter>("All");
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openTeam = (team: Team) => {
    setActiveTeam(team);
    setModalOpen(true);
  };

  const teamColumns: Column<Team>[] = [
    {
      key: "name",
      header: "Team",
      sortAccessor: (t) => t.name,
      cell: (t) => (
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-[12px] font-bold text-primary">
            {t.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground">Team {t.name}</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{t.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "section",
      header: "Section",
      sortAccessor: (t) => t.section,
      cell: (t) => (
        <span className="inline-flex items-center gap-1.5 text-foreground/80">
          <MapPin className="size-3.5 text-muted-foreground" />
          {t.section}
        </span>
      ),
    },
    {
      key: "members",
      header: "Members",
      align: "center",
      hideOnMobile: true,
      sortAccessor: (t) => t.members,
      cell: (t) => <span className="font-semibold tabular-nums">{t.members}</span>,
    },
    {
      key: "online",
      header: "Online",
      align: "center",
      sortAccessor: (t) => t.online,
      cell: (t) => (
        <span className="font-semibold tabular-nums text-success">{t.online}/{t.members}</span>
      ),
    },
    {
      key: "incidents",
      header: "Incidents",
      align: "center",
      hideOnMobile: true,
      sortAccessor: (t) => t.incidents,
      cell: (t) => (
        <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-foreground">
          {t.incidents > 0 && <AlertTriangle className="size-3.5 text-warning" />}
          {t.incidents}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortAccessor: (t) => t.status,
      cell: (t) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${TEAM_STATUS[t.status].cls}`}>
          <span className="size-1.5 rounded-full bg-current" />
          {TEAM_STATUS[t.status].label}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (t) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openTeam(t);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary-light"
        >
          <Eye className="size-3.5" /> View
        </button>
      ),
    },
  ];

  const data = useMemo(
    () => (status === "All" ? ROSTER : ROSTER.filter((r) => r.status === status)),
    [status],
  );

  const columns: Column<RosterOfficer>[] = [
    {
      key: "name",
      header: "Officer",
      sortAccessor: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
            {initials(r.name)}
          </div>
          <span className="font-semibold text-foreground">{r.name}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortAccessor: (r) => r.role,
      cell: (r) => <span className="text-muted-foreground">{r.role}</span>,
    },
    {
      key: "team",
      header: "Team",
      sortAccessor: (r) => r.team,
      cell: (r) => <span className="font-medium text-foreground/90">{r.team}</span>,
    },
    {
      key: "section",
      header: "Section",
      hideOnMobile: true,
      sortAccessor: (r) => r.section,
      cell: (r) => (
        <span className="inline-flex items-center gap-1.5 text-foreground/80">
          <MapPin className="size-3.5 text-muted-foreground" />
          {r.section}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortAccessor: (r) => r.status,
      cell: (r) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_PILL[r.status]}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {r.status}
        </span>
      ),
    },
    {
      key: "checkin",
      header: "Last check-in",
      align: "right",
      hideOnMobile: true,
      cell: (r) => <span className="text-xs text-muted-foreground">{r.checkin}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <a
          href={`tel:${r.phone}`}
          aria-label={`Call ${r.name}`}
          onClick={(e) => e.stopPropagation()}
          className="ml-auto grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-accent hover:text-primary"
        >
          <Phone className="size-4" />
        </a>
      ),
    },
  ];

  return (
    <>
      <Topbar title="Patrol Teams" eyebrow="Squad assignments & live duty status" />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MiniStat icon={Users} label="Total officers" value="92" tone="primary" />
          <MiniStat icon={Activity} label="On duty" value="78" tone="sky" />
          <MiniStat icon={ShieldCheck} label="Teams active" value="12" tone="success" />
          <MiniStat icon={MapPin} label="Sectors covered" value="9/10" tone="warning" />
        </section>

        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-foreground">Patrol teams</h3>
              <p className="text-xs text-muted-foreground">Click a team to view its full profile</p>
            </div>
          </div>
          <DataTable
            data={TEAMS}
            columns={teamColumns}
            getRowKey={(t) => t.id}
            rowLabel="teams"
            pageSize={8}
            onRowClick={openTeam}
            searchAccessor={(t) => `${t.name} ${t.code} ${t.section} ${t.status}`}
            searchPlaceholder="Search teams by name, code or section…"
            emptyMessage="No teams found."
          />
        </div>

        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-foreground">Officer roster</h3>
              <p className="text-xs text-muted-foreground">Live duty status across all patrol teams</p>
            </div>
          </div>
          <DataTable
            data={data}
            columns={columns}
            getRowKey={(r) => r.id}
            rowLabel="officers"
            searchAccessor={(r) => `${r.name} ${r.role} ${r.team} ${r.section}`}
            searchPlaceholder="Search officers, teams or sections…"
            emptyMessage="No officers match your filters."
            toolbar={
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
            }
          />
        </div>
      </div>

      <TeamDetailModal team={activeTeam} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

function MiniStat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  const map: Record<string, string> = {
    primary: "bg-primary/8 text-primary",
    sky: "bg-sky/12 text-sky",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className={`grid size-11 shrink-0 place-items-center rounded-xl ${map[tone]}`}><Icon className="size-5" /></div>
      <div className="min-w-0">
        <div className="truncate text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  );
}
