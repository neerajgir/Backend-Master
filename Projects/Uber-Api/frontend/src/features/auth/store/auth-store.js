import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      captain: null,
      setUser: (user) => set({ user }),
      setCaptain: (captain) => set({ captain }),
      clearAuth: () => set({ user: null, captain: null }),
    }),
    { name: 'uber-auth' }
  )
)
