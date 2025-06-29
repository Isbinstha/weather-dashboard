# Weather Dashboard App

A modern, responsive weather dashboard built with React, TypeScript, and Vite that displays real-time weather data using the OpenWeatherMap API. Features a beautiful UI with glass morphism effects, comprehensive weather information, and a data table for multiple cities.

## 🌟 Features

- 🌤️ **Real-time Weather Data** - Live weather information from OpenWeatherMap API
- 📍 **Location-based Weather** - Automatically detects user location
- 🔍 **City Search** - Search for weather in any city worldwide
- 📊 **Weather Data Table** - Comprehensive weather data for multiple cities
- 🎨 **Modern UI** - Beautiful, responsive design with glass morphism effects
- 🔒 **Secure API Keys** - Environment variable management for production security
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 📈 **Interactive Charts** - Temperature charts using Recharts
- 🎯 **Redux State Management** - Centralized state management with Redux Toolkit
- 🧭 **Sidebar Navigation** - Collapsible sidebar with smooth animations

## 🚀 Quick Start

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Dashboard-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   cp .env.example .env
   ```

4. **Get an API key from OpenWeatherMap**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key
   - Add it to your `.env` file:
     ```
     VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 📦 Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.1.0 | React library for building user interfaces |
| `react-dom` | ^19.1.0 | React DOM rendering |
| `typescript` | ~5.8.3 | TypeScript for type safety |
| `vite` | ^7.0.0 | Build tool and development server |

### State Management & Routing

| Package | Version | Purpose |
|---------|---------|---------|
| `@reduxjs/toolkit` | ^2.8.2 | Redux Toolkit for state management |
| `react-redux` | ^9.2.0 | React bindings for Redux |
| `react-router-dom` | ^7.6.2 | Client-side routing |
| `@types/react-router-dom` | ^5.3.3 | TypeScript types for React Router |

### UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.4.17 | Utility-first CSS framework |
| `autoprefixer` | ^10.4.21 | CSS vendor prefixing |
| `postcss` | ^8.5.6 | CSS processing |
| `class-variance-authority` | ^0.7.1 | Component variant management |
| `lucide-react` | ^0.525.0 | Icon library |
| `radix-ui` | ^1.4.2 | Accessible UI primitives |

### Data Visualization & API

| Package | Version | Purpose |
|---------|---------|---------|
| `recharts` | ^3.0.2 | Chart library for React |
| `axios` | ^1.10.0 | HTTP client for API requests |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@vitejs/plugin-react-swc` | ^3.10.2 | Vite plugin for React with SWC |
| `@types/react` | ^19.1.8 | TypeScript types for React |
| `@types/react-dom` | ^19.1.6 | TypeScript types for React DOM |
| `@types/node` | ^24.0.7 | TypeScript types for Node.js |
| `eslint` | ^9.29.0 | Code linting |
| `@eslint/js` | ^9.29.0 | ESLint JavaScript rules |
| `eslint-plugin-react-hooks` | ^5.2.0 | ESLint plugin for React Hooks |
| `eslint-plugin-react-refresh` | ^0.4.20 | ESLint plugin for React Refresh |
| `typescript-eslint` | ^8.34.1 | TypeScript ESLint rules |
| `@testing-library/react` | ^16.3.0 | React testing utilities |
| `@testing-library/jest-dom` | ^6.6.3 | Jest DOM matchers |
| `jest` | ^30.0.3 | Testing framework |
| `cypress` | ^14.5.0 | End-to-end testing |

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
Dashboard-App/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (buttons, cards, etc.)
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── TemperatureChart.tsx  # Weather charts
│   │   └── WeatherTable.tsx      # Weather data table
│   ├── frontend/          # Page components
│   │   ├── Data/          # Data page
│   │   └── Home/          # Home page
│   ├── redux/             # Redux store and slices
│   │   ├── store.ts       # Redux store configuration
│   │   └── weatherSlice.ts # Weather state management
│   ├── services/          # API services
│   │   └── weatherService.ts # OpenWeatherMap API integration
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

### API Key Setup

1. **Get an API key** from [OpenWeatherMap](https://openweathermap.org/api)
2. **Add it to your `.env` file** (see above)
3. **Restart the development server** after adding the API key

The application includes fallback handling:
- **Development**: Uses a fallback key if environment variable is not set
- **Production**: Requires the environment variable to be set
- **Security**: `.env` files are automatically ignored by git

## 🎯 Usage

### Navigation

- **Home Page** (`/`): Main dashboard with current weather and forecasts
- **Data Page** (`/data`): Weather data table for multiple cities

### Features

1. **Automatic Location Detection**: The app will request your location on the home page
2. **City Search**: Use the search bar to find weather for any city
3. **Weather Data**: View temperature, humidity, pressure, wind speed, UV index, and air quality
4. **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📄 Page Features

### 🏠 Home Page (`/`)

The Home page serves as the main weather dashboard with comprehensive weather information and interactive features:

#### **Core Features:**
- **📍 Automatic Location Detection**: Automatically detects user's location on page load using browser geolocation
- **🔍 City Search**: Search bar to find weather for any city worldwide (press Enter to search)
- **🌤️ Current Weather Display**: Large, prominent display of current temperature and weather condition
- **🎨 Dynamic Weather Icons**: Weather condition icons that change based on current weather (sun, clouds, rain, snow, etc.)

#### **Weather Information:**
- **Temperature**: Current temperature in Celsius with "feels like" temperature
- **Weather Condition**: Detailed description of current weather
- **Location**: City name with location indicator
- **Real-time Updates**: Weather data updates automatically

#### **Interactive Components:**
- **📈 Temperature Chart**: Interactive chart showing temperature trends using Recharts
- **⏰ Hourly Forecast**: 7-hour forecast with weather icons and temperatures
- **⭐ Today's Highlights**: Six key weather metrics displayed in cards:
  - **UV Index**: Current UV level with risk assessment (Low/Moderate/High/Very High/Extreme)
  - **Wind Status**: Wind speed in km/h
  - **Sunrise & Sunset**: Daily sun timing information
  - **Humidity**: Current humidity percentage
  - **Visibility**: Visibility conditions in kilometers
  - **Air Quality**: Air quality index with health assessment (Good/Fair/Moderate/Poor/Very Poor)

#### **UI/UX Features:**
- **Glass Morphism Design**: Beautiful glass-like cards with backdrop blur effects
- **Ocean Gradient Background**: Dynamic weather-themed background
- **Responsive Layout**: Adapts to desktop, tablet, and mobile screens
- **Loading States**: Smooth loading animations while fetching data
- **Error Handling**: User-friendly error messages for failed API requests

### 📊 Data Page (`/data`)

The Data page provides a comprehensive weather data table for multiple cities with advanced filtering, dynamic search, and intelligent navigation:

#### **Core Features:**
- **🌍 Multi-City Weather Data**: Displays weather information for multiple cities simultaneously
- **🔍 Dynamic Global Search**: Real-time search functionality that can find weather for ANY city worldwide
- **📱 Responsive Table**: Adapts to different screen sizes with responsive columns
- **🔄 Real-time Updates**: Weather data refreshes automatically
- **🎯 Smart Search Logic**: Intelligently checks local data first before making API calls

#### **Enhanced Search Functionality:**
- **⚡ Real-time Search**: Search as you type with instant feedback
- **🌐 Global City Search**: Search for any city globally, not just pre-loaded cities
- **🔍 Local vs Global**: First checks if city exists in current table, then searches globally
- **✅ Search Status**: Clear indicators showing when displaying searched city data
- **🔄 Auto-clear**: Automatically clears search results when input is empty
- **❌ Error Handling**: Graceful error handling for cities not found

#### **Data Display:**
- **City Name**: Location identifier with enhanced search highlighting
- **Temperature**: Current temperature in Celsius
- **Weather Condition**: Description of current weather conditions
- **Humidity**: Humidity percentage
- **Wind Speed**: Wind speed in kilometers per hour
- **Feels Like**: Apparent temperature (hidden on mobile)
- **Visibility**: Visibility in kilometers (hidden on smaller screens)

#### **Navigation & Controls:**
- **📄 Smart Pagination**: Only shows when viewing multiple cities (not in search mode)
- **📊 Items Per Page**: Shows 5 cities per page for optimal viewing
- **📈 Results Counter**: Shows current page range and total results
- **🎯 Search Integration**: Seamless integration between search and pagination
- **🔄 State Management**: Maintains search state and pagination state separately

#### **Country-Specific Data:**
- **🌐 Global Coverage**: Includes major cities from all continents
- **🏛️ Regional Focus**: Can display cities from specific countries or regions
- **📋 Comprehensive Database**: Contains thousands of cities worldwide including:
  - **Asia**: China, Japan, South Korea, India, Thailand, Vietnam, etc.
  - **Europe**: UK, Germany, France, Italy, Spain, etc.
  - **Americas**: USA, Canada, Mexico, Brazil, Argentina, etc.
  - **Africa**: Egypt, South Africa, Nigeria, Kenya, etc.
  - **Oceania**: Australia, New Zealand, Fiji, etc.

#### **Technical Features:**
- **⚡ Performance Optimized**: Efficient data loading and rendering
- **🎨 Consistent Design**: Matches the overall app design language
- **📱 Mobile Responsive**: Optimized for mobile devices with collapsible sidebar
- **🔄 State Management**: Integrated with Redux for consistent data flow
- **⚙️ Enhanced Error Handling**: Graceful error handling with user-friendly messages
- **🔍 Search State Management**: Separate state management for search mode and results

#### **User Experience:**
- **🔍 Instant Search**: Real-time filtering as you type
- **📱 Touch-Friendly**: Optimized for touch devices
- **🎯 Clear Navigation**: Intuitive pagination controls
- **📊 Data Clarity**: Well-organized table with clear column headers
- **⚡ Fast Loading**: Optimized for quick data retrieval and display
- **💡 Smart Feedback**: Clear status messages for search results and errors
- **🔄 Seamless Transitions**: Smooth transitions between search and table modes

#### **Search Modes:**
- **📋 Table Mode**: Displays multiple cities with pagination
- **🔍 Search Mode**: Shows single city results with detailed information
- **🔄 Auto-Switch**: Automatically switches between modes based on user input
- **📊 Hybrid Display**: Can show both local table data and global search results

### 🔄 Data Flow

Both pages work together seamlessly:
- **Shared State**: Both pages use the same Redux store for weather data
- **Consistent API**: Both use the same OpenWeatherMap API service
- **Unified Design**: Consistent UI components and styling
- **Cross-Navigation**: Easy switching between detailed view (Home) and data overview (Data)

### 🎨 Design Philosophy

- **Glass Morphism**: Modern glass-like UI elements with backdrop blur
- **Weather-Themed**: Ocean gradients and weather-appropriate color schemes
- **Accessibility**: High contrast and readable typography
- **Responsive**: Works perfectly on all device sizes
- **Performance**: Optimized for smooth animations and fast loading

## 🚀 Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Environment Variables in Production

When deploying to production platforms:

- **Vercel**: Add environment variables in project settings
- **Netlify**: Add environment variables in site settings
- **Docker**: Use `--env-file` or environment variables
- **Server**: Set in system environment variables

### Important Security Notes

- ✅ **Never commit real API keys** to version control
- ✅ **Use different keys** for development and production
- ✅ **Set up proper environment variables** in your hosting platform
- ✅ **The `.env` file is already in `.gitignore**

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run cypress:open
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure your API key is correctly set in the `.env` file
   - Restart the development server after adding the API key
   - Check that your OpenWeatherMap account is active

2. **Location Not Detecting**
   - Ensure you allow location access in your browser
   - Check that HTTPS is enabled (required for geolocation)

3. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check that PostCSS is working correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing weather data
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for the chart components
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives

---

**Happy coding! 🌤️**