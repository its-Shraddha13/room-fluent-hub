import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Users } from "lucide-react";
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
import { rooms } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRoomId?: string;
  defaultStart?: string;
}

export function BookingModal({ open, onOpenChange, defaultRoomId, defaultStart }: Props) {
  const [title, setTitle] = useState("");
  const [room, setRoom] = useState(defaultRoomId ?? "r1");
  const [start, setStart] = useState(defaultStart ?? "10:00");
  const [end, setEnd] = useState("11:00");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!title.trim()) {
      setError("Please give your meeting a name.");
      return;
    }
    if (start >= end) {
      setError("End time must be after start time.");
      return;
    }
    setError(null);
    onOpenChange(false);
    toast.success("Booking confirmed", {
      description: `${title} · ${rooms.find((r) => r.id === room)?.name} · ${start}–${end}`,
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
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="date" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Date
              </Label>
              <Input id="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="start" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Start
              </Label>
              <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="end" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> End
              </Label>
              <Input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="attendees" className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Attendees
            </Label>
            <Input id="attendees" placeholder="Add people…" defaultValue="alex@, priya@, marcus@" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={2} placeholder="Optional agenda or notes" />
          </div>


          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error}
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
