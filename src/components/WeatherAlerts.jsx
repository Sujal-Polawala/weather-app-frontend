import React, { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlinePlus, HiOutlineX, HiOutlineThermometer, HiOutlineCloudRain, HiOutlineWind } from 'react-icons/hi';
import toast from 'react-hot-toast';

const WeatherAlerts = ({ currentWeather, city }) => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'temperature',
    condition: 'above',
    value: '',
    city: '',
    enabled: true
  });

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('weatherAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('weatherAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Check alerts against current weather
  useEffect(() => {
    if (currentWeather && city) {
      checkAlerts();
    }
  }, [currentWeather, city, alerts]);

  const checkAlerts = () => {
    alerts.forEach(alert => {
      if (!alert.enabled || alert.city !== city) return;

      let shouldTrigger = false;
      let message = '';

      switch (alert.type) {
        case 'temperature':
          if (alert.condition === 'above' && currentWeather.temperature > parseFloat(alert.value)) {
            shouldTrigger = true;
            message = `Temperature alert: ${currentWeather.temperature}°C is above ${alert.value}°C in ${city}`;
          } else if (alert.condition === 'below' && currentWeather.temperature < parseFloat(alert.value)) {
            shouldTrigger = true;
            message = `Temperature alert: ${currentWeather.temperature}°C is below ${alert.value}°C in ${city}`;
          }
          break;
        case 'humidity':
          if (alert.condition === 'above' && currentWeather.humidity > parseFloat(alert.value)) {
            shouldTrigger = true;
            message = `Humidity alert: ${currentWeather.humidity}% is above ${alert.value}% in ${city}`;
          } else if (alert.condition === 'below' && currentWeather.humidity < parseFloat(alert.value)) {
            shouldTrigger = true;
            message = `Humidity alert: ${currentWeather.humidity}% is below ${alert.value}% in ${city}`;
          }
          break;
        case 'windSpeed':
          if (alert.condition === 'above' && currentWeather.windSpeed > parseFloat(alert.value)) {
            shouldTrigger = true;
            message = `Wind alert: ${currentWeather.windSpeed} km/h is above ${alert.value} km/h in ${city}`;
          } else if (alert.condition === 'below' && currentWeather.windSpeed < parseFloat(alert.value)) {
            shouldTrigger = true;
            message = `Wind alert: ${currentWeather.windSpeed} km/h is below ${alert.value} km/h in ${city}`;
          }
          break;
        case 'rain':
          if (currentWeather.description.toLowerCase().includes('rain')) {
            shouldTrigger = true;
            message = `Rain alert: It's raining in ${city}`;
          }
          break;
      }

      if (shouldTrigger) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <HiOutlineBell className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    Weather Alert
                  </p>
                  <p className="mt-1 text-sm text-white/90">
                    {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-white/20">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
          </div>
        ), {
          duration: 6000,
          position: 'bottom-right',
        });
      }
    });
  };

  const addAlert = () => {
    if (!newAlert.value || !newAlert.city) {
      toast.error('Please fill in all fields');
      return;
    }

    const alert = {
      id: Date.now(),
      ...newAlert,
      value: parseFloat(newAlert.value)
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({
      type: 'temperature',
      condition: 'above',
      value: '',
      city: '',
      enabled: true
    });
    setShowForm(false);
    toast.success('Alert added successfully');
  };

  const toggleAlert = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast.success('Alert deleted');
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <HiOutlineThermometer className="text-red-500" />;
      case 'humidity':
        return <HiOutlineCloudRain className="text-blue-500" />;
      case 'windSpeed':
        return <HiOutlineWind className="text-gray-500" />;
      case 'rain':
        return <HiOutlineCloudRain className="text-blue-500" />;
      default:
        return <HiOutlineBell className="text-gray-500" />;
    }
  };

  const getAlertTypeLabel = (type) => {
    switch (type) {
      case 'temperature':
        return 'Temperature';
      case 'humidity':
        return 'Humidity';
      case 'windSpeed':
        return 'Wind Speed';
      case 'rain':
        return 'Rain';
      default:
        return type;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔔 Custom Weather Alerts
        </h2>

        {/* Add Alert Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <HiOutlinePlus size={20} />
            Add New Alert
          </button>
        </div>

        {/* Add Alert Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Alert</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Type
                </label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 p-3 rounded-xl outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
                >
                  <option value="temperature">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="windSpeed">Wind Speed</option>
                  <option value="rain">Rain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 p-3 rounded-xl outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={newAlert.type === 'rain' ? 'N/A' : 'Enter value'}
                  disabled={newAlert.type === 'rain'}
                  className="w-full bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 p-3 rounded-xl outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={newAlert.city}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city name"
                  className="w-full bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 p-3 rounded-xl outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={addAlert}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Add Alert
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Alerts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 transition-all duration-300 ${
                alert.enabled ? 'shadow-lg hover:shadow-xl' : 'opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getAlertTypeLabel(alert.type)} Alert
                    </h3>
                    <p className="text-sm text-gray-600">
                      {alert.city}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      alert.enabled 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={alert.enabled ? 'Disable alert' : 'Enable alert'}
                  >
                    <HiOutlineBell size={16} />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <HiOutlineX size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {alert.condition} {alert.type === 'rain' ? 'rain' : alert.value}
                    {alert.type === 'temperature' && '°C'}
                    {alert.type === 'humidity' && '%'}
                    {alert.type === 'windSpeed' && ' km/h'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${
                    alert.enabled ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {alert.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No alerts set up yet
            </h3>
            <p className="text-gray-500">
              Create alerts to get notified about specific weather conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAlerts; 