import { describe, expect, it } from "vitest";

import { calculateDiscount, calculateShipping } from "@/lib/commerce";

describe("storefront pricing", () => {
  it("charges ₹40 shipping below the ₹500 free-shipping threshold", () => {
    expect(calculateShipping(499)).toBe(40);
  });

  it("unlocks free shipping at ₹500", () => {
    expect(calculateShipping(500)).toBe(0);
  });

  it("applies the stated 15% YOUTH15 coupon", () => {
    expect(calculateDiscount(500, "YOUTH15")).toBe(75);
  });

  it("applies the stated 10% YOUTH10 coupon regardless of capitalization", () => {
    expect(calculateDiscount(500, "youth10")).toBe(50);
  });
});