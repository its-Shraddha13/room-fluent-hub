import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Activity, Clock, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · RoomHub" },
      { name: "description", content: "Room utilization, peak hours, and booking trends." },
    ],
  }),
  component: Analytics,
});

const utilization = [
  { day: "Mon", value: 72 },
  { day: "Tue", value: 81 },
  { day: "Wed", value: 78 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 65 },
];

const peakHours = [
  { h: "8a", v: 12 }, { h: "9a", v: 32 }, { h: "10a", v: 58 },
  { h: "11a", v: 64 }, { h: "12p", v: 42 }, { h: "1p", v: 51 },
  { h: "2p", v: 68 }, { h: "3p", v: 72 }, { h: "4p", v: 49 }, { h: "5p", v: 22 },
];

const popular = [
  { name: "Horizon", value: 38 },
  { name: "Meridian", value: 27 },
  { name: "Summit", value: 18 },
  { name: "Aurora", value: 12 },
  { name: "Other", value: 5 },
];

const pieColors = [
  "oklch(0.508 0.116 285.5)",
  "oklch(0.62 0.135 285.5)",
  "oklch(0.52 0.155 145)",
  "oklch(0.82 0.17 85)",
  "oklch(0.9 0.005 286)",
];

const heatmap = Array.from({ length: 5 }, (_, d) =>
  Array.from({ length: 10 }, (_, h) => Math.round(Math.random() * 100)),
);

const stats = [
  { icon: Activity, label: "Avg utilization", value: "78%", trend: "+4.2%", tone: "success" },
  { icon: Clock, label: "Avg booking", value: "52m", trend: "−3m", tone: "primary" },
  { icon: AlertTriangle, label: "No-shows", value: "4.2%", trend: "−1.8%", tone: "warning" },
  { icon: TrendingUp, label: "Bookings / week", value: "312", trend: "+12%", tone: "info" },
];

const toneCls: Record<string, string> = {
  success: "bg-success/10 text-success",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/15 text-[color:var(--warning-foreground)]",
  info: "bg-info/10 text-info",
};

function Analytics() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Room performance & booking trends · last 30 days
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="shadow-fluent-sm">
              <CardContent className="p-4">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", toneCls[s.tone])}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-2xl font-semibold">{s.value}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{s.label}</span>
                  <span className="font-semibold text-success">{s.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="shadow-fluent-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Daily utilization</CardTitle>
              <p className="text-xs text-muted-foreground">Average % of bookable hours used</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilization}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "var(--accent)" }}
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fluent-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Most popular rooms</CardTitle>
              <p className="text-xs text-muted-foreground">Share of bookings</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popular}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {popular.map((_, i) => (
                        <Cell key={i} fill={pieColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {popular.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-sm" style={{ background: pieColors[i] }} />
                      {p.name}
                    </div>
                    <div className="font-semibold tabular-nums">{p.value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="shadow-fluent-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Peak usage hours</CardTitle>
              <p className="text-xs text-muted-foreground">Concurrent bookings per hour</p>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="h" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      dot={{ fill: "var(--primary)", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fluent-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Occupancy heatmap</CardTitle>
              <p className="text-xs text-muted-foreground">Day × hour utilization</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {heatmap.map((row, d) => (
                  <div key={d} className="grid grid-cols-[40px_repeat(10,minmax(0,1fr))] items-center gap-1">
                    <div className="text-[11px] font-medium text-muted-foreground">
                      {["Mon", "Tue", "Wed", "Thu", "Fri"][d]}
                    </div>
                    {row.map((v, h) => (
                      <div
                        key={h}
                        className="h-7 rounded"
                        style={{
                          background: `color-mix(in oklab, var(--primary) ${v}%, var(--muted))`,
                        }}
                        title={`${v}%`}
                      />
                    ))}
                  </div>
                ))}
                <div className="ml-[44px] mt-1 grid grid-cols-10 gap-1 text-[10px] text-muted-foreground">
                  {["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p"].map((h) => (
                    <div key={h} className="text-center">{h}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
