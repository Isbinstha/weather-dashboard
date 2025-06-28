import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { SidebarTrigger } from "../../components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Search, ChevronLeft, ChevronRight, Cloud } from "lucide-react"
// import { mockWeatherData } from "../data/mock-weather"

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

const ITEMS_PER_PAGE = 5

export function data() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = useMemo(() => {
    return mockWeatherData.filter((weather) => weather.city.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen weather-gradient-blue weather-bg">
      <header className="flex items-center gap-2 px-4 py-3 md:px-6">
        <SidebarTrigger className="md:hidden text-blue-700" />
        <h1 className="text-xl font-semibold text-blue-900">Weather Data</h1>
      </header>

      <div className="px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="glass text-blue-900 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                Weather Data Table
              </CardTitle>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-4 w-4" />
                <Input
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 glass text-blue-900 placeholder:text-blue-600 border-blue-300 focus:border-blue-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200 hover:bg-blue-50">
                      <TableHead className="text-blue-800 font-semibold">City</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Temperature</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Condition</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Humidity</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Wind Speed</TableHead>
                      <TableHead className="hidden md:table-cell text-blue-800 font-semibold">Feels Like</TableHead>
                      <TableHead className="hidden lg:table-cell text-blue-800 font-semibold">Visibility</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((weather) => (
                      <TableRow key={weather.id} className="border-blue-100 hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-900">{weather.city}</TableCell>
                        <TableCell className="text-blue-800">{weather.temperature}°C</TableCell>
                        <TableCell className="capitalize text-blue-700">{weather.condition}</TableCell>
                        <TableCell className="text-blue-700">{weather.humidity}%</TableCell>
                        <TableCell className="text-blue-700">{weather.windSpeed} km/h</TableCell>
                        <TableCell className="hidden md:table-cell text-blue-700">{weather.feelsLike}°C</TableCell>
                        <TableCell className="hidden lg:table-cell text-blue-700">{weather.visibility} km</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-blue-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of{" "}
                  {filteredData.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          currentPage === page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "text-blue-700 border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default data;