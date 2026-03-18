"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function VerificationForm() {
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
        const response = await fetch("/api/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: form.get("type"),
            licenseNumber: form.get("licenseNumber"),
            documentUrl: form.get("documentUrl"),
            note: form.get("note"),
          }),
        });

        const data = (await response.json()) as { error?: string; message?: string };
        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Unable to submit verification.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Verification submitted.");
        (event.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="type">
          Verification type
        </label>
        <Select defaultValue="agent-license" id="type" name="type">
          <option value="agent-license">Agent license</option>
          <option value="identity">Identity check</option>
          <option value="landlord-proof">Landlord proof</option>
        </Select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="licenseNumber">
          License or document reference
        </label>
        <Input id="licenseNumber" name="licenseNumber" placeholder="LASRERA-AG-1134" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="documentUrl">
          Document URL
        </label>
        <Input id="documentUrl" name="documentUrl" placeholder="https://example.com/document.pdf" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="note">
          Notes for compliance
        </label>
        <Textarea
          id="note"
          name="note"
          placeholder="Explain the identity or agency document you are submitting."
        />
      </div>
      <Button disabled={status === "loading"} type="submit">
        {status === "loading" ? "Submitting..." : "Submit verification"}
      </Button>
      {message ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-600"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
