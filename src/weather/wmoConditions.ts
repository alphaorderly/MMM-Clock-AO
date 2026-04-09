export const WMO_CONDITIONS: Record<
  number,
  { label: string; labelKo: string; dayIcon: string; nightIcon: string }
> = {
  0: { label: "Clear sky", labelKo: "맑음", dayIcon: "Sun", nightIcon: "MoonStar" },
  1: {
    label: "Mainly clear",
    labelKo: "대체로 맑음",
    dayIcon: "SunDim",
    nightIcon: "Moon",
  },
  2: {
    label: "Partly cloudy",
    labelKo: "구름 조금",
    dayIcon: "CloudSun",
    nightIcon: "CloudMoon",
  },
  3: { label: "Overcast", labelKo: "흐림", dayIcon: "Cloudy", nightIcon: "Cloudy" },
  45: { label: "Fog", labelKo: "안개", dayIcon: "CloudFog", nightIcon: "CloudFog" },
  48: {
    label: "Rime fog",
    labelKo: "짙은 안개",
    dayIcon: "CloudFog",
    nightIcon: "CloudFog",
  },
  51: {
    label: "Light drizzle",
    labelKo: "약한 이슬비",
    dayIcon: "CloudDrizzle",
    nightIcon: "CloudDrizzle",
  },
  53: {
    label: "Moderate drizzle",
    labelKo: "보통 이슬비",
    dayIcon: "CloudDrizzle",
    nightIcon: "CloudDrizzle",
  },
  55: {
    label: "Dense drizzle",
    labelKo: "강한 이슬비",
    dayIcon: "CloudDrizzle",
    nightIcon: "CloudDrizzle",
  },
  56: {
    label: "Freezing drizzle",
    labelKo: "어는 이슬비",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  57: {
    label: "Dense freezing drizzle",
    labelKo: "강한 어는 이슬비",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  61: {
    label: "Slight rain",
    labelKo: "약한 비",
    dayIcon: "CloudRain",
    nightIcon: "CloudRain",
  },
  63: {
    label: "Moderate rain",
    labelKo: "보통 비",
    dayIcon: "CloudRain",
    nightIcon: "CloudRain",
  },
  65: {
    label: "Heavy rain",
    labelKo: "강한 비",
    dayIcon: "CloudRainWind",
    nightIcon: "CloudRainWind",
  },
  66: {
    label: "Freezing rain",
    labelKo: "어는 비",
    dayIcon: "CloudHail",
    nightIcon: "CloudHail",
  },
  67: {
    label: "Heavy freezing rain",
    labelKo: "강한 어는 비",
    dayIcon: "CloudHail",
    nightIcon: "CloudHail",
  },
  71: {
    label: "Slight snowfall",
    labelKo: "약한 눈",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  73: {
    label: "Moderate snowfall",
    labelKo: "보통 눈",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  75: {
    label: "Heavy snowfall",
    labelKo: "강한 눈",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  77: {
    label: "Snow grains",
    labelKo: "싸락눈",
    dayIcon: "Snowflake",
    nightIcon: "Snowflake",
  },
  80: {
    label: "Slight rain showers",
    labelKo: "약한 소나기",
    dayIcon: "CloudSunRain",
    nightIcon: "CloudMoonRain",
  },
  81: {
    label: "Moderate rain showers",
    labelKo: "보통 소나기",
    dayIcon: "CloudRain",
    nightIcon: "CloudRain",
  },
  82: {
    label: "Violent rain showers",
    labelKo: "강한 소나기",
    dayIcon: "CloudRainWind",
    nightIcon: "CloudRainWind",
  },
  85: {
    label: "Slight snow showers",
    labelKo: "약한 눈 소나기",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  86: {
    label: "Heavy snow showers",
    labelKo: "강한 눈 소나기",
    dayIcon: "CloudSnow",
    nightIcon: "CloudSnow",
  },
  95: {
    label: "Thunderstorm",
    labelKo: "뇌우",
    dayIcon: "CloudLightning",
    nightIcon: "CloudLightning",
  },
  96: {
    label: "Thunderstorm with hail",
    labelKo: "우박 동반 뇌우",
    dayIcon: "CloudHail",
    nightIcon: "CloudHail",
  },
  99: {
    label: "Thunderstorm with heavy hail",
    labelKo: "강한 우박 동반 뇌우",
    dayIcon: "CloudHail",
    nightIcon: "CloudHail",
  },
};

export function getWMOInfo(code: number, isDay: boolean) {
  const info = WMO_CONDITIONS[code];
  if (info)
    return {
      label: info.label,
      labelKo: info.labelKo,
      iconName: isDay ? info.dayIcon : info.nightIcon,
    };
  return { label: "Unknown", labelKo: "알 수 없음", iconName: "Cloud" };
}
