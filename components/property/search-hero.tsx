import { supportedCities } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SearchHero() {
  return (
    <form
      action="/listings"
      className="grid gap-4 rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_40px_120px_-64px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[1.4fr_1fr_0.9fr_auto]"
    >
      <Input defaultValue="" name="q" placeholder="Search by area, estate, street, or landmark" />
      <Select defaultValue="all" name="purpose">
        <option value="all">Rent or sale</option>
        <option value="rent">For rent</option>
        <option value="sale">For sale</option>
      </Select>
      <Select defaultValue="" name="location">
        <option value="">Any location</option>
        {supportedCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </Select>
      <Button className="w-full" type="submit">
        Search listings
      </Button>
    </form>
  );
}
