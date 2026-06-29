import {
  LayoutDashboard,
  Map as MapIcon,
  Users,
  ShieldCheck,
  FileWarning,
  BellRing,
  Settings,
  TrainFront,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMobileSidebar, setMobileSidebar } from "./sidebar-store";

const SECTIONS: { title: string; items: { to: string; label: string; icon: any; badge?: string }[] }[] = [
  {
    title: "Menu",
    items: [
      { to: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
      { to: "/live-map",    label: "Live Map",    icon: MapIcon },
      { to: "/teams",       label: "Teams",       icon: Users },
      { to: "/supervisors", label: "Supervisors", icon: ShieldCheck },
    ],
  },
  {
    title: "Operations",
    items: [
      { to: "/incidents", label: "Incidents", icon: FileWarning, badge: "14" },
      { to: "/alerts",    label: "Alerts",    icon: BellRing,    badge: "3" },
    ],
  },
  {
    title: "Others",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const open = useMobileSidebar();

  return (
    <>
      {/* Desktop — static sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile — off-canvas drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setMobileSidebar(false)}
          className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[280px] max-w-[85%] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-elevated transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onNavigate={() => setMobileSidebar(false)} showClose />
        </aside>
      </div>
    </>
  );
}

function SidebarContent({
  onNavigate,
  showClose,
}: {
  onNavigate?: () => void;
  showClose?: boolean;
}) {
  return (
    <>
      <div className="flex h-[68px] items-center gap-3 border-b border-sidebar-border px-5">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-white shadow-soft">
          <TrainFront className="size-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-foreground">SGR Guardian</div>
          <div className="text-[11px] font-medium text-muted-foreground">Command Center</div>
        </div>
        {showClose && (
          <button
            onClick={onNavigate}
            aria-label="Close menu"
            className="ml-auto grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    activeProps={{
                      className:
                        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors bg-sidebar-accent text-sidebar-accent-foreground",
                    }}
                    inactiveProps={{
                      className:
                        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                        )}
                        <Icon className={`size-[18px] ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && !item.badge && <ChevronRight className="size-3.5 text-primary" />}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-secondary/50 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          System online
        </div>
        <div className="mt-1.5 text-[13px] font-semibold leading-snug text-foreground">All corridors monitored</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Last sync 12s ago</div>
        <button className="mt-3 w-full rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition hover:bg-primary-light">
          View status
        </button>
      </div>

      <Link
        to="/"
        onClick={onNavigate}
        className="mx-3 mb-4 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="size-[16px]" />
        Sign out
      </Link>
    </>
  );
}
