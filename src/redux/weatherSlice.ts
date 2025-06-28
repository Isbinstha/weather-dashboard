import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WeatherState {
  data: unknown[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: [],
  loading: false,
  error: null,
};

// Replace `YOUR_API_KEY` with your OpenWeatherMap API key
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (cities: string[]) => {
    const apiKey = 'YOUR_API_KEY';
    const requests = cities.map(city =>
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )
    );
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
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
      });
  },
});

export default weatherSlice.reducer;
