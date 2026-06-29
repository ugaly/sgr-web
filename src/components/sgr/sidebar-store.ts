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
