import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { HiOutlineMapPin, HiOutlineInformationCircle } from 'react-icons/hi';
import { fetchWeather } from '../api/weatherApi';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Weather marker icon
const weatherIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

// Map click handler component
const MapClickHandler = ({ onCityClick }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      // Reverse geocoding would be needed here to get city name from coordinates
      // For now, we'll use a simple approach
      onCityClick({ lat, lng });
    };
    
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, onCityClick]);
  
  return null;
};

const WeatherMap = ({ onWeatherSelect }) => {
  const [weatherMarkers, setWeatherMarkers] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample major cities with coordinates
  const majorCities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Moscow', lat: 55.7558, lng: 37.6176 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 }
  ];

  const handleCityClick = async (city) => {
    setLoading(true);
    try {
      const weatherData = await fetchWeather(city.name);
      const marker = {
        id: Date.now(),
        position: [city.lat, city.lng],
        city: city.name,
        weather: weatherData
      };
      
      setWeatherMarkers(prev => [...prev, marker]);
      toast.success(`Weather fetched for ${city.name}`);
    } catch (error) {
      toast.error(`Failed to fetch weather for ${city.name}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (coords) => {
    // In a real app, you'd use reverse geocoding here
    // For demo purposes, we'll use a nearby major city
    const nearestCity = majorCities.reduce((nearest, city) => {
      const distance = Math.sqrt(
        Math.pow(city.lat - coords.lat, 2) + Math.pow(city.lng - coords.lng, 2)
      );
      return distance < nearest.distance ? { ...city, distance } : nearest;
    }, { distance: Infinity });

    if (nearestCity.name) {
      await handleCityClick(nearestCity);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('sun') || desc.includes('clear')) return '☀️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🗺️ Interactive Weather Map
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            Click on a city marker or anywhere on the map to view weather information
          </p>
          
          {/* Quick City Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {majorCities.slice(0, 6).map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityClick(city)}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="rounded-2xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapClickHandler onCityClick={handleMapClick} />
            
            {/* Weather Markers */}
            {weatherMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={weatherIcon}
              >
                <Popup className="weather-popup">
                  <div className="text-center p-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {marker.city}
                    </h3>
                    <div className="text-3xl mb-2">
                      {getWeatherIcon(marker.weather.description)}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {Math.round(marker.weather.temperature)}°C
                    </div>
                    <div className="text-gray-600 text-sm capitalize mb-3">
                      {marker.weather.description}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Humidity:</span>
                        <br />
                        <span className="font-semibold">{marker.weather.humidity}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Wind:</span>
                        <br />
                        <span className="font-semibold">{marker.weather.windSpeed} km/h</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedWeather(marker.weather);
                        if (onWeatherSelect) onWeatherSelect(marker.weather);
                      }}
                      className="mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Weather Details */}
        {selectedWeather && (
          <div className="mt-6 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              <HiOutlineInformationCircle className="inline mr-2" />
              Selected Weather Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {getWeatherIcon(selectedWeather.description)}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(selectedWeather.temperature)}°C
                </div>
                <div className="text-gray-600 capitalize">
                  {selectedWeather.description}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-semibold">{selectedWeather.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind Speed:</span>
                  <span className="font-semibold">{selectedWeather.windSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pressure:</span>
                  <span className="font-semibold">{selectedWeather.pressure} hPa</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility:</span>
                  <span className="font-semibold">{selectedWeather.visibility} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{selectedWeather.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-semibold">{selectedWeather.city}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap; 