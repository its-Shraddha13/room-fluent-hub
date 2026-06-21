import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, MapPin, Lock, Monitor, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingModal } from "@/components/booking-modal";
import { rooms, type Room, type RoomStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms · RoomHub" },
      { name: "description", content: "Browse all bookable meeting rooms by capacity and availability." },
    ],
  }),
  component: RoomsPage,
});

const statusStyle: Record<RoomStatus, { label: string; dot: string; chip: string }> = {
  available: { label: "Available", dot: "text-success", chip: "bg-success/10 text-success" },
  occupied: { label: "Occupied", dot: "text-destructive", chip: "bg-destructive/10 text-destructive" },
  reserved: { label: "Reserved", dot: "text-warning", chip: "bg-warning/15 text-[color:var(--warning-foreground)]" },
  maintenance: { label: "Maintenance", dot: "text-muted-foreground", chip: "bg-muted text-muted-foreground" },
};

const sections = [
  { key: "huddle", title: "Huddle Rooms", subtitle: "Small group · 2–6 seats" },
  { key: "medium", title: "Medium Rooms", subtitle: "Team meetings · 8–14 seats" },
  { key: "boardroom", title: "Boardrooms", subtitle: "Executive · approval required" },
] as const;

function RoomCard({ room, onBook }: { room: Room; onBook: () => void }) {
  const s = statusStyle[room.status];
  const live = room.status === "occupied" || room.status === "reserved";
  return (
    <Card className="group overflow-hidden shadow-fluent-sm transition-all hover:-translate-y-0.5 hover:shadow-fluent">
      <div className="relative h-24 bg-gradient-to-br from-secondary via-primary/15 to-primary-glow/25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.25),transparent_60%)]" />
        {room.restricted && (
          <Badge variant="secondary" className="absolute right-2 top-2 gap-1 bg-card/90 backdrop-blur">
            <Lock className="h-3 w-3" /> Restricted
          </Badge>
        )}
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
          <div className="text-lg font-semibold text-primary-foreground drop-shadow">
            {room.name}
          </div>
          <Badge className={cn("gap-1.5 border-0 font-medium", s.chip)} variant="secondary">
            <span className={cn(live ? "status-dot-live" : "status-dot", s.dot)} />
            {s.label}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {room.capacity} seats
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{room.floor}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {room.equipment.map((e) => (
            <Badge key={e} variant="outline" className="gap-1 font-normal text-[10px]">
              <Monitor className="h-2.5 w-2.5" /> {e}
            </Badge>
          ))}
        </div>
        <Button
          className="w-full"
          variant={room.restricted ? "outline" : "default"}
          disabled={room.status === "maintenance"}
          onClick={onBook}
        >
          {room.restricted ? "Request approval" : room.status === "available" ? "Quick book" : "View schedule"}
        </Button>
      </CardContent>
    </Card>
  );
}

function RoomsPage() {
  const [open, setOpen] = useState(false);
  const [defaultRoom, setDefaultRoom] = useState<string | undefined>();
  const [q, setQ] = useState("");

  const filtered = rooms.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">Rooms</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {rooms.length} bookable spaces · live availability
            </p>
          </div>
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a room…"
              className="h-9 w-full pl-9 sm:w-64"
            />
          </div>
        </header>

        {sections.map((sec) => {
          const list = filtered.filter((r) => r.category === sec.key);
          if (!list.length) return null;
          return (
            <section key={sec.key} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{sec.title}</h2>
                  <p className="text-xs text-muted-foreground">{sec.subtitle}</p>
                </div>
                <div className="text-xs text-muted-foreground">{list.length} rooms</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((r) => (
                  <RoomCard
                    key={r.id}
                    room={r}
                    onBook={() => {
                      setDefaultRoom(r.id);
                      setOpen(true);
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <BookingModal open={open} onOpenChange={setOpen} defaultRoomId={defaultRoom} />
    </AppShell>
  );
}
