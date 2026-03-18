export const siteConfig = {
  name: "HouseConnect",
  shortName: "HouseConnect",
  description:
    "A premium real estate marketplace for trusted agents, serious seekers, and compliant landlords across Nigeria and fast-growing African cities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supportEmail: "support@houseconnect.africa",
  phone: "+234 700 000 0000",
  whatsapp: "+2348012345678",
  primaryAccent: "#0f766e",
};

export const mainNav = [
  { href: "/listings", label: "Listings" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-agents", label: "For agents" },
  { href: "/for-landlords", label: "For landlords" },
  { href: "/pricing", label: "Pricing" },
  { href: "/safety", label: "Safety" },
];

export const footerColumns = [
  {
    title: "Marketplace",
    links: [
      { href: "/listings", label: "Browse listings" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/for-agents", label: "For agents" },
      { href: "/for-landlords", label: "For landlords" },
      { href: "/safety", label: "Trust & safety" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/safety", label: "Safety tips" },
    ],
  },
];

export const supportedCities = [
  "Lekki",
  "Ikoyi",
  "Yaba",
  "Victoria Island",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Enugu",
];

export const listingCategories = [
  "For rent",
  "For sale",
  "Apartment",
  "Duplex",
  "Land",
  "Commercial",
  "Short let",
];
