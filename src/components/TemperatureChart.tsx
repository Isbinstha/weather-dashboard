// import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import type { ForecastData } from '../services/weatherService';

interface TemperatureChartProps {
  forecast: ForecastData | null;
  currentWeather: any;
}

const getWeatherIcon = (weatherMain: string): string => {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'thunderstorm':
      return '⛈️';
    case 'drizzle':
      return '🌦️';
    case 'mist':
    case 'fog':
      return '🌫️';
    default:
      return '🌤️';
  }
};


const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatSunTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export function TemperatureChart({ forecast, currentWeather }: TemperatureChartProps) {
  if (!forecast || !currentWeather) {
    return (
      <Card className="bg-white/70 bg-opacity-80 backdrop-blur text-gray-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Temperature Trend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-8 text-blue-600">
            Loading forecast data...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data - get 24 hours of data (12 past + 12 future)
  const now = Math.floor(Date.now() / 1000);
  const chartData = forecast.hourly
    .filter(hour => Math.abs(hour.dt - now) <= 12 * 3600) // Within 12 hours
    .slice(0, 8) // Limit to 8 data points for better visualization
    .map(hour => ({
      time: formatTime(hour.dt),
      temp: Math.round(hour.temp),
      feelsLike: Math.round(hour.feels_like),
      weatherIcon: getWeatherIcon(hour.weather[0]?.main || ''),
      weatherMain: hour.weather[0]?.main || ''
    }));

  // Get today's sun/moon data
  const today = forecast.daily[0];

  return (
    <Card className="h-[350px] bg-white border border-gray-200 rounded-xl shadow text-gray-900 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-900 -m-3">Temperature Trend</CardTitle>
      </CardHeader>
      <div className="h-40 w-80 px-5 -m-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="time"
              stroke="#1e40af"
              fontSize={10}
              tick={{ fill: '#1e40af' }}
            />
            <YAxis
              stroke="#1e40af"
              fontSize={10}
              tick={{ fill: '#1e40af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #3b82f6',
                borderRadius: '8px'
              }}
              labelStyle={{
                color: '#1e40af',
                fontWeight: 'bold',
                fontSize: 12
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 1 }}
              name="Temperature"
            />
            <Line
              type="monotone"
              dataKey="feelsLike"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={{ fill: '#f59e0b', strokeWidth: 1, r: 2 }}
              activeDot={{ r: 4, stroke: '#d97706', strokeWidth: 1 }}
              name="Feels Like"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <CardContent className="flex flex-col justify-end flex-1 px-4 py-2 gap-2">
        {/* Weather Forecast Icons */}
        <div className="flex flex-row gap-2 flex-1 min-w-0 flex-wrap justify-center mb-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{data.weatherIcon}</span>
              <span className="text-sm font-semibold">{data.temp}°</span>
            </div>
          ))}
        </div>
        {/* Sun info */}
        <div className="w-full mt-2">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Sun & Moon</h3>
          {/* Row 1: Sunrise*/}
          <div className="flex flex-row justify-between items-center mb-1 w-full gap-2">
            <div className="flex items-center gap-1 text-blue-800 text-sm font-medium">
              <span className="text-lg">🌅</span>
              <span>Sunrise: {formatSunTime(currentWeather.sys?.sunrise || today.sunrise)}</span>
            </div>
            
          </div>
          {/* Row 2: Sunset*/}
          <div className="flex flex-row justify-between items-center w-full gap-2">
            <div className="flex items-center gap-1 text-blue-800 text-sm font-medium">
              <span className="text-lg">🌇</span>
              <span>Sunset: {formatSunTime(currentWeather.sys?.sunset || today.sunset)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TemperatureChart; 