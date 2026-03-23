"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildMapEmbedUrl, extractCoordinatesFromMapLink } from "@/lib/maps";

const SAMPLE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
];

const DEFAULT_AMENITIES =
  "gated estate, fitted kitchen, treated water, parking, security post, prepaid meter";

const DEFAULT_COORDINATES = {
  latitude: "6.4316",
  longitude: "3.4565",
};

export function ListingEditorForm({
  mode,
}: {
  mode: "agent" | "landlord";
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState(DEFAULT_COORDINATES.latitude);
  const [longitude, setLongitude] = useState(DEFAULT_COORDINATES.longitude);
  const [mapUrl, setMapUrl] = useState("");
  const [amenities, setAmenities] = useState(DEFAULT_AMENITIES);
  const [imageUrls, setImageUrls] = useState(SAMPLE_IMAGE_URLS);

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const hasMapPreview = Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude);

  const applyCoordinatesFromMapLink = () => {
    const coordinates = extractCoordinatesFromMapLink(mapUrl);
    if (!coordinates) {
      return false;
    }

    setLatitude(String(coordinates.latitude));
    setLongitude(String(coordinates.longitude));
    return true;
  };

  const resetRichFields = () => {
    setLatitude(DEFAULT_COORDINATES.latitude);
    setLongitude(DEFAULT_COORDINATES.longitude);
    setMapUrl("");
    setAmenities(DEFAULT_AMENITIES);
    setImageUrls(SAMPLE_IMAGE_URLS);
  };

  return (
    <form
      className="grid gap-6"
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
            description: form.get("description"),
            address: form.get("address"),
            city: form.get("city"),
            state: form.get("state"),
            area: form.get("area"),
            neighborhood: form.get("neighborhood"),
            purpose: form.get("purpose"),
            propertyType: form.get("propertyType"),
            price: form.get("price"),
            bedrooms: form.get("bedrooms"),
            bathrooms: form.get("bathrooms"),
            toilets: form.get("toilets"),
            size: form.get("size"),
            furnishingStatus: form.get("furnishingStatus"),
            availabilityStatus: form.get("availabilityStatus"),
            latitude,
            longitude,
            mapUrl,
            amenities: amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            imageUrls: imageUrls.filter(Boolean),
            parkingSpaces: form.get("parkingSpaces"),
            isPetFriendly: form.get("isPetFriendly") === "on",
            availableFrom: form.get("availableFrom"),
            serviceCharge: form.get("serviceCharge"),
            cautionFee: form.get("cautionFee"),
            agencyFee: form.get("agencyFee"),
            legalFee: form.get("legalFee"),
            commissionFee: form.get("commissionFee"),
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
        setMessage(
          data.message ||
            (mode === "agent"
              ? "Listing saved with media and map details."
              : "Submission sent for moderation."),
        );
        (event.currentTarget as HTMLFormElement).reset();
        resetRichFields();
      }}
    >
      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Listing foundation
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Property identity and market positioning
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Capture the details seekers expect to see immediately: pricing, structure, fees,
              location, and what makes the listing trustworthy.
            </p>
          </div>
          <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            Replace the sample media URLs later with your production property photos.
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="title">
              Listing title
            </label>
            <Input
              defaultValue={
                mode === "agent"
                  ? "Executive 3 bedroom apartment with lagoon-facing balcony"
                  : "Family duplex submitted for moderated publication"
              }
              id="title"
              name="title"
              placeholder="Executive 2 bedroom apartment with elevator"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
                <option value="short-let">Short let</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="price">
                Price
              </label>
              <Input defaultValue="8500000" id="price" min={0} name="price" type="number" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="description">
                Description
              </label>
              <Textarea
                defaultValue="Bright, move-in ready home in a secure estate with reliable utilities, clean documentation, and a clear fee breakdown for serious renters or buyers."
                id="description"
                name="description"
                placeholder="Highlight the location, trust signals, documentation, and amenities."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="amenities">
                Amenities
              </label>
              <Textarea
                className="min-h-full"
                id="amenities"
                name="amenities"
                onChange={(event) => setAmenities(event.target.value)}
                placeholder="Comma separated amenities"
                value={amenities}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Location and map
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-950">
          Let the lister define the property pin
        </h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="address">
                  Street address
                </label>
                <Input
                  defaultValue="14 Admiralty Way"
                  id="address"
                  name="address"
                  placeholder="14 Admiralty Way"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="neighborhood">
                  Neighborhood
                </label>
                <Input
                  defaultValue="Admiralty axis"
                  id="neighborhood"
                  name="neighborhood"
                  placeholder="Admiralty axis"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="area">
                  Area
                </label>
                <Input defaultValue="Lekki Phase 1" id="area" name="area" placeholder="Lekki Phase 1" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="city">
                  City
                </label>
                <Input defaultValue="Lagos" id="city" name="city" placeholder="Lagos" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="state">
                  State
                </label>
                <Input defaultValue="Lagos" id="state" name="state" placeholder="Lagos" />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="mapUrl">
                Google Maps link
              </label>
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  id="mapUrl"
                  name="mapUrl"
                  onBlur={() => {
                    if (!mapUrl) {
                      return;
                    }
                    const applied = applyCoordinatesFromMapLink();
                    if (!applied) {
                      setMessage("Google Maps link could not be parsed. You can still enter coordinates manually.");
                    }
                  }}
                  onChange={(event) => setMapUrl(event.target.value)}
                  placeholder="Paste a Google Maps share link to auto-fill coordinates"
                  value={mapUrl}
                />
                <Button
                  onClick={() => {
                    if (applyCoordinatesFromMapLink()) {
                      setMessage("Coordinates updated from the Google Maps link.");
                      setStatus("idle");
                    } else {
                      setStatus("error");
                      setMessage("Could not extract coordinates from that link.");
                    }
                  }}
                  type="button"
                  variant="secondary"
                >
                  Use map link
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="latitude">
                  Latitude
                </label>
                <Input
                  id="latitude"
                  name="latitude"
                  onChange={(event) => setLatitude(event.target.value)}
                  step="0.000001"
                  type="number"
                  value={latitude}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="longitude">
                  Longitude
                </label>
                <Input
                  id="longitude"
                  name="longitude"
                  onChange={(event) => setLongitude(event.target.value)}
                  step="0.000001"
                  type="number"
                  value={longitude}
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                Preview
              </p>
              <p className="mt-2 text-lg font-semibold">Map pin for this property</p>
              <p className="mt-2 text-sm text-slate-300">
                The current pin will show on the public listing page and help seekers confirm the area.
              </p>
            </div>
            {hasMapPreview ? (
              <iframe
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={buildMapEmbedUrl(parsedLatitude, parsedLongitude)}
                title="Listing location preview"
              />
            ) : (
              <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-slate-300">
                Add valid coordinates to preview the location here.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Inventory details
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-950">
          Bedrooms, availability, fees, and support documents
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="bedrooms">
              Bedrooms
            </label>
            <Input defaultValue="3" id="bedrooms" min={0} name="bedrooms" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="bathrooms">
              Bathrooms
            </label>
            <Input defaultValue="3" id="bathrooms" min={0} name="bathrooms" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="toilets">
              Toilets
            </label>
            <Input defaultValue="4" id="toilets" min={0} name="toilets" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="parkingSpaces">
              Parking spaces
            </label>
            <Input
              defaultValue="2"
              id="parkingSpaces"
              min={0}
              name="parkingSpaces"
              type="number"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="size">
              Size (sqm)
            </label>
            <Input defaultValue="240" id="size" min={1} name="size" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="furnishingStatus">
              Furnishing status
            </label>
            <Select defaultValue="semi-furnished" id="furnishingStatus" name="furnishingStatus">
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="availabilityStatus">
              Availability
            </label>
            <Select defaultValue="available-now" id="availabilityStatus" name="availabilityStatus">
              <option value="available-now">Available now</option>
              <option value="coming-soon">Coming soon</option>
              <option value="occupied">Occupied</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="availableFrom">
              Available from
            </label>
            <Input defaultValue="2026-04-01" id="availableFrom" name="availableFrom" type="date" />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="serviceCharge">
              Service charge
            </label>
            <Input defaultValue="750000" id="serviceCharge" min={0} name="serviceCharge" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="cautionFee">
              Caution fee
            </label>
            <Input defaultValue="500000" id="cautionFee" min={0} name="cautionFee" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="agencyFee">
              Agency fee
            </label>
            <Input defaultValue="850000" id="agencyFee" min={0} name="agencyFee" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="legalFee">
              Legal fee
            </label>
            <Input defaultValue="350000" id="legalFee" min={0} name="legalFee" type="number" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="commissionFee">
              Commission fee
            </label>
            <Input defaultValue="0" id="commissionFee" min={0} name="commissionFee" type="number" />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
          <input className="h-4 w-4 accent-teal-700" id="isPetFriendly" name="isPetFriendly" type="checkbox" />
          Pet friendly
        </label>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Media slots
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Replace sample images with your real property media
            </h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            These URLs are placeholders so the UI looks complete now. Swap them with Cloudinary or
            S3-backed media links later.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {imageUrls.map((url, index) => (
            <div className="rounded-[24px] border border-slate-200 p-4" key={`image-slot-${index + 1}`}>
              <p className="text-sm font-semibold text-slate-950">Image slot {index + 1}</p>
              <Input
                className="mt-3"
                onChange={(event) =>
                  setImageUrls((current) =>
                    current.map((item, currentIndex) =>
                      currentIndex === index ? event.target.value : item,
                    ),
                  )
                }
                placeholder="https://..."
                value={url}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Recommended: exterior, living area, kitchen, and bedroom or plot overview.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
              Finalize
            </p>
            <p className="mt-2 text-lg font-semibold">
              {mode === "agent"
                ? "Save a high-trust draft that can be published after review."
                : "Submit a landlord-owned listing for moderation and agent coordination."}
            </p>
          </div>
          <Button disabled={status === "loading"} size="lg" type="submit">
            {status === "loading"
              ? "Saving..."
              : mode === "agent"
                ? "Save listing draft"
                : "Submit for moderation"}
          </Button>
        </div>
        {message ? (
          <p
            className={
              status === "success" ? "text-sm text-emerald-300" : "text-sm text-rose-300"
            }
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
