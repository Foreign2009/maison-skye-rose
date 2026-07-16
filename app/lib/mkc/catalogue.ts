/**
 * Maison Knowledge Catalogue
 *
 * Exports mkcCatalogue as the single authoritative data source.
 * All 93 records are native FragranceKnowledge entries authored directly
 * in app/lib/mkc/native/.
 *
 * Architecture:
 *
 *   Maison Knowledge Catalogue (FragranceKnowledge[])
 *           ↓                           ↓
 *   Display Adapter             Recommendation Adapter
 *           ↓                           ↓
 *   DisplayFragrance              Fragrance
 *           ↓                           ↓
 *         UI              Recommendation Engine
 */

import { nativeFragrances } from "./native";
import type { FragranceKnowledge } from "./types";

export const mkcCatalogue: FragranceKnowledge[] = [...nativeFragrances.values()];
