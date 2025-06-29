import axios from 'axios';

// Get API key from environment variable with fallback for development
const getApiKey = (): string => {
  const envApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (envApiKey && envApiKey !== 'YOUR_API_KEY') {
    return envApiKey;
  }
  
  // Fallback for development (you can remove this in production)
  if (import.meta.env.DEV) {
    console.warn('Using fallback API key for development. Set VITE_OPENWEATHER_API_KEY in .env for production.');
    return '4b62c54ef1902fc18494c964ea0ee03f';
  }
  
  throw new Error('VITE_OPENWEATHER_API_KEY is not set in environment variables');
};

const API_KEY = getApiKey();
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  uvIndex?: number;
  airquality?: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    sunrise: number;
    sunset: number;
  }>;
}

export interface WeatherError {
  message: string;
  cod?: string;
}

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      
      // Get UV Index for the city coordinates
      const uvResponse = await axios.get(`${BASE_URL}/uvi`, {
        params: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
          appid: this.apiKey
        }
      });
      
      // Get Air Quality for the city coordinates
      const airQualityResponse = await axios.get(`${BASE_URL}/air_pollution`, {
        params: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
          appid: this.apiKey
        }
      });
      
      return {
        ...response.data,
        uvIndex: Math.round(uvResponse.data.value),
        airquality: airQualityResponse.data.list[0].main.aqi
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }

  async getWeatherByCities(cities: string[]): Promise<WeatherData[]> {
    try {
      const requests = cities.map(city => this.getWeatherByCity(city));
      return await Promise.all(requests);
    } catch (error: any) {
      throw new Error('Failed to fetch weather data for multiple cities');
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      
      // Get UV Index for the coordinates
      const uvResponse = await axios.get(`${BASE_URL}/uvi`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });
      
      // Get Air Quality for the coordinates
      const airQualityResponse = await axios.get(`${BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });
      
      return {
        ...response.data,
        uvIndex: Math.round(uvResponse.data.value),
        airquality: airQualityResponse.data.list[0].main.aqi
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }

  async getForecastByCoordinates(lat: number, lon: number): Promise<ForecastData> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      
      // Transform the free API response to match our interface
      const hourly = response.data.list.map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        weather: item.weather
      }));

      // For daily data, we'll group by day and calculate averages
      const dailyData = response.data.list.reduce((acc: any, item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!acc[date]) {
          acc[date] = {
            dt: item.dt,
            temp: { min: item.main.temp, max: item.main.temp },
            weather: item.weather,
            sunrise: response.data.city.sunrise,
            sunset: response.data.city.sunset
          };
        } else {
          acc[date].temp.min = Math.min(acc[date].temp.min, item.main.temp);
          acc[date].temp.max = Math.max(acc[date].temp.max, item.main.temp);
        }
        return acc;
      }, {});

      const daily = Object.values(dailyData) as Array<{
        dt: number;
        temp: { min: number; max: number };
        weather: Array<{ main: string; description: string; icon: string }>;
        sunrise: number;
        sunset: number;
      }>;

      return {
        hourly,
        daily
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
    }
  }

  async getForecastByCity(city: string): Promise<ForecastData> {
    try {
      // First get coordinates for the city
      const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      
      const { lat, lon } = weatherResponse.data.coord;
      return await this.getForecastByCoordinates(lat, lon);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
    }
  }
}

export const weatherService = new WeatherService();
export default weatherService; 