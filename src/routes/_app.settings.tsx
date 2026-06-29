import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/sgr/Topbar";
import { Bell, Globe, KeyRound, Shield, User, Database, Smartphone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · SGR Guardian" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Database },
    { id: "devices", label: "Devices", icon: Smartphone },
    { id: "regional", label: "Regional", icon: Globe },
  ];

  return (
    <>
      <Topbar title="Settings" eyebrow="Account, security & system preferences" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="size-[18px]" />
                  {t.label}
                </button>
              );
            })}
          </aside>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            {tab === "profile" && <ProfilePanel />}
            {tab === "security" && <SecurityPanel />}
            {tab === "notifications" && <NotificationsPanel />}
            {tab === "integrations" && <IntegrationsPanel />}
            {tab === "devices" && <DevicesPanel />}
            {tab === "regional" && <RegionalPanel />}
          </section>
        </div>
      </div>
    </>
  );
}

function PanelHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6 border-b border-border pb-4">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[200px_1fr] sm:gap-6 py-4 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {hint && <div className="text-[12px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full max-w-md rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/20"
    />
  );
}

function Toggle({ on = true }: { on?: boolean }) {
  const [v, setV] = useState(on);
  return (
    <button
      onClick={() => setV((x) => !x)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${v ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`inline-block size-4 rounded-full bg-white shadow transition ${v ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function ProfilePanel() {
  return (
    <div>
      <PanelHeader title="Profile" desc="How you appear across the command center." />
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white text-lg font-extrabold">EM</div>
        <div>
          <div className="text-base font-bold text-foreground">Emmanuel Mwita</div>
          <div className="text-sm text-muted-foreground">Corridor Lead · Dar — Dodoma</div>
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary-light">Upload photo</button>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-accent">Remove</button>
          </div>
        </div>
      </div>
      <Row label="Full name"><Input defaultValue="Emmanuel Mwita" /></Row>
      <Row label="Work email"><Input defaultValue="emmanuel.mwita@sgr.tz" /></Row>
      <Row label="Phone"><Input defaultValue="+255 712 000 100" /></Row>
      <Row label="Role"><Input defaultValue="Corridor Lead" /></Row>
      <div className="mt-6 flex justify-end gap-2">
        <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent">Cancel</button>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-light">Save changes</button>
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div>
      <PanelHeader title="Security" desc="Protect your management account." />
      <Row label="Password" hint="Last changed 42 days ago">
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent">
          <KeyRound className="size-4" /> Change password
        </button>
      </Row>
      <Row label="Two-factor auth" hint="Required for management roles"><Toggle on /></Row>
      <Row label="Trusted devices" hint="3 active sessions">
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent">Manage sessions</button>
      </Row>
      <Row label="Audit log" hint="All actions on your account">
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent">View log</button>
      </Row>
    </div>
  );
}

function NotificationsPanel() {
  const items = [
    { l: "SOS triggers", h: "Immediate push + SMS" },
    { l: "High-priority incidents", h: "Push notifications" },
    { l: "Shift handovers", h: "Email summary" },
    { l: "Weekly corridor report", h: "Every Monday 08:00" },
    { l: "System maintenance", h: "Email + in-app" },
  ];
  return (
    <div>
      <PanelHeader title="Notifications" desc="Choose what reaches you and how." />
      {items.map((i) => (
        <Row key={i.l} label={i.l} hint={i.h}><Toggle on /></Row>
      ))}
    </div>
  );
}

function IntegrationsPanel() {
  const apps = [
    { n: "Google Maps", s: "Connected", d: "Corridor map tiles + geocoding" },
    { n: "Twilio SMS", s: "Connected", d: "SOS escalation alerts" },
    { n: "Slack", s: "Connected", d: "Incident channel #sgr-ops" },
    { n: "Microsoft Teams", s: "Not connected", d: "Briefing meeting links" },
    { n: "ZAMR Comms", s: "Connected", d: "Radio gateway bridge" },
  ];
  return (
    <div>
      <PanelHeader title="Integrations" desc="Connected services powering the command center." />
      <div className="divide-y divide-border">
        {apps.map((a) => (
          <div key={a.n} className="flex items-center gap-3 py-4">
            <div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary font-bold">{a.n[0]}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">{a.n}</div>
              <div className="text-[12px] text-muted-foreground">{a.d}</div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${a.s === "Connected" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{a.s}</span>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-accent">
              {a.s === "Connected" ? "Manage" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DevicesPanel() {
  const devs = [
    { n: "MacBook Pro · Dar es Salaam", w: "Active now", i: "Chrome 132 · 41.220.x.x" },
    { n: "iPhone 15 · Field unit", w: "Active · 12 min ago", i: "iOS app v2.4" },
    { n: "Operations Room Display", w: "Active · 1h ago", i: "Wall console · Dodoma HQ" },
  ];
  return (
    <div>
      <PanelHeader title="Devices" desc="Where your account is currently signed in." />
      <div className="divide-y divide-border">
        {devs.map((d) => (
          <div key={d.n} className="flex items-center gap-3 py-4">
            <Smartphone className="size-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">{d.n}</div>
              <div className="text-[12px] text-muted-foreground">{d.i} · {d.w}</div>
            </div>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-destructive hover:bg-destructive/5">Sign out</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalPanel() {
  return (
    <div>
      <PanelHeader title="Regional" desc="Language, timezone and units." />
      <Row label="Language"><Input defaultValue="English (Tanzania)" /></Row>
      <Row label="Timezone"><Input defaultValue="Africa/Dar_es_Salaam (EAT, UTC+3)" /></Row>
      <Row label="Distance units"><Input defaultValue="Kilometres (km)" /></Row>
      <Row label="Date format"><Input defaultValue="DD MMM YYYY · 24h" /></Row>
    </div>
  );
}
