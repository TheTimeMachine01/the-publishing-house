export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_FEE = 40;

export function calculateShipping(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function calculateDiscount(subtotal: number, coupon: string) {
  const normalized = coupon.trim().toUpperCase();
  if (normalized === "YOUTH15") return Math.round(subtotal * 0.15);
  if (normalized === "YOUTH10") return Math.round(subtotal * 0.1);
  return 0;
}