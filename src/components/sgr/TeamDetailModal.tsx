import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  Users,
  Wifi,
  AlertTriangle,
  Gauge,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  Pencil,
  Radio,
  Clock,
  UserRound,
} from "lucide-react";
import { INCIDENTS, ROSTER, type Team } from "@/lib/sgr-data";

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
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[90vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {team && <TeamDetailContent team={team} />}
          <DialogPrimitive.Close className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-lg border border-border bg-card/80 text-muted-foreground backdrop-blur transition hover:bg-secondary hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function TeamDetailContent({ team }: { team: Team }) {
  const meta = STATUS_META[team.status];
  const coverage = Math.round((team.online / team.members) * 100);
  const members = ROSTER.filter((r) => r.team.toUpperCase() === team.code);
  const incidents = INCIDENTS.filter((i) => i.team.toUpperCase() === team.code);
  const lead = members.find((m) => m.role === "Team Lead");

  return (
    <>
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-gradient-to-br from-primary to-primary-light px-6 py-5 text-white sm:px-8">
        <DialogPrimitive.Title asChild>
          <div className="flex flex-wrap items-center gap-4 pr-12">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-lg font-extrabold ring-1 ring-white/25 backdrop-blur">
              {team.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">Team {team.name}</h2>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ring-1 ring-white/20">
                  {team.code}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[13px] text-white/80">
                <MapPin className="size-3.5" /> {team.section}
              </div>
            </div>
            <span className={`ml-auto rounded-full px-3 py-1 text-[12px] font-bold ring-1 ${meta.cls} bg-white/90`}>
              {meta.label}
            </span>
          </div>
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          Full operational profile for Team {team.name}
        </DialogPrimitive.Description>
      </header>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
        {/* Stat tiles */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={Users} label="Members" value={String(team.members)} tone="primary" />
          <StatTile icon={Wifi} label="Online now" value={`${team.online}/${team.members}`} tone="success" />
          <StatTile icon={AlertTriangle} label="Open incidents" value={String(team.incidents)} tone="warning" />
          <StatTile icon={Gauge} label="Coverage" value={`${coverage}%`} tone="sky" />
        </section>

        {/* Coverage bar */}
        <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-foreground">Patrol coverage</span>
            <span className="text-muted-foreground">{team.online} of {team.members} officers online</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-sky" style={{ width: `${coverage}%` }} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Team information — form style */}
          <FormSection title="Team information" icon={ShieldCheck}>
            <Field label="Team name" value={`Team ${team.name}`} />
            <Field label="Call sign" value={team.code} />
            <Field label="Operating section" value={team.section} />
            <Field label="Status" value={meta.label} />
            <Field label="Total members" value={String(team.members)} />
            <Field label="Currently online" value={`${team.online} officers`} />
            <Field label="Team lead" value={lead ? lead.name : "Unassigned"} />
            <Field label="Open incidents" value={String(team.incidents)} />
          </FormSection>

          {/* Operations & comms — form style */}
          <FormSection title="Operations & comms" icon={Radio}>
            <Field label="Radio channel" value={`CH-${team.code.split("-")[1] ?? "00"} · encrypted`} />
            <Field label="Dispatch base" value={team.section.split("—")[0]?.trim() || team.section} />
            <Field label="Shift window" value="06:00 – 18:00 EAT" />
            <Field label="Last check-in" value={members[0]?.checkin ?? "—"} />
            <Field label="Patrol mode" value={team.status === "alert" ? "Heightened" : "Routine"} />
            <Field label="Vehicles assigned" value="2 patrol units" />
            <Field label="K9 support" value={members.some((m) => m.role === "K9 Handler") ? "Yes" : "No"} />
            <Field label="Medic on team" value={members.some((m) => m.role === "Medic") ? "Yes" : "No"} />
          </FormSection>
        </div>

        {/* Members */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[14px] font-bold text-foreground">
              <UserRound className="size-4 text-primary" /> Team roster
              <span className="text-xs font-medium text-muted-foreground">({members.length})</span>
            </h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  <th className="px-4 py-2.5">Officer</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="hidden px-4 py-2.5 sm:table-cell">Section</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No officers assigned to this team yet.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id} className="border-t border-border hover:bg-secondary/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                            {initials(m.name)}
                          </div>
                          <span className="font-semibold text-foreground">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                      <td className="hidden px-4 py-3 text-foreground/80 sm:table-cell">{m.section}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${OFFICER_STATUS[m.status]}`}>
                          <span className="size-1.5 rounded-full bg-current" />
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`tel:${m.phone}`}
                          aria-label={`Call ${m.name}`}
                          className="inline-grid size-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-accent hover:text-primary"
                        >
                          <Phone className="size-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related incidents */}
        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-foreground">
            <AlertTriangle className="size-4 text-warning" /> Linked incidents
            <span className="text-xs font-medium text-muted-foreground">({incidents.length})</span>
          </h3>
          {incidents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center text-sm text-muted-foreground">
              No incidents linked to this team.
            </div>
          ) : (
            <div className="space-y-2">
              {incidents.map((i) => (
                <div key={i.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                      i.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : i.priority === "medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-info/10 text-info"
                    }`}
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
          )}
        </section>
      </div>

      {/* Footer actions */}
      <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-card px-6 py-4 sm:px-8">
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-semibold text-foreground transition hover:bg-secondary">
          <MessageSquare className="size-4" /> Message team
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-semibold text-foreground transition hover:bg-secondary">
          <Pencil className="size-4" /> Edit team
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary-light">
          <ShieldCheck className="size-4" /> Assign task
        </button>
      </footer>
    </>
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
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${map[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[11px] text-muted-foreground">{label}</div>
        <div className="text-xl font-extrabold tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  );
}

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 text-[14px] font-bold text-foreground">
        <Icon className="size-4 text-primary" /> {title}
      </h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-[13px] font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}
