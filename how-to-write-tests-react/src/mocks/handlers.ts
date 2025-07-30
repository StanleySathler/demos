import { http, HttpResponse } from "msw";

const createMockWeatherData = (city: string, country: string) => ({
  request: {
    type: "City",
    query: `${city}, ${country}`,
    language: "en",
    unit: "m",
  },
  location: {
    name: city,
    country: country,
    region: `${city}, ${country}`,
    lat: "51.517",
    lon: "-0.106",
    timezone_id: "Europe/London",
    localtime: "2025-01-27 23:23",
    localtime_epoch: 1738016580,
    utc_offset: "0.0",
  },
  current: {
    observation_time: "11:23 PM",
    temperature: 8,
    weather_code: 122,
    weather_icons: [
      "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png",
    ],
    weather_descriptions: ["Overcast"],
    wind_speed: 15,
    wind_degree: 270,
    wind_dir: "W",
    pressure: 1018,
    precip: 0,
    humidity: 76,
    cloudcover: 100,
    feelslike: 5,
    uv_index: 0,
    visibility: 10,
  },
});

export const handlers = [
  http.get("https://api.weatherstack.com/current", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    // Default to London if no query or if query is 'london'
    if (!query || query.toLowerCase().includes("london")) {
      return HttpResponse.json(
        createMockWeatherData("London", "United Kingdom")
      );
    }

    // For other cities, create a generic response
    const cityName = query.split(",")[0] || query;
    return HttpResponse.json(
      createMockWeatherData(cityName, "Unknown Country")
    );
  }),
];
