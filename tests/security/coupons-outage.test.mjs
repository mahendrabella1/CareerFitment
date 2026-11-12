// H-03 (part): when the coupons collection can't be read, the fallback must not
// include the 100%-off code. The fake credentials make getFirestore() fail -
// exactly what an outage looks like to lib/coupons.ts.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.FIREBASE_PROJECT_ID = "demo-onegrasp";
process.env.FIREBASE_CLIENT_EMAIL = "test@demo-onegrasp.iam.gserviceaccount.com";
process.env.FIREBASE_PRIVATE_KEY = "not-a-real-key";

test("H-03: a coupons outage never makes the free code work", async () => {
  const { getCoupons, findCoupon, priceWithCoupon } = await import("../../lib/coupons.ts");
  const { OFFER } = await import("../../lib/offer.ts");
  const original = console.error;
  console.error = () => {};
  try {
    const coupons = await getCoupons();
    assert.ok(coupons.length > 0, "paid discounts still work");
    assert.ok(coupons.every((c) => c.percentOff < 100), "no 100% coupon during an outage");
    if (OFFER.freeCouponCode) {
      assert.equal(await findCoupon(OFFER.freeCouponCode), null);
      const priced = await priceWithCoupon(4900, OFFER.freeCouponCode);
      assert.equal(priced.free, false);
      assert.equal(priced.invalidCode, true);
    }
  } finally {
    console.error = original;
  }
});
