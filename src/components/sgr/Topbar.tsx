import { useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Calendar,
  Sun,
  Menu,
  Siren,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toggleMobileSidebar } from "./sidebar-store";
import { SosModal } from "./SosModal";
import { NOTIFICATIONS, SOS_ALERTS, type Notification } from "@/lib/sgr-data";

interface TopbarProps {
  title?: string;
  eyebrow?: string;
}

const TONE: Record<Notification["tone"], { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  danger: { icon: AlertCircle, cls: "bg-destructive/10 text-destructive" },
  warning: { icon: AlertTriangle, cls: "bg-warning/10 text-warning" },
  info: { icon: Info, cls: "bg-info/10 text-info" },
  success: { icon: CheckCircle2, cls: "bg-success/10 text-success" },
};

export function Topbar({
  title = "Command Dashboard",
  eyebrow = "Tanzania SGR · Dar — Dodoma corridor",
}: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  const activeSos = SOS_ALERTS.filter((s) => s.status === "Active").length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:gap-4 sm:px-6 lg:px-8">
        <button
          onClick={toggleMobileSidebar}
          aria-label="Open menu"
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-card text-foreground transition hover:bg-secondary lg:hidden"
        >
          <Menu className="size-[18px]" />
        </button>

        <div className="min-w-0">
          <div className="hidden text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:block">
            {eyebrow}
          </div>
          <h1 className="truncate text-[16px] font-semibold leading-tight tracking-tight text-foreground sm:text-[18px]">
            {title}
          </h1>
        </div>

        <div className="ml-auto hidden flex-1 px-6 lg:block lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teams, officers, incidents…"
              className="w-full rounded-lg border border-border bg-secondary/40 py-2.5 pl-10 pr-16 text-[13px] placeholder:text-muted-foreground transition focus:border-ring focus:bg-card focus:outline-none focus:ring-4 focus:ring-ring/10"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/* SOS button */}
          <button
            onClick={() => setSosOpen(true)}
            className="relative inline-flex items-center gap-1.5 rounded-lg bg-destructive px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-white shadow-soft transition hover:bg-destructive/90"
          >
            <Siren className="size-4" />
            <span className="hidden sm:inline">SOS</span>
            {activeSos > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/70" />
                <span className="relative grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-white ring-2 ring-card">
                  {activeSos}
                </span>
              </span>
            )}
          </button>

          <button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-medium text-foreground transition hover:bg-secondary xl:inline-flex">
            <Calendar className="size-4 text-muted-foreground" />
            Today · 29 Jun 2026
          </button>

          <button className="hidden size-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:grid">
            <Sun className="size-[18px]" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <Bell className="size-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-white ring-2 ring-card">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-[330px] overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="text-[14px] font-bold text-foreground">Notifications</div>
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">
                      {unread} new
                    </span>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {NOTIFICATIONS.map((n) => {
                      const t = TONE[n.tone];
                      const Icon = t.icon;
                      return (
                        <div
                          key={n.id}
                          className={`flex gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-secondary/50 ${
                            n.unread ? "bg-accent/30" : ""
                          }`}
                        >
                          <div className={`grid size-9 shrink-0 place-items-center rounded-lg ${t.cls}`}>
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate text-[13px] font-semibold text-foreground">{n.title}</div>
                              {n.unread && <span className="size-2 shrink-0 rounded-full bg-destructive" />}
                            </div>
                            <p className="truncate text-[12px] text-muted-foreground">{n.detail}</p>
                            <div className="mt-0.5 text-[11px] text-muted-foreground/80">{n.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    to="/alerts"
                    onClick={() => setNotifOpen(false)}
                    className="block border-t border-border px-4 py-2.5 text-center text-[12px] font-semibold text-primary transition hover:bg-secondary"
                  >
                    View all notifications
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg border border-border bg-card py-1.5 pl-1.5 pr-2 transition hover:bg-secondary sm:pr-3"
          >
            <div className="grid size-8 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
              EM
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-[13px] font-semibold text-foreground">Emmanuel Mwita</div>
              <div className="text-[11px] text-muted-foreground">Corridor Lead</div>
            </div>
            <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
          </Link>
        </div>
      </header>

      <SosModal open={sosOpen} onOpenChange={setSosOpen} />
    </>
  );
}
