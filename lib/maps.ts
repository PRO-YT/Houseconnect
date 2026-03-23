export function buildMapEmbedUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}

export function buildMapSearchUrl(latitude: number, longitude: number, label?: string) {
  const query = label ? `${label} ${latitude},${longitude}` : `${latitude},${longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function extractCoordinatesFromMapLink(input: unknown) {
  if (typeof input !== "string" || !input.trim()) {
    return null;
  }

  const value = input.trim();
  const coordinatePatterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]query=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  ];

  for (const pattern of coordinatePatterns) {
    const match = value.match(pattern);
    if (!match) {
      continue;
    }

    const latitude = Number(match[1]);
    const longitude = Number(match[2]);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      return { latitude, longitude };
    }
  }

  return null;
}
