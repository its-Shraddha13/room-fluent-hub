import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  DoorOpen,
  CalendarCheck2,
  Activity,
  AlertTriangle,
  ShieldCheck,
  UtensilsCrossed,
  ArrowUpRight,
  TimerReset,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookingModal } from "@/components/booking-modal";
import { bookings, rooms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · RoomHub" },
      { name: "description", content: "Live overview of meeting rooms, bookings, approvals and catering." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Total Rooms", value: "24", delta: "+2 this quarter", icon: DoorOpen, tone: "primary" },
  { label: "Active Bookings Today", value: "47", delta: "+12% vs yesterday", icon: CalendarCheck2, tone: "info" },
  { label: "Room Utilization", value: "78%", delta: "Target 75%", icon: Activity, tone: "success" },
  { label: "No-show Rate", value: "4.2%", delta: "−1.8% this week", icon: AlertTriangle, tone: "warning" },
  { label: "Pending Approvals", value: "6", delta: "3 boardroom", icon: ShieldCheck, tone: "secondary" },
  { label: "Catering Requests", value: "12", delta: "4 in prep", icon: UtensilsCrossed, tone: "primary" },
];

const toneStyles: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-[color:var(--warning-foreground)]",
  secondary: "bg-secondary text-secondary-foreground",
};

function Dashboard() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const todays = bookings.filter((b) => b.day === 0).slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Welcome back, Sarah
            </div>
            <h1 className="mt-1 truncate text-2xl font-semibold sm:text-3xl">
              Workspace overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time visibility across rooms, bookings and approvals.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/calendar">View calendar</Link>
            </Button>
            <Button onClick={() => setBookingOpen(true)}>
              <CalendarCheck2 className="mr-1.5 h-4 w-4" />
              New booking
            </Button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <Card key={k.label} className="shadow-fluent-sm transition-shadow hover:shadow-fluent">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-lg", toneStyles[k.tone])}>
                    <k.icon className="h-4 w-4" />
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="mt-3 text-2xl font-semibold">{k.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-[11px] font-medium text-muted-foreground">{k.delta}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <Card className="shadow-fluent-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Today's schedule</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Live status across all rooms
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/calendar">See all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {todays.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId)!;
                const statusMap: Record<string, { label: string; cls: string; dot: string }> = {
                  confirmed: { label: "Confirmed", cls: "bg-primary/10 text-primary", dot: "text-primary" },
                  "checked-in": { label: "Checked in", cls: "bg-success/10 text-success", dot: "text-success" },
                  pending: { label: "Pending", cls: "bg-warning/15 text-[color:var(--warning-foreground)]", dot: "text-warning" },
                  cancelled: { label: "Cancelled", cls: "bg-destructive/10 text-destructive", dot: "text-destructive" },
                  "auto-released": { label: "Auto-released", cls: "bg-muted text-muted-foreground", dot: "text-muted-foreground" },
                };
                const s = statusMap[b.status];
                return (
                  <div
                    key={b.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-accent/30"
                  >
                    <div className="flex w-16 shrink-0 flex-col items-start">
                      <div className="text-sm font-semibold tabular-nums">
                        {String(Math.floor(b.startHour)).padStart(2, "0")}:
                        {b.startHour % 1 === 0 ? "00" : "30"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {b.duration}h
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("status-dot-live", s.dot)} />
                        <div className="truncate text-sm font-semibold">{b.title}</div>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 truncate text-xs text-muted-foreground">
                        <span className="truncate">{room.name}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {b.attendees}
                        </span>
                        <span>·</span>
                        <span className="truncate">{b.organizer}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className={cn("shrink-0 font-medium", s.cls)}>
                      {s.label}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-fluent-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Check-in next</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Auto-release in 10 min if not checked in
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary-glow/5 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Clock className="h-3.5 w-3.5" /> Starts in 4 min
                </div>
                <div className="mt-2 text-base font-semibold">Design Review</div>
                <div className="text-xs text-muted-foreground">Horizon · 10:00–11:30 AM</div>
                <Progress value={62} className="mt-3 h-1.5" />
                <Button size="sm" className="mt-3 w-full">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Check in
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TimerReset className="h-3.5 w-3.5" /> In 1h 25m
                </div>
                <div className="mt-1 text-sm font-semibold">Quarterly Strategy</div>
                <div className="text-xs text-muted-foreground">Summit Boardroom · 1:00–3:00 PM</div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
    </AppShell>
  );
}
