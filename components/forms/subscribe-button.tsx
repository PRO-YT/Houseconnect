"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SubscribeButton({
  planId,
  provider,
  label,
}: {
  planId: string;
  provider: "paystack" | "flutterwave";
  label: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <div className="grid gap-2">
      <Button
        disabled={status === "loading"}
        onClick={async () => {
          setStatus("loading");
          setMessage("");

          const response = await fetch("/api/billing/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planId, provider }),
          });

          const data = (await response.json()) as {
            error?: string;
            checkout?: { checkoutUrl: string; reference: string; status: string };
          };

          if (!response.ok || !data.checkout) {
            setStatus("error");
            setMessage(data.error || "Unable to start checkout.");
            return;
          }

          setStatus("success");
          setMessage(
            data.checkout.status === "mocked"
              ? `Checkout scaffold created: ${data.checkout.reference}. Replace the placeholder provider call with your live ${provider} integration next.`
              : `Checkout created: ${data.checkout.reference}`,
          );

          if (data.checkout.checkoutUrl && data.checkout.checkoutUrl !== "#billing-placeholder") {
            window.location.href = data.checkout.checkoutUrl;
          }
        }}
        type="button"
        variant={provider === "paystack" ? "primary" : "secondary"}
      >
        {status === "loading" ? "Starting checkout..." : label}
      </Button>
      {message ? (
        <p className={status === "error" ? "text-xs text-rose-600" : "text-xs text-slate-500"}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
