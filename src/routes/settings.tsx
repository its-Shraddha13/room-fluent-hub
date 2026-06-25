import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · RoomHub" },
      { name: "description", content: "Manage workspace preferences and notifications." },
    ],
  }),
  component: SettingsPage,
});

type Profile = {
  name: string;
  email: string;
  dept: string;
  loc: string;
};

const DEFAULT_PROFILE: Profile = {
  name: "Sarah Kim",
  email: "sarah.kim@contoso.com",
  dept: "Office Management",
  loc: "Seattle HQ",
};

const NOTIF_ITEMS = [
  { key: "confirmations", label: "Booking confirmations", desc: "Email + in-app when a booking is confirmed", def: true },
  { key: "checkin", label: "Check-in reminders", desc: "10 minutes before meeting start", def: true },
  { key: "autorelease", label: "Auto-release warnings", desc: "Notify before releasing an unattended room", def: true },
  { key: "approvals", label: "Approval requests", desc: "Boardroom requests awaiting decision", def: true },
  { key: "digest", label: "Weekly utilization digest", desc: "Monday summary of room usage", def: false },
];

const PROFILE_KEY = "roomhub:profile";
const NOTIF_KEY = "roomhub:notifications";

function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [savedProfile, setSavedProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [notifs, setNotifs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIF_ITEMS.map((n) => [n.key, n.def])),
  );
  const [savedNotifs, setSavedNotifs] = useState(notifs);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PROFILE_KEY);
      if (p) {
        const parsed = { ...DEFAULT_PROFILE, ...JSON.parse(p) };
        setProfile(parsed);
        setSavedProfile(parsed);
      }
      const n = localStorage.getItem(NOTIF_KEY);
      if (n) {
        const parsed = { ...notifs, ...JSON.parse(n) };
        setNotifs(parsed);
        setSavedNotifs(parsed);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!profile.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) {
      toast.error("Enter a valid work email");
      return;
    }
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
      setSavedProfile(profile);
      setSavedNotifs(notifs);
      toast.success("Changes saved");
    } catch {
      toast.error("Could not save changes");
    }
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setNotifs(savedNotifs);
    toast.message("Changes discarded");
  };

  const handleExportUI = async () => {
    try {
      const res = await fetch("/export-ui.zip");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "roomhub-ui-pages.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("UI pages exported");
    } catch {
      toast.error("Could not export UI pages");
    }
  };

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
              <Input id="name" value={profile.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" value={profile.dept} onChange={(e) => update("dept", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="loc">Default office</Label>
              <Input id="loc" value={profile.loc} onChange={(e) => update("loc", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-fluent-sm">
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {NOTIF_ITEMS.map((n, i) => (
              <div key={n.key}>
                {i > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{n.label}</div>
                    <div className="text-xs text-muted-foreground">{n.desc}</div>
                  </div>
                  <Switch
                    checked={!!notifs[n.key]}
                    onCheckedChange={(v) => setNotifs((s) => ({ ...s, [n.key]: v }))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-fluent-sm">
          <CardHeader>
            <CardTitle className="text-base">Export</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-medium">Export UI pages</div>
              <div className="text-xs text-muted-foreground">Download a ZIP of all UI pages and components</div>
            </div>
            <Button variant="outline" onClick={handleExportUI}>
              <Download className="mr-2 h-4 w-4" />
              Export UI ZIP
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </AppShell>
  );
}
