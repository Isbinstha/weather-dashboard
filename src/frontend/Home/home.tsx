import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchWeatherByCity, fetchWeatherByCoordinates, fetchForecastByCoordinates, fetchForecastByCity } from '../../redux/weatherSlice'
import { Card,CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import TemperatureChart from "../../components/TemperatureChart"

// --- WeatherData type ---
export type WeatherData = {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  windDirection: string;
  feelsLike: number;
  visibility: number;
  lastUpdated: string;
  airquality:number;
};

// --- Weather icons (simple SVGs or emoji for now) ---
const Cloud = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 19a4.5 4.5 0 0 0 0-9c-.2 0-.4 0-.6.03A7 7 0 1 0 5 17.5" /></svg>
);
const Droplets = () => <span>💧</span>;
const Wind = () => <span>💨</span>;
const Eye = () => <span>👁️</span>;
const Sun = () => <span>☀️</span>;
const Sunrise = () => <span>🌅</span>;
const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

export function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: weatherData, forecast, loading, error } = useSelector((state: RootState) => state.weather);
  const [searchTerm, setSearchTerm] = useState("")
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)

  // Get user's location and fetch weather on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchWeatherByCoordinates({ lat: latitude, lon: longitude }));
          dispatch(fetchForecastByCoordinates({ lat: latitude, lon: longitude }));
        },
        (_error) => {
          console.log('Location access denied, using default city');
          // Fallback to a default city if location access is denied
          dispatch(fetchWeatherByCity('London'));
          dispatch(fetchForecastByCity('London'));
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      dispatch(fetchWeatherByCity('London'));
      dispatch(fetchForecastByCity('London'));
    }
  }, [dispatch]);

  // Update current weather when API data is available
  useEffect(() => {
    if (weatherData.length > 0 && weatherData[0]) {
      const apiWeather = weatherData[0];
      setCurrentWeather({
        id: "1",
        city: apiWeather.name,
        temperature: Math.round(apiWeather.main.temp),
        condition: apiWeather.weather[0]?.description || "unknown",
        humidity: apiWeather.main.humidity,
        uvIndex: apiWeather.uvIndex || 0,
        windSpeed: Math.round(apiWeather.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: "N", // API doesn't provide direction, using default
        feelsLike: Math.round(apiWeather.main.feels_like),
        visibility: 10, // API doesn't provide visibility in basic plan
        lastUpdated: new Date().toISOString(),
        airquality: apiWeather.airquality || 1,
      });
    }
  }, [weatherData]);

  // Handle search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      dispatch(fetchWeatherByCity(searchTerm.trim()));
      dispatch(fetchForecastByCity(searchTerm.trim()));
    }
  };

  if (loading && !currentWeather) {
    return (
      <div className="flex h-screen items-center justify-center ocean-gradient">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!currentWeather) return null

  const getUvIndexLevel = (uvIndex: number): string => {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
  };

  const getAirQualityLevel = (aqi: number): string => {
    if (aqi === 1) return "Good";
    if (aqi === 2) return "Fair";
    if (aqi === 3) return "Moderate";
    if (aqi === 4) return "Poor";
    return "Very Poor";
  };

  const todayHighlights = [
    { title: "UV Index", value: `${currentWeather.uvIndex}`, subtitle: getUvIndexLevel(currentWeather.uvIndex), icon: Sun },
    { title: "Wind Status", value: `${currentWeather.windSpeed}`, subtitle: "km/h", icon: Wind },
    { title: "Sunrise & Sunset", value: "05:18 AM", subtitle: "6:30 PM", icon: Sunrise },
    { title: "Humidity", value: `${currentWeather.humidity}%`, subtitle: "High", icon: Droplets },
    { title: "Visibility", value: `${currentWeather.visibility}`, subtitle: "Very Light Mist", icon: Eye },
    { title: "Air Quality", value: `${currentWeather.airquality}`, subtitle: getAirQualityLevel(currentWeather.airquality), icon: Cloud },
  ]

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'snow': return '❄️';
      case 'thunderstorm': return '⛈️';
      case 'drizzle': return '🌦️';
      case 'mist':
      case 'fog': return '🌫️';
      default: return '🌤️';
    }
  };

  return (
    <div className="min-h-screen ocean-gradient weather-bg flex flex-col items-center px-2 py-6">
      {/* Search Bar */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
          <Input
            placeholder="Search City"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
            className="pl-12 h-12 text-lg glass text-blue-900 placeholder:text-blue-600 border-blue-200 focus:border-blue-400 shadow-md"
          />
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Main Weather Card & Temperature Chart */}
        <div className="flex flex-col gap-6 h-[100px]">
          {/* Main Weather Card */}
          <Card className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-xl p-0 flex">
            <CardContent className="flex flex-col items-center text-center gap-4 w-full h-full justify-between p-8">
              {/* Weather Icon */}
              <div className="m-2 w-20 h-20 bg-gradient-to-br  to-yellow-300 rounded-full flex items-center justify-center relative shadow-lg">
                <span className="text-6xl">
                  {getWeatherIcon(weatherData[0]?.weather[0]?.main || '')}
                </span>
              </div>
              {/* Location */}
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800 font-medium text-base">{currentWeather.city}</span>
              </div>
              {/* Temperature */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-5xl font-light text-blue-900 flex items-start">
                  {currentWeather.temperature}
                  <span className="text-xl font-normal mt-2 ml-1">°C</span>
                </div>
                <div className="text-blue-600 text-base">Feels like {currentWeather.feelsLike}°C</div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Chart Component */}
          <TemperatureChart forecast={forecast} currentWeather={weatherData[0]} />
        </div>

        {/* Right Panel - Weather Title, Hourly, Highlights */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Weather Condition Title */}
          <div className="text-center lg:text-left mb-2">
            <h1 className="text-5xl md:text-7xl font-light text-blue-900 mb-4 capitalize">{currentWeather.condition}</h1>
          </div>

          {/* Hourly Forecast */}
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-4">
            {forecast?.hourly?.slice(0, 7).map((hour, index) => (
              <Card key={index} className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-sm">
                <CardContent className="p-4 text-center flex flex-col items-center gap-2">
                  <div className="text-xs text-blue-600 mb-1">{formatTime(hour.dt)}</div>
                  <span className="text-2xl">{getWeatherIcon(hour.weather[0]?.main || '')}</span>
                  <div className="text-base font-medium text-blue-900">{Math.round(hour.temp)}°C</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Today's Highlights */}
          <div>
            <h2 className="text-2xl font-light text-blue-900 mb-4">Today's Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <Card key={index} className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-sm">
                    <CardContent className="p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-blue-600 font-medium">{highlight.title}</span>
                        <Icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-light mb-1 text-blue-900">{highlight.value}</div>
                      <div className="text-xs text-blue-600">{highlight.subtitle}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export default Home;