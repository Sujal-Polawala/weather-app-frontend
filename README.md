# 🌤️ Weather App Frontend

A responsive weather forecast application built using **React.js**, **Tailwind CSS**, and **Axios**, integrated with a Flask-powered AI backend for clothing suggestions based on live weather data.

---

## 🔍 Features

- Search weather by city name using OpenWeatherMap API
- View real-time temperature, humidity, wind speed, and weather description
- AI-generated clothing suggestions powered by a Flask backend using HuggingFace Transformers
- Responsive design using Tailwind CSS
- Clean UI and easy-to-use interface

---

## 🧠 AI Suggestion Feature

When the user searches for a city’s weather, the app also sends the temperature and description to the backend. A Python-based AI model generates appropriate clothing suggestions based on current conditions and stores them in MongoDB to avoid redundant generation.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Flask, Transformers (HuggingFace), MongoDB
- **API:** OpenWeatherMap, Custom Flask AI API

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Sujal-Polawala/weather-app-frontend.git
cd weather-app-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and add your OpenWeatherMap API key:

```ini
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_AI_SUGGEST_API=https://your-backend-api.com/api/suggest
```

4. Run the development server:

```bash
npm run dev
```

## 📁 Folder Structure
```bash
weather-app-frontend/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── services/        # API service functions
│   ├── App.jsx
│   └── main.jsx
├── .env
└── tailwind.config.js
```

## 📸 Live Demo
Frontend (User View): https://weather-app-frontend-taupe.vercel.app

## 🤝 Author
Developed by Sujal Polawala

## 📄 License
This project is licensed under the MIT License.
