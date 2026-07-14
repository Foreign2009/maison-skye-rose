import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const LOG_PATH = path.join(
  process.cwd(),
  "scripts", "factory", "graph", "graph-log.json",
);

interface LogEntry {
  timestamp: string;
  action:    string;
  slug:      string;
  detail:    string;
}

export function logGraphAction(action: string, slug: string, detail: string): void {
  const entries: LogEntry[] = existsSync(LOG_PATH)
    ? (JSON.parse(readFileSync(LOG_PATH, "utf-8")) as LogEntry[])
    : [];

  entries.push({ timestamp: new Date().toISOString(), action, slug, detail });

  writeFileSync(LOG_PATH, JSON.stringify(entries, null, 2), "utf-8");
}
