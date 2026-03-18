"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);
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
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
          }),
        });

        const data = (await response.json()) as { error?: string };
        setLoading(false);

        if (!response.ok) {
          setError(data.error || "Unable to sign you in.");
          return;
        }

        router.push(next);
        router.refresh();
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <Input defaultValue="buyer@houseconnect.africa" id="email" name="email" type="email" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <Input defaultValue="SecurePass123!" id="password" name="password" type="password" />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Button disabled={loading} type="submit">
        {loading ? "Signing in..." : "Continue to dashboard"}
      </Button>
      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Demo accounts all use <span className="font-semibold text-slate-950">SecurePass123!</span>
      </p>
    </form>
  );
}
