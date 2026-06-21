import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X, MessageSquare, ShieldAlert, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { approvals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals · RoomHub" },
      { name: "description", content: "Review and approve restricted boardroom bookings." },
    ],
  }),
  component: ApprovalsPage,
});

function ApprovalsPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldAlert className="h-3.5 w-3.5" /> Boardroom approvals
          </div>
          <h1 className="mt-1 text-2xl font-semibold">Pending requests</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {approvals.length} requests awaiting your decision
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {approvals.map((a) => (
            <Card key={a.id} className="shadow-fluent-sm transition-shadow hover:shadow-fluent">
              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                      {a.requestor
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{a.requestor}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.role}</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0",
                      a.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/15 text-[color:var(--warning-foreground)]",
                    )}
                  >
                    {a.priority} priority
                  </Badge>
                </div>

                <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{a.room}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.time}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{a.reason}</div>
                </div>

                <Textarea
                  rows={2}
                  placeholder="Add a comment for the requestor (optional)…"
                  className="resize-none text-sm"
                />

                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => toast.success(`Approved · ${a.room}`)}
                  >
                    <Check className="mr-1.5 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.error(`Rejected · ${a.requestor}`)}
                  >
                    <X className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Comment">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
