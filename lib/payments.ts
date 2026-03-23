export async function createCheckoutSession(input: {
  userId: string;
  planId?: string;
  type: "subscription" | "featured-listing" | "verification-fee";
  provider: "paystack" | "flutterwave" | "stripe";
}) {
  const providerSecret =
    input.provider === "paystack"
      ? process.env.PAYSTACK_SECRET_KEY
      : input.provider === "flutterwave"
        ? process.env.FLUTTERWAVE_SECRET_KEY
        : process.env.STRIPE_SECRET_KEY;
  const isConfigured = Boolean(providerSecret && !providerSecret.includes("placeholder"));

  return {
    checkoutUrl: isConfigured ? "#billing-live-session-pending" : "#billing-placeholder",
    reference: `${input.provider}_${input.type}_${input.userId}`,
    status: isConfigured ? "ready" : "mocked",
  };
}
