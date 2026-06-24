import { createFileRoute } from "@tanstack/react-router";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import JSZip from "jszip";

const UI_FILES = [
  "src/routes/index.tsx",
  "src/routes/calendar.tsx",
  "src/routes/rooms.tsx",
  "src/routes/approvals.tsx",
  "src/routes/analytics.tsx",
  "src/routes/settings.tsx",
  "src/routes/login.tsx",
  "src/routes/__root.tsx",
  "src/components/app-shell.tsx",
  "src/components/app-header.tsx",
  "src/components/app-sidebar.tsx",
  "src/components/booking-modal.tsx",
  "src/lib/mock-data.ts",
  "src/lib/bookings-store.ts",
  "src/styles.css",
];

export const Route = createFileRoute("/api/public/export-ui.zip")({
  server: {
    handlers: {
      GET: async () => {
        const zip = new JSZip();
        const root = process.cwd();

        for (const file of UI_FILES) {
          const path = resolve(root, file);
          try {
            const content = await readFile(path, "utf-8");
            zip.file(file, content);
          } catch (err) {
            console.error(`Failed to add ${file} to UI export:`, err);
          }
        }

        const blob = await zip.generateAsync({ type: "nodebuffer" });
        return new Response(blob, {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="roomhub-ui-pages.zip"',
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
