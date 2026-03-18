"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.get("fullName"),
            email: form.get("email"),
            phone: form.get("phone"),
            role: form.get("role"),
            password: form.get("password"),
          }),
        });

        const data = (await response.json()) as { error?: string };
        setLoading(false);

        if (!response.ok) {
          setError(data.error || "Unable to create account.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
          Full name
        </label>
        <Input id="fullName" name="fullName" placeholder="Adaobi Nwosu" />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" placeholder="you@example.com" type="email" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="phone">
            Phone
          </label>
          <Input id="phone" name="phone" placeholder="+234 801 234 5678" />
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="role">
            Role
          </label>
          <Select defaultValue="buyer" id="role" name="role">
            <option value="buyer">Buyer / renter</option>
            <option value="agent">Agent</option>
            <option value="landlord">Landlord / owner</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <Input id="password" name="password" placeholder="Choose a strong password" type="password" />
        </div>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Button disabled={loading} type="submit">
        {loading ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-sm leading-6 text-slate-500">
        By continuing, you agree to the terms, privacy policy, and trust-focused moderation flow.
      </p>
    </form>
  );
}
