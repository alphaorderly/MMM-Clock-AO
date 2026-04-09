export function formatTemp(celsius: number, unit: "celsius" | "fahrenheit"): string {
  if (unit === "fahrenheit") {
    return `${Math.round((celsius * 9) / 5 + 32)}\u00B0F`;
  }
  return `${Math.round(celsius)}\u00B0C`;
}
