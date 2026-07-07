"use client";

/**
 * DiscoveryAttributionSetter
 *
 * Zero-render client component. Used by Server Components (e.g. /discover/[id])
 * that cannot call sessionStorage directly. Writes attribution on mount.
 */

import { useEffect } from "react";
import { setDiscoveryAttribution } from "../lib/discoveryAttribution";
import type { DiscoverySource } from "../lib/discoveryAttribution";

interface Props {
  source:    DiscoverySource;
  momentId?: string;
}

export default function DiscoveryAttributionSetter({ source, momentId }: Props) {
  useEffect(() => {
    setDiscoveryAttribution({ source, momentId });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
