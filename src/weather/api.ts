import ky from "ky";

import { ModuleConfig } from "../config";

import { CurrentWeather, DailyForecast } from "./types";

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

export async function fetchWeather(config: ModuleConfig): Promise<WeatherData | null> {
  const lat = config.latitude ?? 40.7128;
  const lon = config.longitude ?? -74.006;
  const tz = config.timezone ?? "auto";
  const currentFields =
    "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day,precipitation_probability";
  const dailyFields =
    "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${currentFields}&daily=${dailyFields}&forecast_days=4&timezone=${tz}`;
  try {
    const data = await ky
      .get(url, {
        retry: { limit: 3, delay: (attemptCount) => 1000 * attemptCount },
        timeout: 10_000,
      })
      .json<Record<string, unknown>>();
    const c = (data.current as Record<string, unknown>) ?? null;
    if (!c) return null;
    const current: CurrentWeather = {
      temperature: c.temperature_2m as number,
      apparentTemperature: c.apparent_temperature as number,
      humidity: c.relative_humidity_2m as number,
      precipitationProbability: (c.precipitation_probability as number) ?? 0,
      weatherCode: c.weather_code as number,
      windSpeed: c.wind_speed_10m as number,
      isDay: c.is_day === 1,
    };
    const d = data.daily as Record<string, unknown[]> | null;
    const daily: DailyForecast[] = d
      ? (d.time as string[]).slice(1, 4).map((date: string, i: number) => ({
          date,
          maxTemp: d.temperature_2m_max[i + 1] as number,
          minTemp: d.temperature_2m_min[i + 1] as number,
          weatherCode: d.weather_code[i + 1] as number,
          precipitationProbability:
            (d.precipitation_probability_max[i + 1] as number) ?? 0,
        }))
      : [];
    return { current, daily };
  } catch {
    return null;
  }
}
