"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BookingForm({ propertyId }: { propertyId: string }) {
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
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId,
            preferredDate: form.get("preferredDate"),
            preferredTime: form.get("preferredTime"),
            note: form.get("note"),
          }),
        });

        const data = (await response.json()) as { error?: string; message?: string };
        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Unable to request a viewing.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Viewing request submitted.");
        (event.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="preferredDate">
            Preferred date
          </label>
          <Input id="preferredDate" name="preferredDate" type="date" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="preferredTime">
            Preferred time
          </label>
          <Input id="preferredTime" name="preferredTime" type="time" />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="booking-note">
          Notes for the agent
        </label>
        <Textarea
          defaultValue="I want to inspect parking, drainage, and the full payment breakdown."
          id="booking-note"
          name="note"
        />
      </div>
      <Button disabled={status === "loading"} type="submit">
        {status === "loading" ? "Submitting..." : "Request viewing"}
      </Button>
      {message ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-600"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
