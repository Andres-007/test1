export interface City {
  name: string
  country: string
  timezone: string
  offset: number // hours from UTC
  code: string
}

export const cities: City[] = [
  { name: 'Madrid', country: 'Espana', timezone: 'Europe/Madrid', offset: 1, code: 'MAD' },
  { name: 'Barcelona', country: 'Espana', timezone: 'Europe/Madrid', offset: 1, code: 'BCN' },
  { name: 'Londres', country: 'Reino Unido', timezone: 'Europe/London', offset: 0, code: 'LHR' },
  { name: 'Paris', country: 'Francia', timezone: 'Europe/Paris', offset: 1, code: 'CDG' },
  { name: 'Berlin', country: 'Alemania', timezone: 'Europe/Berlin', offset: 1, code: 'BER' },
  { name: 'Roma', country: 'Italia', timezone: 'Europe/Rome', offset: 1, code: 'FCO' },
  { name: 'Amsterdam', country: 'Paises Bajos', timezone: 'Europe/Amsterdam', offset: 1, code: 'AMS' },
  { name: 'Lisboa', country: 'Portugal', timezone: 'Europe/Lisbon', offset: 0, code: 'LIS' },
  { name: 'Nueva York', country: 'Estados Unidos', timezone: 'America/New_York', offset: -5, code: 'JFK' },
  { name: 'Los Angeles', country: 'Estados Unidos', timezone: 'America/Los_Angeles', offset: -8, code: 'LAX' },
  { name: 'Chicago', country: 'Estados Unidos', timezone: 'America/Chicago', offset: -6, code: 'ORD' },
  { name: 'Miami', country: 'Estados Unidos', timezone: 'America/New_York', offset: -5, code: 'MIA' },
  { name: 'Ciudad de Mexico', country: 'Mexico', timezone: 'America/Mexico_City', offset: -6, code: 'MEX' },
  { name: 'Bogota', country: 'Colombia', timezone: 'America/Bogota', offset: -5, code: 'BOG' },
  { name: 'Lima', country: 'Peru', timezone: 'America/Lima', offset: -5, code: 'LIM' },
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', offset: -3, code: 'EZE' },
  { name: 'Santiago', country: 'Chile', timezone: 'America/Santiago', offset: -3, code: 'SCL' },
  { name: 'Sao Paulo', country: 'Brasil', timezone: 'America/Sao_Paulo', offset: -3, code: 'GRU' },
  { name: 'Tokyo', country: 'Japon', timezone: 'Asia/Tokyo', offset: 9, code: 'NRT' },
  { name: 'Pekin', country: 'China', timezone: 'Asia/Shanghai', offset: 8, code: 'PEK' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', offset: 8, code: 'PVG' },
  { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', offset: 8, code: 'HKG' },
  { name: 'Singapur', country: 'Singapur', timezone: 'Asia/Singapore', offset: 8, code: 'SIN' },
  { name: 'Bangkok', country: 'Tailandia', timezone: 'Asia/Bangkok', offset: 7, code: 'BKK' },
  { name: 'Seul', country: 'Corea del Sur', timezone: 'Asia/Seoul', offset: 9, code: 'ICN' },
  { name: 'Dubai', country: 'Emiratos Arabes', timezone: 'Asia/Dubai', offset: 4, code: 'DXB' },
  { name: 'Estambul', country: 'Turquia', timezone: 'Europe/Istanbul', offset: 3, code: 'IST' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5, code: 'BOM' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5, code: 'DEL' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 11, code: 'SYD' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', offset: 11, code: 'MEL' },
  { name: 'Auckland', country: 'Nueva Zelanda', timezone: 'Pacific/Auckland', offset: 13, code: 'AKL' },
  { name: 'Cairo', country: 'Egipto', timezone: 'Africa/Cairo', offset: 2, code: 'CAI' },
  { name: 'Johannesburgo', country: 'Sudafrica', timezone: 'Africa/Johannesburg', offset: 2, code: 'JNB' },
  { name: 'Casablanca', country: 'Marruecos', timezone: 'Africa/Casablanca', offset: 1, code: 'CMN' },
  { name: 'Moscu', country: 'Rusia', timezone: 'Europe/Moscow', offset: 3, code: 'SVO' },
]

export function getTimeDifference(city1: City, city2: City): number {
  return city2.offset - city1.offset
}

export function formatTimeDifference(hours: number): string {
  const absHours = Math.abs(hours)
  const sign = hours >= 0 ? '+' : '-'
  if (hours === 0) return 'Misma hora'
  return `${sign}${absHours} ${absHours === 1 ? 'hora' : 'horas'}`
}

export function getTimeInCity(city: City, baseDate: Date = new Date()): Date {
  const utc = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000)
  return new Date(utc + (city.offset * 3600000))
}
