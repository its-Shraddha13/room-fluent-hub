import { useState } from "react";
import { Bell, Search, ChevronDown, Check } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const viewOptions = ["Day", "Week", "Month"] as const;

export function AppHeader() {
  const [view, setView] = useState<(typeof viewOptions)[number]>("Week");
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card/80 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="shrink-0" />

      <div className="relative hidden min-w-0 flex-1 md:block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search rooms, bookings, people…"
          className="h-9 rounded-lg border-border bg-background pl-9 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden text-xs font-medium text-muted-foreground lg:block">
          {today}
        </div>

        <div className="hidden items-center rounded-lg border border-border bg-background p-0.5 sm:flex">
          {viewOptions.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                view === v
                  ? "bg-primary text-primary-foreground shadow-fluent-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                5
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <div className="text-sm font-semibold">Notifications</div>
              <button className="text-xs font-medium text-primary hover:underline">
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-accent/40"
                >
                  <div
                    className={cn(
                      "status-dot mt-1.5 shrink-0",
                      n.type === "success" && "text-success",
                      n.type === "warning" && "text-warning",
                      n.type === "info" && "text-info",
                      n.type === "destructive" && "text-destructive",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="truncate text-xs font-semibold">{n.title}</div>
                      <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{n.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-[11px] font-semibold">
                  SK
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-semibold">Sarah Kim</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                <Badge variant="secondary" className="h-4 rounded px-1 text-[10px]">
                  Office Manager
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Check className="mr-2 h-3.5 w-3.5" /> Available
            </DropdownMenuItem>
            <DropdownMenuItem>My bookings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
