/**
 * PostHog Server-Side Query Helper
 *
 * Server-only. Executes HogQL queries against the PostHog Query API.
 * Returns null when credentials are absent or the request fails —
 * analytics failures are isolated from application behaviour, consistent
 * with the outbound analytics module's silent-failure contract.
 *
 * Required environment variables (server-side, no NEXT_PUBLIC_ prefix):
 *   POSTHOG_PERSONAL_API_KEY  Personal API key from PostHog → Project Settings → Personal API Keys
 *   POSTHOG_PROJECT_ID        Numeric project ID visible in PostHog URL (/project/{id}/...)
 *
 * The existing NEXT_PUBLIC_POSTHOG_HOST is reused for the API host.
 * Default: https://app.posthog.com
 */

const QUERY_TIMEOUT_MS = 5_000;

export interface HogQLResult {
  readonly columns: readonly string[];
  readonly results: readonly (string | number | null)[][];
}

export async function queryHogQL(query: string): Promise<HogQLResult | null> {
  const apiKey    = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host      = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

  if (!apiKey || !projectId) return null;

  try {
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);

    const response = await fetch(
      `${host}/api/projects/${projectId}/query`,
      {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body:   JSON.stringify({ kind: "HogQLQuery", query }),
        signal: controller.signal,
        cache:  "no-store",
      },
    );

    clearTimeout(timer);

    if (!response.ok) return null;

    const data = await response.json() as {
      columns?: unknown;
      results?: unknown;
    };

    if (
      !Array.isArray(data.columns) ||
      !Array.isArray(data.results)
    ) {
      return null;
    }

    return {
      columns: data.columns as string[],
      results: data.results as (string | number | null)[][],
    };
  } catch {
    return null;
  }
}
