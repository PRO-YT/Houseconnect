export function buildMapEmbedUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}
