import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  Pencil,
  Radio,
  Clock,
  FileText,
  UserRound,
} from "lucide-react";
import { INCIDENTS, ROSTER, type Team } from "@/lib/sgr-data";
import { cn } from "@/lib/utils";

const STATUS_META: Record<Team["status"], { label: string; cls: string }> = {
  operational: { label: "Operational", cls: "bg-success/10 text-success ring-success/20" },
  alert: { label: "On Alert", cls: "bg-destructive/10 text-destructive ring-destructive/20" },
  standby: { label: "Standby", cls: "bg-warning/10 text-warning ring-warning/20" },
};

const OFFICER_STATUS: Record<string, string> = {
  Active: "bg-success/10 text-success ring-success/20",
  Idle: "bg-warning/10 text-warning ring-warning/20",
  SOS: "bg-destructive/10 text-destructive ring-destructive/20",
  Offline: "bg-muted text-muted-foreground ring-border",
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

type TabKey = "overview" | "roster" | "operations" | "incidents";

export function TeamDetailModal({
  team,
  open,
  onOpenChange,
}: {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 m-auto flex h-[96vh] w-[97vw] max-w-[1400px] overflow-hidden rounded-2xl border border-border bg-card shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {team && <TeamContent team={team} />}
          <DialogPrimitive.Close className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-lg border border-border bg-card/90 text-muted-foreground backdrop-blur transition hover:bg-secondary hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function TeamContent({ team }: { team: Team }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const meta = STATUS_META[team.status];
  const coverage = Math.round((team.online / team.members) * 100);
  const members = ROSTER.filter((r) => r.team.toUpperCase() === team.code);
  const incidents = INCIDENTS.filter((i) => i.team.toUpperCase() === team.code);
  const lead = members.find((m) => m.role === "Team Lead");

  useEffect(() => {
    setTab("overview");
  }, [team.code]);

  const NAV: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: "overview", label: "Overview", icon: FileText },
    { key: "roster", label: "Roster", icon: UserRound, count: members.length },
    { key: "operations", label: "Operations", icon: Radio },
    { key: "incidents", label: "Incidents", icon: AlertTriangle, count: incidents.length },
  ];

  return (
    <div className="flex min-h-0 w-full">
      {/* LEFT NAV */}
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-secondary/30 sm:flex">
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-[14px] font-extrabold text-white">
              {team.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-extrabold tracking-tight text-foreground">Team {team.name}</h2>
              <p className="text-[12px] text-muted-foreground">{team.code}</p>
            </div>
          </div>
          <span className={cn("mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1", meta.cls)}>
            {meta.label}
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const active = tab === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition",
                  active
                    ? "bg-card text-primary shadow-soft ring-1 ring-border"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <Icon className={cn("size-[18px]", active ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1 text-left">{n.label}</span>
                {n.count !== undefined && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground",
                  )}>
                    {n.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-[12.5px] font-semibold text-primary-foreground transition hover:bg-primary-light">
            <ShieldCheck className="size-4" /> Assign task
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-2 text-[11.5px] font-semibold text-foreground transition hover:bg-secondary">
              <MessageSquare className="size-3.5" /> Message
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-2 text-[11.5px] font-semibold text-foreground transition hover:bg-secondary">
              <Pencil className="size-3.5" /> Edit
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobile tab bar */}
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2 sm:hidden">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-semibold transition",
                tab === n.key ? "bg-secondary text-primary" : "text-muted-foreground",
              )}
            >
              {n.label}
            </button>
          ))}
        </div>

        <DialogPrimitive.Title className="sr-only">Team {team.name}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">Operational profile for Team {team.name}</DialogPrimitive.Description>

        <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5 pr-16">
          <h3 className="text-[20px] font-extrabold tracking-tight text-foreground">
            {NAV.find((n) => n.key === tab)?.label}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <MapPin className="size-3.5" /> {team.section}
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "overview" && <OverviewTab team={team} meta={meta} coverage={coverage} lead={lead} />}
          {tab === "roster" && <RosterTab members={members} />}
          {tab === "operations" && <OperationsTab team={team} members={members} />}
          {tab === "incidents" && <IncidentsTab incidents={incidents} />}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 last:border-b-0">
      <div className="text-[14px] font-semibold text-foreground">{label}</div>
      <div className="shrink-0 text-right text-[14px] font-medium text-foreground">{children}</div>
    </div>
  );
}

function OverviewTab({
  team,
  meta,
  coverage,
  lead,
}: {
  team: Team;
  meta: { label: string; cls: string };
  coverage: number;
  lead?: { name: string };
}) {
  return (
    <div>
      {/* Coverage banner */}
      <div className="px-6 py-5">
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-foreground">Patrol coverage</span>
            <span className="text-muted-foreground">{team.online} of {team.members} online · {coverage}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-sky" style={{ width: `${coverage}%` }} />
          </div>
        </div>
      </div>

      <Row label="Team name">Team {team.name}</Row>
      <Row label="Call sign"><span className="font-mono">{team.code}</span></Row>
      <Row label="Operating section">{team.section}</Row>
      <Row label="Status">
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold ring-1", meta.cls)}>{meta.label}</span>
      </Row>
      <Row label="Total members">{team.members}</Row>
      <Row label="Currently online">{team.online} officers</Row>
      <Row label="Team lead">{lead ? lead.name : "Unassigned"}</Row>
      <Row label="Open incidents">{team.incidents}</Row>
    </div>
  );
}

function RosterTab({
  members,
}: {
  members: { id: string; name: string; role: string; section: string; status: string; phone: string }[];
}) {
  if (members.length === 0) {
    return (
      <div className="grid place-items-center gap-2 py-16 text-center">
        <UserRound className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No officers assigned</p>
      </div>
    );
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-secondary/40 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <th className="px-6 py-3">Officer</th>
          <th className="px-3 py-3">Role</th>
          <th className="hidden px-3 py-3 sm:table-cell">Section</th>
          <th className="px-3 py-3">Status</th>
          <th className="px-6 py-3 text-right">Call</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id} className="border-t border-border hover:bg-secondary/40">
            <td className="px-6 py-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                  {initials(m.name)}
                </div>
                <span className="font-semibold text-foreground">{m.name}</span>
              </div>
            </td>
            <td className="px-3 py-3 text-muted-foreground">{m.role}</td>
            <td className="hidden px-3 py-3 text-foreground/80 sm:table-cell">{m.section}</td>
            <td className="px-3 py-3">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1", OFFICER_STATUS[m.status])}>
                <span className="size-1.5 rounded-full bg-current" />
                {m.status}
              </span>
            </td>
            <td className="px-6 py-3 text-right">
              <a
                href={`tel:${m.phone}`}
                aria-label={`Call ${m.name}`}
                className="inline-grid size-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-accent hover:text-primary"
              >
                <Phone className="size-4" />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OperationsTab({
  team,
  members,
}: {
  team: Team;
  members: { role: string; checkin?: string }[];
}) {
  return (
    <div>
      <Row label="Radio channel"><span className="font-mono">CH-{team.code.split("-")[1] ?? "00"} · encrypted</span></Row>
      <Row label="Dispatch base">{team.section.split("—")[0]?.trim() || team.section}</Row>
      <Row label="Shift window">06:00 – 18:00 EAT</Row>
      <Row label="Last check-in">{members[0]?.checkin ?? "—"}</Row>
      <Row label="Patrol mode">{team.status === "alert" ? "Heightened" : "Routine"}</Row>
      <Row label="Vehicles assigned">2 patrol units</Row>
      <Row label="K9 support">{members.some((m) => m.role === "K9 Handler") ? "Yes" : "No"}</Row>
      <Row label="Medic on team">{members.some((m) => m.role === "Medic") ? "Yes" : "No"}</Row>
    </div>
  );
}

function IncidentsTab({
  incidents,
}: {
  incidents: { id: string; title: string; code: string; section: string; time: string; priority: string }[];
}) {
  if (incidents.length === 0) {
    return (
      <div className="grid place-items-center gap-2 py-16 text-center">
        <AlertTriangle className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No linked incidents</p>
      </div>
    );
  }
  return (
    <div className="space-y-2 p-6">
      {incidents.map((i) => (
        <div key={i.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg",
              i.priority === "high"
                ? "bg-destructive/10 text-destructive"
                : i.priority === "medium"
                  ? "bg-warning/10 text-warning"
                  : "bg-info/10 text-info",
            )}
          >
            <AlertTriangle className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-foreground">{i.title}</div>
            <div className="text-[11px] text-muted-foreground">{i.code} · {i.section}</div>
          </div>
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground">
            <Clock className="size-3" /> {i.time}
          </span>
        </div>
      ))}
    </div>
  );
}
