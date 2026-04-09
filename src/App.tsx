import React, { useState, useEffect, useCallback } from "react";

import { CalendarDisplay, ClockDisplay, WeatherDisplay } from "./components";
import { ensureConfig } from "./config";
import { fetchWeather, WeatherData } from "./weather/api";
import { CurrentWeather, DailyForecast } from "./weather/types";

type View = "main" | "calendar";

export default function App(): JSX.Element {
  const [now, setNow] = useState<Date>(() => new Date());
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [weatherFailed, setWeatherFailed] = useState(false);
  const [view, setView] = useState<View>("main");
  const config = ensureConfig();

  const loadWeather = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setWeatherFailed(false);
    const result = await fetchWeather(config);
    if (result) {
      setWeather(result.current);
      setDaily(result.daily);
      setWeatherFailed(false);
    } else {
      setWeatherFailed(true);
    }
    setLoading(false);
  }, [config]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    loadWeather();
    const interval = config?.weatherRefreshInterval ?? 10 * 60 * 1000;
    const id = setInterval(loadWeather, interval);
    return () => clearInterval(id);
  }, [loadWeather, config?.weatherRefreshInterval]);

  const tempUnit = config?.temperatureUnit === "fahrenheit" ? "fahrenheit" : "celsius";

  const cycleView = () => {
    setView((v) => (v === "main" ? "calendar" : "main"));
  };

  return (
    <div
      className="text-center font-sans text-white px-4 pt-0 pb-2 cursor-pointer select-none"
      onTouchStart={cycleView}
    >
      {view === "main" ? (
        <>
          <ClockDisplay now={now} />
          <div className="w-12 mx-auto my-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <WeatherDisplay
            weather={weather}
            daily={daily}
            unit={tempUnit}
            loading={loading}
            failed={weatherFailed}
            onRetry={loadWeather}
          />
        </>
      ) : (
        <CalendarDisplay now={now} />
      )}
    </div>
  );
}
