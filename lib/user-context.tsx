"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface SavedFlight {
  id: string
  origin: string
  destination: string
  date: string
  airline: string
  price: number
  savedAt: string
}

export interface PriceAlert {
  id: string
  origin: string
  destination: string
  maxPrice: number
  active: boolean
  createdAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: 'documents' | 'packing' | 'preparation' | 'airport'
}

export interface UserData {
  user: User | null
  favoriteAirlines: string[]
  savedFlights: SavedFlight[]
  priceAlerts: PriceAlert[]
  searchHistory: { query: string; date: string }[]
  checklist: ChecklistItem[]
  preferredCurrency: string
  preferredLanguage: string
}

interface UserContextType extends UserData {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  addFavoriteAirline: (airlineId: string) => void
  removeFavoriteAirline: (airlineId: string) => void
  saveFlight: (flight: Omit<SavedFlight, 'id' | 'savedAt'>) => void
  removeSavedFlight: (flightId: string) => void
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void
  removePriceAlert: (alertId: string) => void
  togglePriceAlert: (alertId: string) => void
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  updateChecklist: (items: ChecklistItem[]) => void
  toggleChecklistItem: (itemId: string) => void
  setPreferredCurrency: (currency: string) => void
  setPreferredLanguage: (language: string) => void
}

const defaultUserData: UserData = {
  user: null,
  favoriteAirlines: [],
  savedFlights: [],
  priceAlerts: [],
  searchHistory: [],
  checklist: [],
  preferredCurrency: 'USD',
  preferredLanguage: 'es',
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = 'skycompare_user_data'

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUserData(JSON.parse(stored))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    }
  }, [userData, isHydrated])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in production this would call an API
    const storedUsers = localStorage.getItem('skycompare_users')
    const users = storedUsers ? JSON.parse(storedUsers) : []
    const user = users.find((u: { email: string; password: string }) => 
      u.email === email && u.password === password
    )
    
    if (user) {
      setUserData(prev => ({
        ...prev,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        }
      }))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const storedUsers = localStorage.getItem('skycompare_users')
    const users = storedUsers ? JSON.parse(storedUsers) : []
    
    if (users.find((u: { email: string }) => u.email === email)) {
      return false
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    }
    
    users.push(newUser)
    localStorage.setItem('skycompare_users', JSON.stringify(users))
    
    setUserData(prev => ({
      ...prev,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      }
    }))
    return true
  }

  const logout = () => {
    setUserData(prev => ({ ...prev, user: null }))
  }

  const updateUser = (data: Partial<User>) => {
    setUserData(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null
    }))
  }

  const addFavoriteAirline = (airlineId: string) => {
    setUserData(prev => ({
      ...prev,
      favoriteAirlines: [...new Set([...prev.favoriteAirlines, airlineId])]
    }))
  }

  const removeFavoriteAirline = (airlineId: string) => {
    setUserData(prev => ({
      ...prev,
      favoriteAirlines: prev.favoriteAirlines.filter(id => id !== airlineId)
    }))
  }

  const saveFlight = (flight: Omit<SavedFlight, 'id' | 'savedAt'>) => {
    setUserData(prev => ({
      ...prev,
      savedFlights: [...prev.savedFlights, {
        ...flight,
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
      }]
    }))
  }

  const removeSavedFlight = (flightId: string) => {
    setUserData(prev => ({
      ...prev,
      savedFlights: prev.savedFlights.filter(f => f.id !== flightId)
    }))
  }

  const addPriceAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    setUserData(prev => ({
      ...prev,
      priceAlerts: [...prev.priceAlerts, {
        ...alert,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }]
    }))
  }

  const removePriceAlert = (alertId: string) => {
    setUserData(prev => ({
      ...prev,
      priceAlerts: prev.priceAlerts.filter(a => a.id !== alertId)
    }))
  }

  const togglePriceAlert = (alertId: string) => {
    setUserData(prev => ({
      ...prev,
      priceAlerts: prev.priceAlerts.map(a => 
        a.id === alertId ? { ...a, active: !a.active } : a
      )
    }))
  }

  const addToSearchHistory = (query: string) => {
    setUserData(prev => ({
      ...prev,
      searchHistory: [
        { query, date: new Date().toISOString() },
        ...prev.searchHistory.filter(h => h.query !== query).slice(0, 19)
      ]
    }))
  }

  const clearSearchHistory = () => {
    setUserData(prev => ({ ...prev, searchHistory: [] }))
  }

  const updateChecklist = (items: ChecklistItem[]) => {
    setUserData(prev => ({ ...prev, checklist: items }))
  }

  const toggleChecklistItem = (itemId: string) => {
    setUserData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }))
  }

  const setPreferredCurrency = (currency: string) => {
    setUserData(prev => ({ ...prev, preferredCurrency: currency }))
  }

  const setPreferredLanguage = (language: string) => {
    setUserData(prev => ({ ...prev, preferredLanguage: language }))
  }

  return (
    <UserContext.Provider value={{
      ...userData,
      isLoggedIn: !!userData.user,
      login,
      register,
      logout,
      updateUser,
      addFavoriteAirline,
      removeFavoriteAirline,
      saveFlight,
      removeSavedFlight,
      addPriceAlert,
      removePriceAlert,
      togglePriceAlert,
      addToSearchHistory,
      clearSearchHistory,
      updateChecklist,
      toggleChecklistItem,
      setPreferredCurrency,
      setPreferredLanguage,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
