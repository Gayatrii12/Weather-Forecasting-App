"use client";

import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setError("");
    try {
      const apiKey = "d14a6f81c154c3066b67628b071e1f3d"; 

      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      if (currentWeatherResponse.ok && forecastResponse.ok) {
        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        const dailyForecast = processDailyForecast(forecastData.list);

        setCurrentWeather(currentWeatherData);
        setForecast(dailyForecast);
      } else {
        setError("City not found");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  };

  const processDailyForecast = (list) => {
    const dailyForecast = [];
    list.forEach((item) => {
      if (item.dt_txt.includes("12:00:00")) {
        dailyForecast.push({
          date: item.dt_txt.split(" ")[0], 
          temp: item.main.temp,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          wind: item.wind.speed,
          icon: item.weather[0].icon, 
        });
      }
    });
    return dailyForecast;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeather();
    } else {
      setError("Please enter a city");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5d0fe]">
      <h1 className="text-4xl font-bold mb-8 text-[#4a044e]">
        Weather Dashboard
      </h1>

      <form onSubmit={handleSearch} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 text-black border border-gray-300 rounded-md shadow-md w-64 mb-4 text-lg"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#4a044e] text-white rounded-md shadow hover:bg-[#701a75] transition"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {currentWeather && (
        <div className="flex gap-8">
          <div className="mt-8 p-6 text-black bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold">
              {currentWeather.name}, {currentWeather.sys.country}
            </h2>
            <p className="mt-4 text-xl">
              Current Temperature: {currentWeather.main.temp}°C
            </p>
            <p>Humidity: {currentWeather.main.humidity}%</p>
            <p>Weather: {currentWeather.weather[0].description}</p>
            <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
          </div>
          <div className="mt-8 p-6 text-black bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="p-4 bg-blue-100 rounded-md shadow text-center"
                >
                  <p className="font-bold">{day.date}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                  />
                  <p>Temp: {day.temp}°C</p>
                  <p>Humidity: {day.humidity}%</p>
                  <p>{day.description}</p>
                  <p>Wind: {day.wind} m/s</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
