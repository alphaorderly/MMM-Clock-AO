import {
  Sun,
  SunDim,
  Moon,
  MoonStar,
  CloudSun,
  CloudMoon,
  CloudSunRain,
  CloudMoonRain,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  Snowflake,
  CloudLightning,
  Wind,
  Loader,
  type LucideIcon,
} from "lucide-react";
import React from "react";

import { formatTemp } from "../weather/format";
import { CurrentWeather, DailyForecast } from "../weather/types";
import { getWMOInfo } from "../weather/wmoConditions";

const ICON_MAP: Record<string, LucideIcon> = {
  Sun,
  SunDim,
  Moon,
  MoonStar,
  CloudSun,
  CloudMoon,
  CloudSunRain,
  CloudMoonRain,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  Snowflake,
  CloudLightning,
};

function WeatherIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] ?? Cloud;
  return <Icon size={size} strokeWidth={1.25} />;
}

function formatForecastDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function WeatherDisplay({
  weather,
  daily,
  unit,
  loading,
  failed,
  onRetry,
}: {
  weather: CurrentWeather | null;
  daily: DailyForecast[];
  unit: "celsius" | "fahrenheit";
  loading: boolean;
  failed?: boolean;
  onRetry?: () => void;
}) {
  if (loading && !weather) {
    return (
      <div className="flex flex-col items-center gap-1 py-3">
        <Loader size={14} strokeWidth={1.5} className="opacity-40" />
      </div>
    );
  }

  if (failed && !weather) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onRetry?.();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          onRetry?.();
        }}
      >
        <span className="text-[12px] font-light opacity-50 tracking-wide">
          날씨를 불러오지 못했습니다
        </span>
        <span className="text-[11px] font-light opacity-35 tracking-widest">
          터치하여 다시 시도
        </span>
      </div>
    );
  }

  if (!weather) return null;

  const { labelKo, iconName } = getWMOInfo(weather.weatherCode, weather.isDay);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Current: icon + temp + condition */}
      <div className="flex items-center gap-3">
        <WeatherIcon name={iconName} size={24} />
        <span className="text-[26px] font-light tabular-nums leading-none">
          {formatTemp(weather.temperature, unit)}
        </span>
        <span className="text-[13px] font-light opacity-60 tracking-wide">{labelKo}</span>
      </div>

      {/* Secondary stats row */}
      <div className="flex items-center gap-3 text-[11px] font-light opacity-50 tracking-wide flex-wrap justify-center">
        <span>체감&nbsp;{formatTemp(weather.apparentTemperature, unit)}</span>
        <span className="opacity-30">·</span>
        <span>습도&nbsp;{weather.humidity}%</span>
        <span className="opacity-30">·</span>
        <span>강수&nbsp;{weather.precipitationProbability}%</span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1">
          <Wind size={11} strokeWidth={1.5} className="opacity-70" />
          {Math.round(weather.windSpeed)}km/h
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-0.5" />

      {/* 3-day forecast */}
      {daily.length > 0 && (
        <div className="flex justify-around w-full">
          {daily.slice(0, 3).map((d) => {
            const { iconName: dIconName } = getWMOInfo(d.weatherCode, true);
            return (
              <div key={d.date} className="flex flex-col items-center gap-0.5">
                <span className="text-[12px] font-light opacity-80 tracking-wide">
                  {formatForecastDate(d.date)}
                </span>
                <WeatherIcon name={dIconName} size={18} />
                <div className="flex items-center gap-1 text-[11px] tabular-nums font-light">
                  <span>{Math.round(d.maxTemp)}°</span>
                  <span className="opacity-30">/</span>
                  <span className="opacity-50">{Math.round(d.minTemp)}°</span>
                </div>
                {d.precipitationProbability > 0 && (
                  <span className="text-[9px] opacity-40 tracking-wide">
                    {d.precipitationProbability}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
