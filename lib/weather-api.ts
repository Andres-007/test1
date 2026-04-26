const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

export interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  forecast: ForecastDay[]
}

export interface ForecastDay {
  date: string
  tempMin: number
  tempMax: number
  description: string
  icon: string
}

export async function getWeatherByCity(city: string): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    console.error('OPENWEATHER_API_KEY not configured')
    return null
  }

  try {
    // Get current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
    )

    if (!currentRes.ok) {
      throw new Error('City not found')
    }

    const currentData = await currentRes.json()

    // Get 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
    )

    const forecastData = await forecastRes.json()

    // Process forecast to get daily data
    const dailyForecast: ForecastDay[] = []
    const processedDates = new Set<string>()

    for (const item of forecastData.list || []) {
      const date = item.dt_txt.split(' ')[0]
      if (!processedDates.has(date) && dailyForecast.length < 5) {
        processedDates.add(date)
        dailyForecast.push({
          date,
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })
      }
    }

    return {
      city: currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      forecast: dailyForecast,
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    return null
  }

  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
    )

    if (!currentRes.ok) {
      throw new Error('Location not found')
    }

    const currentData = await currentRes.json()

    return {
      city: currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      windSpeed: Math.round(currentData.wind.speed * 3.6),
      forecast: [],
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}
