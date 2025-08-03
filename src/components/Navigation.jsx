import React, { useState } from 'react';
import { HiOutlineHome, HiOutlineMap, HiOutlineChartBar, HiOutlineBell, HiOutlineGlobe, HiOutlinePalette, HiOutlineViewGrid, HiOutlineClock } from 'react-icons/hi';

const Navigation = ({ activeSection, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    {
      id: 'home',
      name: 'Home',
      icon: <HiOutlineHome size={20} />,
      description: 'Main weather search and display'
    },
    {
      id: 'comparison',
      name: 'City Comparison',
      icon: <HiOutlineViewGrid size={20} />,
      description: 'Compare multiple cities side by side'
    },
    {
      id: 'map',
      name: 'Weather Map',
      icon: <HiOutlineMap size={20} />,
      description: 'Interactive map with weather data'
    },
    {
      id: 'forecast',
      name: 'Forecast',
      icon: <HiOutlineClock size={20} />,
      description: 'Hourly and 7-day weather forecasts'
    },
    {
      id: 'alerts',
      name: 'Weather Alerts',
      icon: <HiOutlineBell size={20} />,
      description: 'Set custom weather notifications'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <HiOutlineChartBar size={20} />,
      description: 'Weather history and trends'
    },
    {
      id: 'theme',
      name: 'Theme Switcher',
      icon: <HiOutlinePalette size={20} />,
      description: 'Dynamic themes based on weather'
    },
    {
      id: 'language',
      name: 'Language',
      icon: <HiOutlineGlobe size={20} />,
      description: 'Change app language'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <div>
                      <div className="font-semibold">{section.name}</div>
                      <div className="text-sm opacity-80">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-white/90 backdrop-blur-lg border-r border-gray-200 shadow-xl p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">SkyCast</h1>
          <p className="text-gray-600">Your Weather Companion</p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <div>
                  <div className="font-semibold">{section.name}</div>
                  <div className="text-sm opacity-80">{section.description}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Multi-city comparison</li>
              <li>• Interactive weather map</li>
              <li>• Hourly & 7-day forecasts</li>
              <li>• Custom weather alerts</li>
              <li>• Dynamic themes</li>
              <li>• Multi-language support</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation; 