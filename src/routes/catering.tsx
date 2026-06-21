import { createFileRoute } from "@tanstack/react-router";
import { UtensilsCrossed, Clock, MapPin, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cateringRequests } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Catering · RoomHub" },
      { name: "description", content: "Manage catering requests for meetings and events." },
    ],
  }),
  component: CateringPage,
});

const statusStyle = {
  pending: "bg-warning/15 text-[color:var(--warning-foreground)]",
  preparing: "bg-info/10 text-info",
  delivered: "bg-success/10 text-success",
};

const summary = [
  { label: "Today's orders", value: "12" },
  { label: "In preparation", value: "4" },
  { label: "Delivered", value: "6" },
];

function CateringPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 truncate text-2xl font-semibold">
              <UtensilsCrossed className="h-5 w-5 text-primary" /> Catering requests
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Coordinate food & beverage for meetings
            </p>
          </div>
          <Button className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" /> New request
          </Button>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {summary.map((s) => (
            <Card key={s.label} className="shadow-fluent-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden p-0 shadow-fluent-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cateringRequests.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.meeting}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {c.room}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {c.time}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[280px] text-muted-foreground">{c.items}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className={cn("capitalize", statusStyle[c.status])}>
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
