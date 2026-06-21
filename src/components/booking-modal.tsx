import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rooms, weekDays } from "@/lib/mock-data";
import { bookingsStore, timeToHour } from "@/lib/bookings-store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRoomId?: string;
  defaultStart?: string;
  defaultEnd?: string;
  defaultDay?: number;
}

export function BookingModal({
  open,
  onOpenChange,
  defaultRoomId,
  defaultStart,
  defaultEnd,
  defaultDay,
}: Props) {
  const [title, setTitle] = useState("");
  const [room, setRoom] = useState(defaultRoomId ?? "r1");
  const [day, setDay] = useState<number>(defaultDay ?? 0);
  const [start, setStart] = useState(defaultStart ?? "10:00");
  const [end, setEnd] = useState(defaultEnd ?? "11:00");
  const [attendees, setAttendees] = useState("4");
  const [organizer, setOrganizer] = useState("Sarah Kim");
  const [error, setError] = useState<string | null>(null);

  // Re-seed when reopened with new defaults (e.g. drag-to-create on calendar)
  useEffect(() => {
    if (!open) return;
    if (defaultRoomId) setRoom(defaultRoomId);
    if (defaultStart) setStart(defaultStart);
    if (defaultEnd) setEnd(defaultEnd);
    if (typeof defaultDay === "number") setDay(defaultDay);
    setError(null);
  }, [open, defaultRoomId, defaultStart, defaultEnd, defaultDay]);

  const selectedRoom = rooms.find((r) => r.id === room);
  const startH = timeToHour(start);
  const endH = timeToHour(end);
  const conflict =
    startH < endH ? bookingsStore.findConflict(room, day, startH, endH) : undefined;

  function submit() {
    if (!title.trim()) {
      setError("Please give your meeting a name.");
      return;
    }
    if (startH >= endH) {
      setError("End time must be after start time.");
      return;
    }
    if (startH < 8 || endH > 19) {
      setError("Bookings must be between 8:00 AM and 7:00 PM.");
      return;
    }
    const conflicting = bookingsStore.findConflict(room, day, startH, endH);
    if (conflicting) {
      setError(
        `${selectedRoom?.name} is already booked for "${conflicting.title}" at this time.`,
      );
      return;
    }
    const attendeeCount = Math.max(1, parseInt(attendees || "1", 10) || 1);
    if (selectedRoom && attendeeCount > selectedRoom.capacity) {
      setError(
        `${selectedRoom.name} seats ${selectedRoom.capacity}. Reduce attendees or pick a larger room.`,
      );
      return;
    }

    const requiresApproval = selectedRoom?.restricted;
    bookingsStore.add({
      id: `b-${Date.now()}`,
      title: title.trim(),
      roomId: room,
      organizer,
      attendees: attendeeCount,
      startHour: startH,
      duration: endH - startH,
      day,
      status: requiresApproval ? "pending" : "confirmed",
    });

    setError(null);
    onOpenChange(false);
    toast.success(requiresApproval ? "Booking submitted for approval" : "Booking confirmed", {
      description: `${title.trim()} · ${selectedRoom?.name} · ${weekDays[day]} ${start}–${end}`,
    });
    setTitle("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New booking</DialogTitle>
          <DialogDescription>Reserve a room for your team.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Meeting name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product roadmap review"
              autoFocus
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} · {r.capacity} seats · {r.floor}
                    {r.restricted ? " · approval" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Day
              </Label>
              <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>
                      {d} · Jun {22 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="start" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Start
              </Label>
              <Input id="start" type="time" step={1800} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="end" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> End
              </Label>
              <Input id="end" type="time" step={1800} value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="organizer">Organizer</Label>
              <Input id="organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="attendees" className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Attendees
              </Label>
              <Input
                id="attendees"
                type="number"
                min={1}
                max={selectedRoom?.capacity ?? 50}
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={2} placeholder="Optional agenda or notes" />
          </div>

          {conflict && !error && (
            <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-[color:var(--warning-foreground)]">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Heads up — "{conflict.title}" is already in {selectedRoom?.name} during this window.
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Book room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
