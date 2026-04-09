export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationProbability: number;
}
