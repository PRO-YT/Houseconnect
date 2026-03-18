"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "houseconnect:compare";

function readCompare() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function CompareToggle({ propertyId }: { propertyId: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readCompare().includes(propertyId));
  }, [propertyId]);

  return (
    <button
      className="transition hover:scale-[1.02]"
      onClick={(event) => {
        event.preventDefault();
        const current = readCompare();
        const next = current.includes(propertyId)
          ? current.filter((item) => item !== propertyId)
          : [...current, propertyId].slice(0, 4);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setActive(next.includes(propertyId));
      }}
      type="button"
    >
      <Badge tone={active ? "accent" : "neutral"}>{active ? "Comparing" : "Compare"}</Badge>
    </button>
  );
}
