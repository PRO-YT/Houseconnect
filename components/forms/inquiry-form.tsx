"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function InquiryForm({
  propertyId,
}: {
  propertyId: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("loading");
        setMessage("");

        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId,
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            message: form.get("message"),
          }),
        });

        const data = (await response.json()) as { error?: string; message?: string };
        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Unable to submit your inquiry.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Inquiry sent successfully.");
        (event.currentTarget as HTMLFormElement).reset();
      }}
    >
      <input name="propertyId" type="hidden" value={propertyId} />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="inquiry-name">
          Full name
        </label>
        <Input id="inquiry-name" name="name" placeholder="Your full name" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="inquiry-email">
            Email
          </label>
          <Input id="inquiry-email" name="email" placeholder="you@example.com" type="email" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="inquiry-phone">
            Phone
          </label>
          <Input id="inquiry-phone" name="phone" placeholder="+234 801 234 5678" />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="inquiry-message">
          Message
        </label>
        <Textarea
          defaultValue="I am interested in this property. Please share availability, total fees, and the next step for inspection."
          id="inquiry-message"
          name="message"
        />
      </div>
      <Button disabled={status === "loading"} type="submit">
        {status === "loading" ? "Sending..." : "Send inquiry"}
      </Button>
      {message ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-600"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
