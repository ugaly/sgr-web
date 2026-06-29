import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setMobileSidebar(value: boolean) {
  open = value;
  emit();
}

export function toggleMobileSidebar() {
  open = !open;
  emit();
}

export function useMobileSidebar() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}

/* ---- Desktop collapse (icon rail) state, persisted ---- */
const COLLAPSE_KEY = "sgr.sidebar.collapsed";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(COLLAPSE_KEY);
  if (stored === null) return true;
  return stored === "1";
}

let collapsed = readCollapsed();
const collapseListeners = new Set<() => void>();

function emitCollapse() {
  collapseListeners.forEach((l) => l());
}

export function setSidebarCollapsed(value: boolean) {
  collapsed = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(COLLAPSE_KEY, value ? "1" : "0");
  }
  emitCollapse();
}

export function toggleSidebarCollapsed() {
  setSidebarCollapsed(!collapsed);
}

export function useSidebarCollapsed() {
  return useSyncExternalStore(
    (cb) => {
      collapseListeners.add(cb);
      return () => collapseListeners.delete(cb);
    },
    () => collapsed,
    () => true,
  );
}
