import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineGlobe, HiOutlineCheck } from 'react-icons/hi';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      nativeName: 'English'
    },
    {
      code: 'fr',
      name: 'French',
      flag: '🇫🇷',
      nativeName: 'Français'
    },
    {
      code: 'hi',
      name: 'Hindi',
      flag: '🇮🇳',
      nativeName: 'हिंदी'
    },
    {
      code: 'es',
      name: 'Spanish',
      flag: '🇪🇸',
      nativeName: 'Español'
    }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🌍 Language Settings
        </h2>

        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Language</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {currentLanguage.flag}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {currentLanguage.name}
                  </h4>
                  <p className="text-gray-600">
                    {currentLanguage.nativeName}
                  </p>
                </div>
              </div>
              <div className="text-green-500">
                <HiOutlineCheck size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`bg-white/80 backdrop-blur-lg border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                i18n.language === language.code
                  ? 'border-blue-500 shadow-lg'
                  : 'border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {language.flag}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {language.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {language.nativeName}
                </p>
                {i18n.language === language.code && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <HiOutlineCheck size={16} />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Language Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">App Title</h4>
              <p className="text-gray-600">{t('app.title')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Search Placeholder</h4>
              <p className="text-gray-600">{t('search.placeholder')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Weather Info</h4>
              <p className="text-gray-600">{t('weather.temperature')}: 25°C</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">History</h4>
              <p className="text-gray-600">{t('history.title')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Language Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Current Language</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-semibold text-gray-800">{i18n.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{currentLanguage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Native Name:</span>
                  <span className="font-semibold text-gray-800">{currentLanguage.nativeName}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Available Languages</h4>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.code} className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm text-gray-600">{lang.name}</span>
                    {i18n.language === lang.code && (
                      <HiOutlineCheck className="text-green-500" size={14} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 