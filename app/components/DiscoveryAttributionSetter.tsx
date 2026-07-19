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
import { recordDiscoveryFilter } from "../lib/customer/sync/CustomerProfileSync";

interface CollectionDimensions {
  families:  readonly string[];
  occasions: readonly string[];
  seasons:   readonly string[];
}

interface Props {
  source:      DiscoverySource;
  momentId?:   string;
  dimensions?: CollectionDimensions;
}

export default function DiscoveryAttributionSetter({ source, momentId, dimensions }: Props) {
  useEffect(() => {
    setDiscoveryAttribution({ source, momentId });
    if (momentId && dimensions) {
      recordDiscoveryFilter(momentId, dimensions.families, dimensions.occasions, dimensions.seasons);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
