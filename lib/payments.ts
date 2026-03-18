export async function createCheckoutSession(input: {
  userId: string;
  planId?: string;
  type: "subscription" | "featured-listing" | "verification-fee";
  provider: "paystack" | "flutterwave" | "stripe";
}) {
  return {
    checkoutUrl: "#billing-placeholder",
    reference: `${input.provider}_${input.type}_${input.userId}`,
    status: "mocked",
  };
}
