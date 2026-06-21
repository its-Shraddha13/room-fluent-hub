import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking-modal";
import { bookings, rooms, weekDays } from "@/lib/mock-data";
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

const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8 AM – 6 PM

const statusColors: Record<string, string> = {
  confirmed: "bg-primary text-primary-foreground border-l-[3px] border-[color:var(--secondary-foreground)]",
  "checked-in": "bg-success text-success-foreground border-l-[3px] border-[color:oklch(0.38_0.12_145)]",
  pending: "bg-warning text-[color:var(--warning-foreground)] border-l-[3px] border-[color:oklch(0.5_0.15_85)]",
  cancelled: "bg-destructive/15 text-destructive border-l-[3px] border-destructive line-through",
  "auto-released": "bg-muted text-muted-foreground border-l-[3px] border-border",
};

function CalendarPage() {
  const [open, setOpen] = useState(false);
  const [defaults, setDefaults] = useState<{ time?: string }>({});

  return (
    <AppShell>
      <div className="space-y-4 p-4 sm:p-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">Calendar</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Week of June 22 – 26, 2026 · All rooms
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
            <Button variant="outline" size="sm">
              <Filter className="mr-1.5 h-3.5 w-3.5" /> Filter
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New
            </Button>
          </div>
        </header>

        {/* Legend */}
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
              {/* day header */}
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

              {/* grid */}
              <div className="relative grid grid-cols-[60px_repeat(5,minmax(0,1fr))]">
                {/* time column */}
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

                {/* day columns */}
                {weekDays.map((_, dayIdx) => (
                  <div key={dayIdx} className="relative border-l border-border">
                    {hours.map((h) => (
                      <div
                        key={h}
                        onClick={() => {
                          setDefaults({ time: `${String(h).padStart(2, "0")}:00` });
                          setOpen(true);
                        }}
                        className="h-16 cursor-pointer border-b border-border transition-colors hover:bg-primary/5"
                      />
                    ))}

                    {bookings
                      .filter((b) => b.day === dayIdx)
                      .map((b) => {
                        const top = (b.startHour - 8) * 64;
                        const height = b.duration * 64 - 2;
                        const room = rooms.find((r) => r.id === b.roomId)!;
                        return (
                          <div
                            key={b.id}
                            style={{ top, height }}
                            className={cn(
                              "absolute inset-x-1 overflow-hidden rounded-md px-2 py-1.5 text-[11px] shadow-fluent-sm transition-transform hover:scale-[1.01] hover:shadow-fluent",
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BookingModal open={open} onOpenChange={setOpen} defaultStart={defaults.time} />
    </AppShell>
  );
}
