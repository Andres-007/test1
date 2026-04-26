export interface CountryInfo {
  name: string
  officialName: string
  capital: string[]
  region: string
  subregion: string
  population: number
  languages: Record<string, string>
  currencies: Record<string, { name: string; symbol: string }>
  timezones: string[]
  flag: string
  flagAlt: string
  coatOfArms: string
  maps: {
    googleMaps: string
    openStreetMaps: string
  }
  borders: string[]
  area: number
  continents: string[]
  callingCodes: string[]
  tld: string[]
  drivingSide: string
}

const BASE_URL = 'https://restcountries.com/v3.1'

export async function getCountryByName(name: string): Promise<CountryInfo | null> {
  try {
    const res = await fetch(`${BASE_URL}/name/${encodeURIComponent(name)}?fullText=false`)
    
    if (!res.ok) {
      throw new Error('Country not found')
    }

    const data = await res.json()
    const country = data[0]

    return mapCountryData(country)
  } catch (error) {
    console.error('Error fetching country:', error)
    return null
  }
}

export async function getCountryByCode(code: string): Promise<CountryInfo | null> {
  try {
    const res = await fetch(`${BASE_URL}/alpha/${code}`)
    
    if (!res.ok) {
      throw new Error('Country not found')
    }

    const data = await res.json()
    const country = Array.isArray(data) ? data[0] : data

    return mapCountryData(country)
  } catch (error) {
    console.error('Error fetching country:', error)
    return null
  }
}

export async function getAllCountries(): Promise<CountryInfo[]> {
  try {
    const res = await fetch(`${BASE_URL}/all?fields=name,capital,region,subregion,population,flags,cca2,cca3`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch countries')
    }

    const data = await res.json()
    
    return data.map((country: any) => ({
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital || [],
      region: country.region,
      subregion: country.subregion || '',
      population: country.population,
      flag: country.flags?.svg || country.flags?.png || '',
      code: country.cca2,
      code3: country.cca3,
    }))
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}

export async function getCountriesByRegion(region: string): Promise<CountryInfo[]> {
  try {
    const res = await fetch(`${BASE_URL}/region/${encodeURIComponent(region)}`)
    
    if (!res.ok) {
      throw new Error('Region not found')
    }

    const data = await res.json()
    return data.map(mapCountryData)
  } catch (error) {
    console.error('Error fetching countries by region:', error)
    return []
  }
}

function mapCountryData(country: any): CountryInfo {
  return {
    name: country.name?.common || '',
    officialName: country.name?.official || '',
    capital: country.capital || [],
    region: country.region || '',
    subregion: country.subregion || '',
    population: country.population || 0,
    languages: country.languages || {},
    currencies: country.currencies || {},
    timezones: country.timezones || [],
    flag: country.flags?.svg || country.flags?.png || '',
    flagAlt: country.flags?.alt || '',
    coatOfArms: country.coatOfArms?.svg || country.coatOfArms?.png || '',
    maps: {
      googleMaps: country.maps?.googleMaps || '',
      openStreetMaps: country.maps?.openStreetMaps || '',
    },
    borders: country.borders || [],
    area: country.area || 0,
    continents: country.continents || [],
    callingCodes: country.idd ? [`${country.idd.root}${(country.idd.suffixes || [])[0] || ''}`] : [],
    tld: country.tld || [],
    drivingSide: country.car?.side || 'right',
  }
}
