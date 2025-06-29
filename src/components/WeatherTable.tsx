import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchWeather } from '../redux/weatherSlice';

interface WeatherCity {
  id: number;
  name: string;
  main: { temp: number; humidity: number };
  weather: { main: string }[];
}

const defaultCities = ['Kathmandu', 'London', 'Tokyo', 'New York', 'Delhi', 'Berlin', 'Paris', 'Sydney'];

const WeatherTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather);
  const data: WeatherCity[] = weatherState.data.map((city, idx) => ({
    id: idx,
    name: city.name,
    main: { temp: city.main.temp, humidity: city.main.humidity },
    weather: city.weather,
  }));
  const { loading, error } = weatherState;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchWeather(defaultCities));
  }, [dispatch]);

  const filteredData = data.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weather Data</h2>
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="border border-gray-300 rounded px-3 py-1"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="w-full border text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">City</th>
                <th className="p-2 border">Temperature (°C)</th>
                <th className="p-2 border">Weather</th>
                <th className="p-2 border">Humidity (%)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(city => (
                <tr key={city.id}>
                  <td className="p-2 border">{city.name}</td>
                  <td className="p-2 border">{city.main.temp}</td>
                  <td className="p-2 border">{city.weather[0].main}</td>
                  <td className="p-2 border">{city.main.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-2 py-1">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherTable;
