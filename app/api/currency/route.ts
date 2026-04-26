import { NextRequest, NextResponse } from 'next/server'
import { convertCurrency, getExchangeRates, getSupportedCurrencies } from '@/lib/currency-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action') || 'rates'
  const from = searchParams.get('from') || 'USD'
  const to = searchParams.get('to')
  const amount = parseFloat(searchParams.get('amount') || '1')

  if (action === 'currencies') {
    const currencies = await getSupportedCurrencies()
    if (!currencies) {
      return NextResponse.json({ error: 'Could not fetch currencies' }, { status: 500 })
    }
    return NextResponse.json(currencies)
  }

  if (action === 'convert' && to) {
    const result = await convertCurrency(amount, from, to)
    if (!result) {
      return NextResponse.json({ error: 'Could not convert currency' }, { status: 500 })
    }
    return NextResponse.json(result)
  }

  const rates = await getExchangeRates(from)
  if (!rates) {
    return NextResponse.json({ error: 'Could not fetch exchange rates' }, { status: 500 })
  }
  return NextResponse.json(rates)
}
