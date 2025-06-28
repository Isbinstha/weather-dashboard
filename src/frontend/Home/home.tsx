import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"

// --- WeatherData type and mockWeatherData ---
export type WeatherData = {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  feelsLike: number;
  visibility: number;
  lastUpdated: string;
};

export const mockWeatherData: WeatherData[] = [
  { id: "1", city: "New York", temperature: 22, condition: "partly cloudy", humidity: 65, windSpeed: 12, windDirection: "NW", feelsLike: 24, visibility: 10, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "2", city: "London", temperature: 15, condition: "overcast", humidity: 78, windSpeed: 8, windDirection: "SW", feelsLike: 13, visibility: 8, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "3", city: "Tokyo", temperature: 18, condition: "sunny", humidity: 55, windSpeed: 6, windDirection: "E", feelsLike: 19, visibility: 15, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "4", city: "Sydney", temperature: 28, condition: "clear", humidity: 45, windSpeed: 15, windDirection: "SE", feelsLike: 30, visibility: 20, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "5", city: "Paris", temperature: 12, condition: "rainy", humidity: 85, windSpeed: 10, windDirection: "W", feelsLike: 9, visibility: 5, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "6", city: "Berlin", temperature: 8, condition: "foggy", humidity: 90, windSpeed: 5, windDirection: "N", feelsLike: 6, visibility: 2, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "7", city: "Mumbai", temperature: 32, condition: "humid", humidity: 75, windSpeed: 8, windDirection: "SW", feelsLike: 38, visibility: 12, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "8", city: "Toronto", temperature: 5, condition: "snowy", humidity: 70, windSpeed: 20, windDirection: "NW", feelsLike: -2, visibility: 3, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "9", city: "Dubai", temperature: 35, condition: "hot", humidity: 40, windSpeed: 12, windDirection: "NE", feelsLike: 42, visibility: 18, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "10", city: "Singapore", temperature: 30, condition: "tropical", humidity: 80, windSpeed: 7, windDirection: "SE", feelsLike: 35, visibility: 14, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "11", city: "Los Angeles", temperature: 25, condition: "sunny", humidity: 50, windSpeed: 9, windDirection: "W", feelsLike: 26, visibility: 16, lastUpdated: "2024-01-15T10:30:00Z" },
  { id: "12", city: "Chicago", temperature: 3, condition: "windy", humidity: 60, windSpeed: 25, windDirection: "NW", feelsLike: -5, visibility: 8, lastUpdated: "2024-01-15T10:30:00Z" },
];

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
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setCurrentWeather(mockWeatherData[0])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center ocean-gradient">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!currentWeather) return null

  const hourlyData = mockWeatherData.slice(0, 7)
  const todayHighlights = [
    { title: "UV Index", value: "3", subtitle: "Moderate", icon: Sun },
    { title: "Wind Status", value: `${currentWeather.windSpeed}`, subtitle: "km/h", icon: Wind },
    { title: "Sunrise & Sunset", value: "05:18 AM", subtitle: "6:30 PM", icon: Sunrise },
    { title: "Humidity", value: `${currentWeather.humidity}%`, subtitle: "High", icon: Droplets },
    { title: "Visibility", value: `${currentWeather.visibility}`, subtitle: "Very Light Mist", icon: Eye },
    { title: "Air Quality", value: "0", subtitle: "Good", icon: Cloud },
  ]

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
            className="pl-12 h-12 text-lg glass text-blue-900 placeholder:text-blue-600 border-blue-200 focus:border-blue-400 shadow-md"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Main Weather Card & Forecast */}
        <div className="flex flex-col gap-6">
          {/* Main Weather Card */}
          <Card className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-xl p-0">
            <CardContent className="p-8 flex flex-col items-center text-center gap-6">
              {/* Weather Icon */}
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center relative shadow-lg">
                <Cloud className="w-20 h-20 text-white" />
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-orange-400 rounded-full"></div>
              </div>
              {/* Location */}
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800 font-medium text-lg">{currentWeather.city}, India</span>
              </div>
              {/* Temperature */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-7xl font-light text-blue-900 flex items-start">
                  {currentWeather.temperature}
                  <span className="text-3xl font-normal mt-2">.9</span>
                  <span className="text-2xl font-normal mt-2 ml-1">°C</span>
                </div>
                <div className="text-blue-600 text-lg">Friday, 11:50 PM</div>
              </div>
            </CardContent>
          </Card>

          {/* Next Day Forecast */}
          <Card className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">The Next Day Forecast</CardTitle>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm shadow-sm">2 Days</button>
                <button className="px-4 py-1 text-blue-600 text-sm hover:bg-blue-100 rounded-full">10 Days</button>
                <button className="px-4 py-1 text-blue-600 text-sm hover:bg-blue-100 rounded-full">30 Days</button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockWeatherData.slice(1, 3).map((weather) => (
                <div key={weather.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-900">Saturday, May 13</div>
                      <div className="text-sm text-blue-600 capitalize">{weather.condition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-900">{weather.temperature}°C</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Weather Title, Hourly, Highlights */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Weather Condition Title */}
          <div className="text-center lg:text-left mb-2">
            <h1 className="text-5xl md:text-7xl font-light text-blue-900 mb-4">Heavy Rain</h1>
          </div>

          {/* Hourly Forecast */}
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-4">
            {hourlyData.map((weather, index) => {
              const hours = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"]
              return (
                <Card key={weather.id} className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-sm">
                  <CardContent className="p-4 text-center flex flex-col items-center gap-2">
                    <div className="text-xs text-blue-600 mb-1">{hours[index]}</div>
                    <Cloud className="w-7 h-7 mx-auto mb-1 text-blue-500" />
                    <div className="text-base font-medium text-blue-900">{weather.temperature}°C</div>
                  </CardContent>
                </Card>
              )
            })}
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
export default Home;