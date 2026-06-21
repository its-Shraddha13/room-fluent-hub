import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · RoomHub" },
      { name: "description", content: "Sign in to RoomHub with your Microsoft work account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left hero */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-secondary via-primary to-primary-glow lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(1_0_0/0.2),transparent_50%),radial-gradient(circle_at_80%_70%,oklch(1_0_0/0.15),transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-card/15 backdrop-blur">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold">RoomHub</div>
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight">
              Smart meeting rooms for the modern enterprise.
            </h1>
            <p className="max-w-md text-base text-primary-foreground/85">
              Book any room across your campus in seconds. Real-time availability,
              auto-release, and approvals — built on the Microsoft 365 stack.
            </p>

            <div className="grid max-w-md gap-3 pt-4">
              {[
                { icon: Sparkles, t: "Live availability across every floor" },
                { icon: ShieldCheck, t: "Role-based access for boardrooms & VIP spaces" },
                { icon: Building2, t: "Integrates with Teams, Outlook & Surface Hub" },
              ].map((f) => (
                <div key={f.t} className="flex items-center gap-3 rounded-lg bg-card/10 px-3 py-2.5 backdrop-blur">
                  <f.icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{f.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-primary-foreground/70">
            © 2026 Contoso Workplace · Enterprise edition
          </div>
        </div>
      </div>

      {/* Right login */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-base font-semibold">RoomHub</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your company Microsoft account to continue.
            </p>
          </div>

          <Button
            size="lg"
            variant="outline"
            className="w-full justify-center gap-3 border-border bg-card text-foreground hover:bg-accent"
            onClick={() => navigate({ to: "/" })}
          >
            <MicrosoftLogo />
            Sign in with Microsoft
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">or</div>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate({ to: "/" })}
          >
            Continue as guest
          </Button>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            By signing in you agree to Contoso's{" "}
            <a className="font-medium text-primary hover:underline" href="#">Acceptable Use Policy</a>{" "}
            and confirm SSO via Azure AD.
          </div>
        </div>
      </div>
    </div>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" className="h-4 w-4" aria-hidden>
      <rect width="10" height="10" x="1" y="1" fill="#F25022" />
      <rect width="10" height="10" x="12" y="1" fill="#7FBA00" />
      <rect width="10" height="10" x="1" y="12" fill="#00A4EF" />
      <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
    </svg>
  );
}
