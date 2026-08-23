export type TierKey = "SINGLE_ESSAY" | "ONE_SCHOOL" | "THREE_SCHOOL" | "SIX_SCHOOL" | "UNLIMITED";

export type Tier = {
  key: TierKey;
  name: string;
  priceCents: number;
  description: string;
  mostPopular?: boolean;
};

export const TIERS: Tier[] = [
  {
    key: "SINGLE_ESSAY",
    name: "Single Essay/PIQ Review",
    priceCents: 9900,
    description: "In-depth coaching on one essay or PIQ.",
  },
  {
    key: "ONE_SCHOOL",
    name: "1 School Package",
    priceCents: 19900,
    description: "Every written part of one application.",
  },
  {
    key: "THREE_SCHOOL",
    name: "3 Schools Package",
    priceCents: 29900,
    description: "Every written part of three applications.",
    mostPopular: true,
  },
  {
    key: "SIX_SCHOOL",
    name: "6 Schools Package",
    priceCents: 39900,
    description: "Every written part of six applications.",
  },
  {
    key: "UNLIMITED",
    name: "All Schools / Unlimited",
    priceCents: 49900,
    description: "Every written part of every application, unlimited schools.",
  },
];

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function getTier(key: string): Tier | undefined {
  return TIERS.find((t) => t.key === key);
}
