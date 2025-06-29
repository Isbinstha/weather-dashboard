import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherService } from '../services/weatherService';
import type { WeatherData, ForecastData } from '../services/weatherService';

interface WeatherState {
  data: WeatherData[];
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  selectedCountry: string | null;
}

const initialState: WeatherState = {
  data: [],
  forecast: null,
  loading: false,
  error: null,
  selectedCountry: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (cities: string[]) => {
    return await weatherService.getWeatherByCities(cities);
  }
);

export const fetchWeatherByCity = createAsyncThunk(
  'weather/fetchWeatherByCity',
  async (city: string) => {
    return await weatherService.getWeatherByCity(city);
  }
);

export const fetchWeatherByCoordinates = createAsyncThunk(
  'weather/fetchWeatherByCoordinates',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    return await weatherService.getWeatherByCoordinates(lat, lon);
  }
);

export const fetchForecastByCoordinates = createAsyncThunk(
  'weather/fetchForecastByCoordinates',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    return await weatherService.getForecastByCoordinates(lat, lon);
  }
);

export const fetchForecastByCity = createAsyncThunk(
  'weather/fetchForecastByCity',
  async (city: string) => {
    return await weatherService.getForecastByCity(city);
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherData: (state) => {
      state.data = [];
      state.forecast = null;
      state.error = null;
      state.selectedCountry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      // Handle fetchWeather (multiple cities)
      .addCase(fetchWeather.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      // Handle fetchWeatherByCity (single city)
      .addCase(fetchWeatherByCity.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
        state.selectedCountry = action.payload.sys.country;
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      // Handle fetchWeatherByCoordinates
      .addCase(fetchWeatherByCoordinates.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoordinates.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
        state.selectedCountry = action.payload.sys.country;
      })
      .addCase(fetchWeatherByCoordinates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      // Handle fetchForecastByCoordinates
      .addCase(fetchForecastByCoordinates.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastByCoordinates.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecastByCoordinates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch forecast data';
      })
      // Handle fetchForecastByCity
      .addCase(fetchForecastByCity.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecastByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch forecast data';
      });
  },
});

export const { clearWeatherData, clearError, setSelectedCountry } = weatherSlice.actions;
export default weatherSlice.reducer;
