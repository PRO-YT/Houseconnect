"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type ControlState = {
  q: string;
  purpose: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  furnishingStatus: string;
  sort: string;
};

export function ListingSearchControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialState = useMemo<ControlState>(
    () => ({
      q: searchParams.get("q") || "",
      purpose: searchParams.get("purpose") || "all",
      propertyType: searchParams.get("propertyType") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      furnishingStatus: searchParams.get("furnishingStatus") || "all",
      sort: searchParams.get("sort") || "featured",
    }),
    [searchParams],
  );

  const [values, setValues] = useState(initialState);

  useEffect(() => {
    setValues(initialState);
  }, [initialState]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(values).forEach(([key, value]) => {
        if (value && value !== "all") {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      });

      next.delete("page");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, values]);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Input
        onChange={(event) => setValues((current) => ({ ...current, q: event.target.value }))}
        placeholder="Keyword, area, estate"
        value={values.q}
      />
      <Select
        onChange={(event) =>
          setValues((current) => ({ ...current, purpose: event.target.value }))
        }
        value={values.purpose}
      >
        <option value="all">Rent or sale</option>
        <option value="rent">For rent</option>
        <option value="sale">For sale</option>
      </Select>
      <Select
        onChange={(event) =>
          setValues((current) => ({ ...current, propertyType: event.target.value }))
        }
        value={values.propertyType}
      >
        <option value="all">Property type</option>
        <option value="apartment">Apartment</option>
        <option value="duplex">Duplex</option>
        <option value="studio">Studio</option>
        <option value="terrace">Terrace</option>
        <option value="land">Land</option>
        <option value="commercial">Commercial</option>
        <option value="short-let">Short let</option>
      </Select>
      <Select
        onChange={(event) => setValues((current) => ({ ...current, sort: event.target.value }))}
        value={values.sort}
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price low to high</option>
        <option value="price-desc">Price high to low</option>
        <option value="relevant">Most relevant</option>
      </Select>
      <Input
        min={0}
        onChange={(event) =>
          setValues((current) => ({ ...current, minPrice: event.target.value }))
        }
        placeholder="Minimum price"
        type="number"
        value={values.minPrice}
      />
      <Input
        min={0}
        onChange={(event) =>
          setValues((current) => ({ ...current, maxPrice: event.target.value }))
        }
        placeholder="Maximum price"
        type="number"
        value={values.maxPrice}
      />
      <Input
        min={0}
        onChange={(event) =>
          setValues((current) => ({ ...current, bedrooms: event.target.value }))
        }
        placeholder="Minimum bedrooms"
        type="number"
        value={values.bedrooms}
      />
      <Select
        onChange={(event) =>
          setValues((current) => ({
            ...current,
            furnishingStatus: event.target.value,
          }))
        }
        value={values.furnishingStatus}
      >
        <option value="all">Any furnishing</option>
        <option value="furnished">Furnished</option>
        <option value="semi-furnished">Semi-furnished</option>
        <option value="unfurnished">Unfurnished</option>
      </Select>
    </div>
  );
}
