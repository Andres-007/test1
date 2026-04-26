export interface AirportWithCoordinates {
  code: string
  city: string
  country: string
  name: string
  lat: number
  lng: number
  region: string
}

export const airportsWithCoordinates: AirportWithCoordinates[] = [
  // Europa
  { code: 'MAD', city: 'Madrid', country: 'Espana', name: 'Adolfo Suarez Madrid-Barajas', lat: 40.4983, lng: -3.5676, region: 'Europa' },
  { code: 'BCN', city: 'Barcelona', country: 'Espana', name: 'Josep Tarradellas Barcelona-El Prat', lat: 41.2974, lng: 2.0833, region: 'Europa' },
  { code: 'LHR', city: 'Londres', country: 'Reino Unido', name: 'London Heathrow', lat: 51.4700, lng: -0.4543, region: 'Europa' },
  { code: 'LGW', city: 'Londres', country: 'Reino Unido', name: 'London Gatwick', lat: 51.1537, lng: -0.1821, region: 'Europa' },
  { code: 'CDG', city: 'Paris', country: 'Francia', name: 'Charles de Gaulle', lat: 49.0097, lng: 2.5479, region: 'Europa' },
  { code: 'ORY', city: 'Paris', country: 'Francia', name: 'Paris Orly', lat: 48.7233, lng: 2.3794, region: 'Europa' },
  { code: 'FCO', city: 'Roma', country: 'Italia', name: 'Leonardo da Vinci-Fiumicino', lat: 41.8003, lng: 12.2389, region: 'Europa' },
  { code: 'MXP', city: 'Milan', country: 'Italia', name: 'Milano Malpensa', lat: 45.6306, lng: 8.7281, region: 'Europa' },
  { code: 'AMS', city: 'Amsterdam', country: 'Paises Bajos', name: 'Schiphol', lat: 52.3105, lng: 4.7683, region: 'Europa' },
  { code: 'FRA', city: 'Frankfurt', country: 'Alemania', name: 'Frankfurt Airport', lat: 50.0379, lng: 8.5622, region: 'Europa' },
  { code: 'MUC', city: 'Munich', country: 'Alemania', name: 'Franz Josef Strauss', lat: 48.3537, lng: 11.7750, region: 'Europa' },
  { code: 'ZRH', city: 'Zurich', country: 'Suiza', name: 'Zurich Airport', lat: 47.4647, lng: 8.5492, region: 'Europa' },
  { code: 'VIE', city: 'Viena', country: 'Austria', name: 'Vienna International', lat: 48.1103, lng: 16.5697, region: 'Europa' },
  { code: 'CPH', city: 'Copenhague', country: 'Dinamarca', name: 'Copenhagen Airport', lat: 55.6180, lng: 12.6508, region: 'Europa' },
  { code: 'LIS', city: 'Lisboa', country: 'Portugal', name: 'Humberto Delgado', lat: 38.7756, lng: -9.1354, region: 'Europa' },
  { code: 'ATH', city: 'Atenas', country: 'Grecia', name: 'Eleftherios Venizelos', lat: 37.9364, lng: 23.9445, region: 'Europa' },
  { code: 'IST', city: 'Estambul', country: 'Turquia', name: 'Istanbul Airport', lat: 41.2753, lng: 28.7519, region: 'Europa' },
  { code: 'DUB', city: 'Dublin', country: 'Irlanda', name: 'Dublin Airport', lat: 53.4264, lng: -6.2499, region: 'Europa' },
  { code: 'BRU', city: 'Bruselas', country: 'Belgica', name: 'Brussels Airport', lat: 50.9014, lng: 4.4844, region: 'Europa' },
  { code: 'PRG', city: 'Praga', country: 'Republica Checa', name: 'Vaclav Havel', lat: 50.1008, lng: 14.2600, region: 'Europa' },
  { code: 'WAW', city: 'Varsovia', country: 'Polonia', name: 'Warsaw Chopin', lat: 52.1657, lng: 20.9671, region: 'Europa' },
  { code: 'OSL', city: 'Oslo', country: 'Noruega', name: 'Oslo Gardermoen', lat: 60.1939, lng: 11.1004, region: 'Europa' },
  { code: 'ARN', city: 'Estocolmo', country: 'Suecia', name: 'Stockholm Arlanda', lat: 59.6519, lng: 17.9186, region: 'Europa' },
  { code: 'HEL', city: 'Helsinki', country: 'Finlandia', name: 'Helsinki-Vantaa', lat: 60.3172, lng: 24.9633, region: 'Europa' },

  // Norteamerica
  { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos', name: 'John F. Kennedy', lat: 40.6413, lng: -73.7781, region: 'Norteamerica' },
  { code: 'EWR', city: 'Newark', country: 'Estados Unidos', name: 'Newark Liberty', lat: 40.6895, lng: -74.1745, region: 'Norteamerica' },
  { code: 'LGA', city: 'Nueva York', country: 'Estados Unidos', name: 'LaGuardia', lat: 40.7769, lng: -73.8740, region: 'Norteamerica' },
  { code: 'LAX', city: 'Los Angeles', country: 'Estados Unidos', name: 'Los Angeles International', lat: 33.9416, lng: -118.4085, region: 'Norteamerica' },
  { code: 'SFO', city: 'San Francisco', country: 'Estados Unidos', name: 'San Francisco International', lat: 37.6213, lng: -122.3790, region: 'Norteamerica' },
  { code: 'ORD', city: 'Chicago', country: 'Estados Unidos', name: 'O Hare International', lat: 41.9742, lng: -87.9073, region: 'Norteamerica' },
  { code: 'MIA', city: 'Miami', country: 'Estados Unidos', name: 'Miami International', lat: 25.7959, lng: -80.2870, region: 'Norteamerica' },
  { code: 'ATL', city: 'Atlanta', country: 'Estados Unidos', name: 'Hartsfield-Jackson', lat: 33.6407, lng: -84.4277, region: 'Norteamerica' },
  { code: 'DFW', city: 'Dallas', country: 'Estados Unidos', name: 'Dallas Fort Worth', lat: 32.8998, lng: -97.0403, region: 'Norteamerica' },
  { code: 'DEN', city: 'Denver', country: 'Estados Unidos', name: 'Denver International', lat: 39.8561, lng: -104.6737, region: 'Norteamerica' },
  { code: 'SEA', city: 'Seattle', country: 'Estados Unidos', name: 'Seattle-Tacoma', lat: 47.4502, lng: -122.3088, region: 'Norteamerica' },
  { code: 'BOS', city: 'Boston', country: 'Estados Unidos', name: 'Logan International', lat: 42.3656, lng: -71.0096, region: 'Norteamerica' },
  { code: 'LAS', city: 'Las Vegas', country: 'Estados Unidos', name: 'Harry Reid International', lat: 36.0840, lng: -115.1537, region: 'Norteamerica' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson', lat: 43.6777, lng: -79.6248, region: 'Norteamerica' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International', lat: 49.1967, lng: -123.1815, region: 'Norteamerica' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', name: 'Montreal-Trudeau', lat: 45.4706, lng: -73.7408, region: 'Norteamerica' },
  { code: 'MEX', city: 'Ciudad de Mexico', country: 'Mexico', name: 'Benito Juarez', lat: 19.4363, lng: -99.0721, region: 'Norteamerica' },
  { code: 'CUN', city: 'Cancun', country: 'Mexico', name: 'Cancun International', lat: 21.0365, lng: -86.8771, region: 'Norteamerica' },

  // Centroamerica y Caribe
  { code: 'PTY', city: 'Panama', country: 'Panama', name: 'Tocumen International', lat: 9.0714, lng: -79.3835, region: 'Centroamerica' },
  { code: 'SJO', city: 'San Jose', country: 'Costa Rica', name: 'Juan Santamaria', lat: 9.9939, lng: -84.2088, region: 'Centroamerica' },
  { code: 'SAL', city: 'San Salvador', country: 'El Salvador', name: 'Oscar Arnulfo Romero', lat: 13.4409, lng: -89.0557, region: 'Centroamerica' },
  { code: 'GUA', city: 'Guatemala', country: 'Guatemala', name: 'La Aurora', lat: 14.5833, lng: -90.5275, region: 'Centroamerica' },
  { code: 'TGU', city: 'Tegucigalpa', country: 'Honduras', name: 'Toncontin', lat: 14.0609, lng: -87.2172, region: 'Centroamerica' },
  { code: 'MGA', city: 'Managua', country: 'Nicaragua', name: 'Augusto C. Sandino', lat: 12.1415, lng: -86.1682, region: 'Centroamerica' },
  { code: 'HAV', city: 'La Habana', country: 'Cuba', name: 'Jose Marti', lat: 22.9892, lng: -82.4091, region: 'Caribe' },
  { code: 'SDQ', city: 'Santo Domingo', country: 'Republica Dominicana', name: 'Las Americas', lat: 18.4297, lng: -69.6689, region: 'Caribe' },
  { code: 'SJU', city: 'San Juan', country: 'Puerto Rico', name: 'Luis Munoz Marin', lat: 18.4394, lng: -66.0018, region: 'Caribe' },

  // Sudamerica
  { code: 'GRU', city: 'Sao Paulo', country: 'Brasil', name: 'Guarulhos', lat: -23.4356, lng: -46.4731, region: 'Sudamerica' },
  { code: 'GIG', city: 'Rio de Janeiro', country: 'Brasil', name: 'Galeao', lat: -22.8099, lng: -43.2505, region: 'Sudamerica' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ministro Pistarini', lat: -34.8222, lng: -58.5358, region: 'Sudamerica' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', name: 'Arturo Merino Benitez', lat: -33.3930, lng: -70.7858, region: 'Sudamerica' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia', name: 'El Dorado', lat: 4.7016, lng: -74.1469, region: 'Sudamerica' },
  { code: 'MDE', city: 'Medellin', country: 'Colombia', name: 'Jose Maria Cordova', lat: 6.1645, lng: -75.4231, region: 'Sudamerica' },
  { code: 'LIM', city: 'Lima', country: 'Peru', name: 'Jorge Chavez', lat: -12.0219, lng: -77.1143, region: 'Sudamerica' },
  { code: 'UIO', city: 'Quito', country: 'Ecuador', name: 'Mariscal Sucre', lat: -0.1292, lng: -78.3575, region: 'Sudamerica' },
  { code: 'CCS', city: 'Caracas', country: 'Venezuela', name: 'Simon Bolivar', lat: 10.6012, lng: -66.9913, region: 'Sudamerica' },
  { code: 'MVD', city: 'Montevideo', country: 'Uruguay', name: 'Carrasco', lat: -34.8384, lng: -56.0308, region: 'Sudamerica' },

  // Asia
  { code: 'DXB', city: 'Dubai', country: 'Emiratos Arabes Unidos', name: 'Dubai International', lat: 25.2532, lng: 55.3657, region: 'Asia' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International', lat: 25.2731, lng: 51.6081, region: 'Asia' },
  { code: 'SIN', city: 'Singapur', country: 'Singapur', name: 'Changi Airport', lat: 1.3644, lng: 103.9915, region: 'Asia' },
  { code: 'HKG', city: 'Hong Kong', country: 'China', name: 'Hong Kong International', lat: 22.3080, lng: 113.9185, region: 'Asia' },
  { code: 'PEK', city: 'Beijing', country: 'China', name: 'Beijing Capital', lat: 40.0799, lng: 116.6031, region: 'Asia' },
  { code: 'PVG', city: 'Shanghai', country: 'China', name: 'Shanghai Pudong', lat: 31.1443, lng: 121.8083, region: 'Asia' },
  { code: 'HND', city: 'Tokio', country: 'Japon', name: 'Haneda Airport', lat: 35.5494, lng: 139.7798, region: 'Asia' },
  { code: 'NRT', city: 'Tokio', country: 'Japon', name: 'Narita International', lat: 35.7720, lng: 140.3929, region: 'Asia' },
  { code: 'ICN', city: 'Seoul', country: 'Corea del Sur', name: 'Incheon International', lat: 37.4602, lng: 126.4407, region: 'Asia' },
  { code: 'BKK', city: 'Bangkok', country: 'Tailandia', name: 'Suvarnabhumi', lat: 13.6900, lng: 100.7501, region: 'Asia' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malasia', name: 'Kuala Lumpur International', lat: 2.7456, lng: 101.7099, region: 'Asia' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', name: 'Ngurah Rai', lat: -8.7482, lng: 115.1672, region: 'Asia' },
  { code: 'DEL', city: 'Nueva Delhi', country: 'India', name: 'Indira Gandhi', lat: 28.5562, lng: 77.1000, region: 'Asia' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji', lat: 19.0896, lng: 72.8656, region: 'Asia' },
  { code: 'TLV', city: 'Tel Aviv', country: 'Israel', name: 'Ben Gurion', lat: 32.0055, lng: 34.8854, region: 'Asia' },

  // Africa
  { code: 'JNB', city: 'Johannesburgo', country: 'Sudafrica', name: 'O.R. Tambo', lat: -26.1392, lng: 28.2460, region: 'Africa' },
  { code: 'CPT', city: 'Ciudad del Cabo', country: 'Sudafrica', name: 'Cape Town International', lat: -33.9715, lng: 18.6021, region: 'Africa' },
  { code: 'CAI', city: 'El Cairo', country: 'Egipto', name: 'Cairo International', lat: 30.1219, lng: 31.4056, region: 'Africa' },
  { code: 'CMN', city: 'Casablanca', country: 'Marruecos', name: 'Mohammed V', lat: 33.3675, lng: -7.5900, region: 'Africa' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenia', name: 'Jomo Kenyatta', lat: -1.3192, lng: 36.9278, region: 'Africa' },
  { code: 'ADD', city: 'Addis Abeba', country: 'Etiopia', name: 'Bole International', lat: 8.9779, lng: 38.7993, region: 'Africa' },
  { code: 'LOS', city: 'Lagos', country: 'Nigeria', name: 'Murtala Muhammed', lat: 6.5774, lng: 3.3212, region: 'Africa' },

  // Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith', lat: -33.9399, lng: 151.1753, region: 'Oceania' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Tullamarine', lat: -37.6690, lng: 144.8410, region: 'Oceania' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', name: 'Brisbane Airport', lat: -27.3942, lng: 153.1218, region: 'Oceania' },
  { code: 'PER', city: 'Perth', country: 'Australia', name: 'Perth Airport', lat: -31.9403, lng: 115.9672, region: 'Oceania' },
  { code: 'AKL', city: 'Auckland', country: 'Nueva Zelanda', name: 'Auckland Airport', lat: -37.0082, lng: 174.7850, region: 'Oceania' },
  { code: 'WLG', city: 'Wellington', country: 'Nueva Zelanda', name: 'Wellington Airport', lat: -41.3272, lng: 174.8050, region: 'Oceania' },
  { code: 'NAN', city: 'Nadi', country: 'Fiyi', name: 'Nadi International', lat: -17.7553, lng: 177.4436, region: 'Oceania' },
]

// Calcular distancia entre dos puntos usando la formula de Haversine
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Obtener aeropuertos cercanos ordenados por distancia
export function getNearbyAirports(lat: number, lng: number, limit: number = 10): (AirportWithCoordinates & { distance: number })[] {
  return airportsWithCoordinates
    .map(airport => ({
      ...airport,
      distance: calculateDistance(lat, lng, airport.lat, airport.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}
