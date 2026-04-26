export interface ExchangeRates {
  base: string
  date: string
  rates: Record<string, number>
}

export interface ConversionResult {
  from: string
  to: string
  amount: number
  result: number
  rate: number
  date: string
}

// Using Frankfurter API - free, no API key required
const BASE_URL = 'https://api.frankfurter.app'

export async function getExchangeRates(base: string = 'USD'): Promise<ExchangeRates | null> {
  try {
    const res = await fetch(`${BASE_URL}/latest?from=${base}`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch exchange rates')
    }

    const data = await res.json()
    
    return {
      base: data.base,
      date: data.date,
      rates: data.rates,
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return null
  }
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<ConversionResult | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`
    )
    
    if (!res.ok) {
      throw new Error('Failed to convert currency')
    }

    const data = await res.json()
    
    return {
      from,
      to,
      amount,
      result: data.rates[to],
      rate: data.rates[to] / amount,
      date: data.date,
    }
  } catch (error) {
    console.error('Error converting currency:', error)
    return null
  }
}

export async function getSupportedCurrencies(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`${BASE_URL}/currencies`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch currencies')
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return null
  }
}

// Common currencies for travel
export const popularCurrencies = [
  { code: 'USD', name: 'Dolar estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Libra esterlina', symbol: '£' },
  { code: 'JPY', name: 'Yen japones', symbol: '¥' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$' },
  { code: 'BRL', name: 'Real brasileno', symbol: 'R$' },
  { code: 'ARS', name: 'Peso argentino', symbol: '$' },
  { code: 'COP', name: 'Peso colombiano', symbol: '$' },
  { code: 'CLP', name: 'Peso chileno', symbol: '$' },
  { code: 'PEN', name: 'Sol peruano', symbol: 'S/' },
  { code: 'CAD', name: 'Dolar canadiense', symbol: 'C$' },
  { code: 'AUD', name: 'Dolar australiano', symbol: 'A$' },
  { code: 'CHF', name: 'Franco suizo', symbol: 'CHF' },
  { code: 'CNY', name: 'Yuan chino', symbol: '¥' },
  { code: 'KRW', name: 'Won surcoreano', symbol: '₩' },
  { code: 'THB', name: 'Baht tailandes', symbol: '฿' },
]
