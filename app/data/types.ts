export type Fragrance = {
  id: string;

  name: string;

  brand: string;

  gender:
    | "male"
    | "female"
    | "unisex";

  family: string[];

  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };

  vibe: string[];

  occasions: string[];

  seasons: string[];

  scentCharacter:
    | "Fresh & Light"
    | "Balanced Signature"
    | "Rich & Long Wearing"
    | "Deep & Intense";

  projection:
    | "soft"
    | "moderate"
    | "strong";

  signatureStyle: string[];

  recommendedFor: string[];

  sweetness: number;

  freshness: number;

  warmth: number;

  intensity: number;

  versatility: number;

  popularity: number;

  image?: string;

  featured?: boolean;

  bestSeller?: boolean;

  newArrival?: boolean;
};