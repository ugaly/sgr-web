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
import {
  useMobileSidebar,
  setMobileSidebar,
  useSidebarCollapsed,
} from "./sidebar-store";

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
  const collapsed = useSidebarCollapsed();

  return (
    <>
      {/* Desktop — static, collapsible sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out lg:flex ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
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
  collapsed = false,
}: {
  onNavigate?: () => void;
  showClose?: boolean;
  collapsed?: boolean;
}) {
  return (
    <>
      <div className={`flex h-[68px] items-center border-b border-sidebar-border ${collapsed ? "justify-center px-2" : "gap-3 px-5"}`}>
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-soft">
          <TrainFront className="size-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-foreground">SGR Guardian</div>
            <div className="text-[11px] font-medium text-muted-foreground">Command Center</div>
          </div>
        )}
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

      <nav className={`flex-1 overflow-y-auto py-5 ${collapsed ? "space-y-4 px-2" : "space-y-6 px-3"}`}>
        {SECTIONS.map((section) => (
          <div key={section.title}>
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-7 bg-sidebar-border" aria-hidden />
            ) : (
              <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    activeProps={{
                      className: collapsed
                        ? "group relative flex items-center justify-center rounded-lg py-2.5 transition-colors bg-sidebar-accent text-sidebar-accent-foreground"
                        : "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors bg-sidebar-accent text-sidebar-accent-foreground",
                    }}
                    inactiveProps={{
                      className: collapsed
                        ? "group relative flex items-center justify-center rounded-lg py-2.5 transition-colors text-sidebar-foreground hover:bg-secondary hover:text-foreground"
                        : "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                        )}
                        <span className="relative shrink-0">
                          <Icon className={`size-[18px] ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                          {collapsed && item.badge && (
                            <span className="absolute -right-1.5 -top-1.5 grid size-3.5 place-items-center rounded-full bg-destructive text-[8px] font-bold text-white ring-2 ring-sidebar">
                              {item.badge}
                            </span>
                          )}
                        </span>

                        {!collapsed && (
                          <>
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

                        {/* Hover tooltip — only when collapsed */}
                        {collapsed && (
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[12px] font-semibold text-white opacity-0 shadow-elevated transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
                          >
                            {item.label}
                            {item.badge && (
                              <span className="ml-1.5 rounded bg-white/20 px-1 py-0.5 text-[10px]">{item.badge}</span>
                            )}
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
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
      )}

      <Link
        to="/"
        onClick={onNavigate}
        title={collapsed ? "Sign out" : undefined}
        className={`group relative mx-3 mb-4 flex items-center rounded-lg border border-border bg-card text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground ${
          collapsed ? "justify-center px-0 py-2.5" : "gap-2 px-3 py-2.5"
        }`}
      >
        <LogOut className="size-[16px] shrink-0" />
        {!collapsed && "Sign out"}
        {collapsed && (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[12px] font-semibold text-white opacity-0 shadow-elevated transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
          >
            Sign out
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
          </span>
        )}
      </Link>
    </>
  );
}
