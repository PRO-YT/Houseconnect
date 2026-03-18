"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ListingEditorForm({
  mode,
}: {
  mode: "agent" | "landlord";
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
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.get("title"),
            city: form.get("city"),
            area: form.get("area"),
            purpose: form.get("purpose"),
            propertyType: form.get("propertyType"),
            price: form.get("price"),
            description: form.get("description"),
            flow: mode,
          }),
        });

        const data = (await response.json()) as { error?: string; message?: string };
        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Unable to save listing.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Listing saved.");
        (event.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="title">
          Listing title
        </label>
        <Input
          id="title"
          name="title"
          placeholder={
            mode === "agent"
              ? "Executive 2 bedroom apartment with elevator"
              : "Family duplex submitted for agent moderation"
          }
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="city">
            City
          </label>
          <Input id="city" name="city" placeholder="Lekki" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="area">
            Area
          </label>
          <Input id="area" name="area" placeholder="Lekki Phase 1" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="price">
            Price
          </label>
          <Input id="price" min={0} name="price" placeholder="8500000" type="number" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="purpose">
            Purpose
          </label>
          <Select defaultValue="rent" id="purpose" name="purpose">
            <option value="rent">For rent</option>
            <option value="sale">For sale</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="propertyType">
            Property type
          </label>
          <Select defaultValue="apartment" id="propertyType" name="propertyType">
            <option value="apartment">Apartment</option>
            <option value="duplex">Duplex</option>
            <option value="studio">Studio</option>
            <option value="terrace">Terrace</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Highlight the location, trust signals, documentation, and amenities."
        />
      </div>
      <Button disabled={status === "loading"} type="submit">
        {status === "loading"
          ? "Saving..."
          : mode === "agent"
            ? "Save listing draft"
            : "Submit for agent moderation"}
      </Button>
      {message ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-600"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
