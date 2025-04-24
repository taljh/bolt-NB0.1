export type PricingSegment = "economic" | "medium" | "luxury" | "premium";

export const PRICING_RANGES: Record<PricingSegment, PricingRange> = {
  economic: { min: 100, max: 300, label: 'اقتصادية' },
  medium: { min: 301, max: 700, label: 'متوسطة' },
  luxury: { min: 701, max: 1500, label: 'راقية' },
  premium: { min: 1501, max: 3000, label: 'فاخرة جداً' }
};