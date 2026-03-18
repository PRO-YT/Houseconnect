"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "houseconnect:favorites";

function readFavorites() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function FavoriteToggle({ propertyId }: { propertyId: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readFavorites().includes(propertyId));
  }, [propertyId]);

  return (
    <button
      className="transition hover:scale-[1.02]"
      onClick={(event) => {
        event.preventDefault();
        const current = readFavorites();
        const next = current.includes(propertyId)
          ? current.filter((item) => item !== propertyId)
          : [...current, propertyId];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setActive(next.includes(propertyId));
      }}
      type="button"
    >
      <Badge tone={active ? "danger" : "neutral"}>{active ? "Saved" : "Save"}</Badge>
    </button>
  );
}
