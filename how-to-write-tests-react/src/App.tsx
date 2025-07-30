import React, { useState, useEffect } from "react";
import "./App.css";

interface WeatherData {
  request: {
    query: string;
    language: string;
    unit: string;
  };
  location: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
  };
  current: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("London");

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      // Using Weatherstack API with the provided API key
      const response = await fetch(
        `https://api.weatherstack.com/current?access_key=16ba5d3cb9d5f57437edb2bb2e3bd69b&query=${cityName}&units=m`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      // Check if the API returned an error
      if (!data.success && data.error) {
        throw new Error(data.error.info || "API error occurred");
      }

      // Transform Weatherstack data to match our interface
      const transformedData: WeatherData = {
        request: {
          query: data.request.query,
          language: data.request.language,
          unit: data.request.unit,
        },
        location: {
          name: data.location.name,
          country: data.location.country,
          region: data.location.region,
          lat: data.location.lat,
          lon: data.location.lon,
          timezone_id: data.location.timezone_id,
          localtime: data.location.localtime,
        },
        current: {
          observation_time: data.current.observation_time,
          temperature: data.current.temperature,
          weather_code: data.current.weather_code,
          weather_icons: data.current.weather_icons,
          weather_descriptions: data.current.weather_descriptions,
          wind_speed: data.current.wind_speed,
          wind_degree: data.current.wind_degree,
          wind_dir: data.current.wind_dir,
          pressure: data.current.pressure,
          precip: data.current.precip,
          humidity: data.current.humidity,
          cloudcover: data.current.cloudcover,
          feelslike: data.current.feelslike,
          uv_index: data.current.uv_index,
          visibility: data.current.visibility,
        },
      };

      setWeatherData(transformedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <div className="App">
      <main>
        <header>
          <h1>Weather Information</h1>
        </header>

        <section>
          <form onSubmit={handleSubmit}>
            <label htmlFor="city-input">Enter city name:</label>
            <input
              id="city-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., London, New York, Tokyo"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Get Weather"}
            </button>
          </form>
        </section>

        {error && (
          <section>
            <p role="alert">Error: {error}</p>
          </section>
        )}

        {loading && (
          <section>
            <p>Loading weather data...</p>
          </section>
        )}

        {weatherData && !loading && (
          <section>
            <article>
              <header>
                <h2>
                  Current Weather in {weatherData.location.name},{" "}
                  {weatherData.location.country}
                </h2>
                <time dateTime={weatherData.location.localtime}>
                  {new Date(weatherData.location.localtime).toLocaleString()}
                </time>
              </header>

              <div>
                <img
                  src={weatherData.current.weather_icons[0]}
                  alt={weatherData.current.weather_descriptions[0]}
                  width="64"
                  height="64"
                />
                <p>{weatherData.current.weather_descriptions[0]}</p>
              </div>

              <dl>
                <div>
                  <dt>Temperature</dt>
                  <dd>{weatherData.current.temperature}°C</dd>
                </div>

                <div>
                  <dt>Feels Like</dt>
                  <dd>{weatherData.current.feelslike}°C</dd>
                </div>

                <div>
                  <dt>Humidity</dt>
                  <dd>{weatherData.current.humidity}%</dd>
                </div>

                <div>
                  <dt>Wind Speed</dt>
                  <dd>
                    {weatherData.current.wind_speed} km/h{" "}
                    {weatherData.current.wind_dir}
                  </dd>
                </div>

                <div>
                  <dt>Pressure</dt>
                  <dd>{weatherData.current.pressure} mb</dd>
                </div>

                <div>
                  <dt>Visibility</dt>
                  <dd>{weatherData.current.visibility} km</dd>
                </div>

                <div>
                  <dt>Cloud Cover</dt>
                  <dd>{weatherData.current.cloudcover}%</dd>
                </div>
              </dl>

              <footer>
                <p>
                  <small>
                    Location: {weatherData.location.lat}°N,{" "}
                    {weatherData.location.lon}°E
                  </small>
                </p>
              </footer>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
