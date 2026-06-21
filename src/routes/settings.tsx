import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · RoomHub" },
      { name: "description", content: "Manage workspace preferences and notifications." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Workspace and notification preferences</p>
        </header>

        <Card className="shadow-fluent-sm">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue="Sarah Kim" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" defaultValue="sarah.kim@contoso.com" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" defaultValue="Office Management" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="loc">Default office</Label>
              <Input id="loc" defaultValue="Seattle HQ" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-fluent-sm">
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Booking confirmations", desc: "Email + in-app when a booking is confirmed" },
              { label: "Check-in reminders", desc: "10 minutes before meeting start" },
              { label: "Auto-release warnings", desc: "Notify before releasing an unattended room" },
              { label: "Approval requests", desc: "Boardroom requests awaiting decision" },
              { label: "Weekly utilization digest", desc: "Monday summary of room usage" },
            ].map((n, i) => (
              <div key={n.label}>
                {i > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{n.label}</div>
                    <div className="text-xs text-muted-foreground">{n.desc}</div>
                  </div>
                  <Switch defaultChecked={i < 4} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </div>
    </AppShell>
  );
}
