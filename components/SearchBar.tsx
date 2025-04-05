import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function SearchBar() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // State for auto-detect location
  const [autoLocationLoading, setAutoLocationLoading] =
    useState<boolean>(false);

  // Handle search by city
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new search
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("City not found or invalid.");
    } finally {
      setLoading(false);
    }
  };

  // Handle auto-detect location
  const handleAutoDetectLocation = async () => {
    setAutoLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude); // Fetch weather by coordinates
        },
        (error) => {
          setError("Failed to get location. Please allow location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    setAutoLocationLoading(false);
  };

  // Function to fetch weather by coordinates (latitude, longitude)
  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    setLoading(true);
    setError(""); // Reset error on new search
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-4 items-center justify-center"
    >
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>

      {/* Auto-detect location button */}
      <div className="mt-2">
        <button
          type="button"
          onClick={handleAutoDetectLocation}
          className="text-sm text-blue-600 hover:underline"
        >
          {autoLocationLoading ? "Detecting location..." : "Use my location"}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="mt-4 text-center">
          <h2 className="text-xl">{weather.name}</h2>
          <p>{Math.round(weather.main.temp)}°C</p>
          <p>{weather.weather[0].description}</p>
          {/* Display the dynamic weather icon using Next.js Image component */}
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            width={50} // Adjust the width as needed
            height={50} // Adjust the height as needed
            className="mx-auto my-2"
          />
        </div>
      )}
    </form>
  );
}
