"use client";

import { useEffect } from "react";
import { initAnalytics } from "../lib/analytics";

const SESSION_KEY = "msr_session_id";

export function AnalyticsInit() {
  useEffect(() => {
    try {
      let sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
      }
      initAnalytics(sessionId);
    } catch {
      // localStorage may be unavailable in restricted browsing contexts.
      // Analytics initialisation is best-effort.
    }
  }, []);

  return null;
}
