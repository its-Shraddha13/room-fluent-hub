import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingModal } from "@/components/booking-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rooms, weekDays } from "@/lib/mock-data";
import { useBookings, hourToTime, bookingsStore } from "@/lib/bookings-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · RoomHub" },
      { name: "description", content: "Drag-and-drop weekly schedule across every meeting room." },
    ],
  }),
  component: CalendarPage,
});

const START_HOUR = 8;
const END_HOUR = 19;
const HOUR_PX = 64; // height of each hour cell
const SNAP_MIN = 30; // snap in minutes
const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const statusColors: Record<string, string> = {
  confirmed:
    "bg-primary text-primary-foreground border-l-[3px] border-[color:var(--secondary-foreground)]",
  "checked-in":
    "bg-success text-success-foreground border-l-[3px] border-[color:oklch(0.38_0.12_145)]",
  pending:
    "bg-warning text-[color:var(--warning-foreground)] border-l-[3px] border-[color:oklch(0.5_0.15_85)]",
  cancelled:
    "bg-destructive/15 text-destructive border-l-[3px] border-destructive line-through",
  "auto-released":
    "bg-muted text-muted-foreground border-l-[3px] border-border",
};

interface DragState {
  dayIdx: number;
  startHour: number;
  endHour: number;
}

function snapHour(h: number) {
  const step = SNAP_MIN / 60;
  return Math.round(h / step) * step;
}

function yToHour(y: number) {
  return START_HOUR + y / HOUR_PX;
}

function CalendarPage() {
  const allBookings = useBookings();
  const [open, setOpen] = useState(false);
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [defaults, setDefaults] = useState<{
    start?: string;
    end?: string;
    day?: number;
    roomId?: string;
  }>({});

  const [drag, setDrag] = useState<DragState | null>(null);
  const dragOriginHour = useRef<number | null>(null);

  const visibleBookings = useMemo(
    () => (roomFilter === "all" ? allBookings : allBookings.filter((b) => b.roomId === roomFilter)),
    [allBookings, roomFilter],
  );

  const beginDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, dayIdx: number) => {
      if (e.button !== 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const h = snapHour(yToHour(y));
      const clamped = Math.max(START_HOUR, Math.min(END_HOUR - 0.5, h));
      dragOriginHour.current = clamped;
      setDrag({ dayIdx, startHour: clamped, endHour: clamped + 0.5 });
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const updateDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, dayIdx: number) => {
      if (drag === null || dragOriginHour.current === null) return;
      if (drag.dayIdx !== dayIdx) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const h = snapHour(yToHour(y));
      const clamped = Math.max(START_HOUR, Math.min(END_HOUR, h));
      const origin = dragOriginHour.current;
      const start = Math.min(origin, clamped);
      const end = Math.max(origin + 0.5, clamped);
      setDrag({ dayIdx, startHour: start, endHour: end });
    },
    [drag],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag) return;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore — pointer may not be captured
      }
      const { dayIdx, startHour, endHour } = drag;
      const finalEnd = endHour <= startHour ? startHour + 1 : endHour;
      setDefaults({
        day: dayIdx,
        start: hourToTime(startHour),
        end: hourToTime(finalEnd),
        roomId: roomFilter !== "all" ? roomFilter : undefined,
      });
      setDrag(null);
      dragOriginHour.current = null;
      setOpen(true);
    },
    [drag, roomFilter],
  );

  const cancelDrag = useCallback(() => {
    setDrag(null);
    dragOriginHour.current = null;
  }, []);

  return (
    <AppShell>
      <div className="space-y-4 p-4 sm:p-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">Calendar</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Week of June 22 – 26, 2026 · Drag any time slot to book
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-none px-3 text-xs">
                Today
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="h-8 w-[180px] text-xs">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All rooms</SelectItem>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => {
                setDefaults({});
                setOpen(true);
              }}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {[
            ["Confirmed", "bg-primary"],
            ["Checked in", "bg-success"],
            ["Pending", "bg-warning"],
            ["Cancelled", "bg-destructive"],
            ["Auto-released", "bg-muted-foreground/60"],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("h-2.5 w-2.5 rounded-sm", color)} />
              {label}
            </div>
          ))}
        </div>

        <Card className="overflow-hidden p-0 shadow-fluent">
          <div className="overflow-x-auto">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[60px_repeat(5,minmax(0,1fr))] border-b border-border bg-muted/30">
                <div />
                {weekDays.map((d, i) => (
                  <div
                    key={d}
                    className={cn(
                      "border-l border-border px-3 py-2 text-xs font-semibold",
                      i === 0 && "text-primary",
                    )}
                  >
                    <div>{d}</div>
                    <div className="text-[11px] font-normal text-muted-foreground">
                      Jun {22 + i}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative grid grid-cols-[60px_repeat(5,minmax(0,1fr))]">
                <div>
                  {hours.map((h) => (
                    <div
                      key={h}
                      className="flex h-16 items-start justify-end border-b border-border px-2 pt-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {h % 12 === 0 ? 12 : h % 12} {h < 12 ? "AM" : "PM"}
                    </div>
                  ))}
                </div>

                {weekDays.map((_, dayIdx) => {
                  const dayBookings = visibleBookings.filter((b) => b.day === dayIdx);
                  const previewActive = drag?.dayIdx === dayIdx;
                  const previewTop = previewActive ? (drag!.startHour - START_HOUR) * HOUR_PX : 0;
                  const previewHeight = previewActive
                    ? (drag!.endHour - drag!.startHour) * HOUR_PX
                    : 0;
                  const previewConflict =
                    previewActive && roomFilter !== "all"
                      ? bookingsStore.findConflict(
                          roomFilter,
                          dayIdx,
                          drag!.startHour,
                          drag!.endHour,
                        )
                      : undefined;

                  return (
                    <div
                      key={dayIdx}
                      className="relative touch-none select-none border-l border-border"
                      style={{ height: hours.length * HOUR_PX }}
                      onPointerDown={(e) => beginDrag(e, dayIdx)}
                      onPointerMove={(e) => updateDrag(e, dayIdx)}
                      onPointerUp={endDrag}
                      onPointerCancel={cancelDrag}
                    >
                      {hours.map((h) => (
                        <div
                          key={h}
                          className="pointer-events-none h-16 border-b border-border"
                        >
                          <div className="h-1/2 border-b border-dashed border-border/40" />
                        </div>
                      ))}

                      {dayBookings.map((b) => {
                        const top = (b.startHour - START_HOUR) * HOUR_PX;
                        const height = b.duration * HOUR_PX - 2;
                        const room = rooms.find((r) => r.id === b.roomId)!;
                        return (
                          <div
                            key={b.id}
                            style={{ top, height }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={cn(
                              "absolute inset-x-1 z-10 overflow-hidden rounded-md px-2 py-1.5 text-[11px] shadow-fluent-sm transition-transform hover:scale-[1.01] hover:shadow-fluent",
                              statusColors[b.status],
                            )}
                          >
                            <div className="truncate font-semibold leading-tight">{b.title}</div>
                            <div className="mt-0.5 truncate opacity-90">{room.name}</div>
                            {b.duration >= 1 && (
                              <div className="mt-0.5 truncate text-[10px] opacity-80">
                                {b.organizer} · {b.attendees}p
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {previewActive && (
                        <div
                          style={{ top: previewTop, height: previewHeight }}
                          className={cn(
                            "pointer-events-none absolute inset-x-1 z-20 flex flex-col rounded-md border-2 border-dashed px-2 py-1 text-[11px] font-medium",
                            previewConflict
                              ? "border-destructive bg-destructive/15 text-destructive"
                              : "border-primary bg-primary/15 text-primary",
                          )}
                        >
                          <span>
                            {hourToTime(drag!.startHour)} – {hourToTime(drag!.endHour)}
                          </span>
                          <span className="text-[10px] opacity-80">
                            {previewConflict ? "Conflicts with " + previewConflict.title : "New booking"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BookingModal
        open={open}
        onOpenChange={setOpen}
        defaultStart={defaults.start}
        defaultEnd={defaults.end}
        defaultDay={defaults.day}
        defaultRoomId={defaults.roomId}
      />
    </AppShell>
  );
}
