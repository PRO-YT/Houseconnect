"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
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
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            message: form.get("message"),
          }),
        });

        const data = (await response.json()) as { error?: string; message?: string };
        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Unable to submit your message.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Message received.");
        (event.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="contact-name">
            Name
          </label>
          <Input id="contact-name" name="name" placeholder="Your full name" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="contact-email">
            Email
          </label>
          <Input id="contact-email" name="email" placeholder="you@example.com" type="email" />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="contact-phone">
          Phone
        </label>
        <Input id="contact-phone" name="phone" placeholder="+234 801 234 5678" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="contact-message">
          Message
        </label>
        <Textarea id="contact-message" name="message" placeholder="Tell us what you need help with." />
      </div>
      <Button disabled={status === "loading"} type="submit">
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
      {message ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-600"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
