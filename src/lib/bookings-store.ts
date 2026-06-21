import { useSyncExternalStore } from "react";
import { bookings as seed, type Booking } from "./mock-data";

let state: Booking[] = [...seed];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const bookingsStore = {
  getSnapshot: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  add: (b: Booking) => {
    state = [...state, b];
    emit();
  },
  remove: (id: string) => {
    state = state.filter((b) => b.id !== id);
    emit();
  },
  /** Returns the first conflicting booking for the given room/day/time window. */
  findConflict: (
    roomId: string,
    day: number,
    startHour: number,
    endHour: number,
    excludeId?: string,
  ): Booking | undefined =>
    state.find(
      (b) =>
        b.roomId === roomId &&
        b.day === day &&
        b.id !== excludeId &&
        b.status !== "cancelled" &&
        Math.max(b.startHour, startHour) < Math.min(b.startHour + b.duration, endHour),
    ),
};

export function useBookings(): Booking[] {
  return useSyncExternalStore(bookingsStore.subscribe, bookingsStore.getSnapshot, bookingsStore.getSnapshot);
}

/** "HH:MM" -> decimal hour. */
export function timeToHour(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + (m || 0) / 60;
}

/** decimal hour -> "HH:MM" (snapped to nearest minute). */
export function hourToTime(h: number): string {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
