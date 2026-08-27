import { useEffect, useState } from 'react'
import api from '@/lib/api'

export const useLocationSuggestions = (query, enabled = true) => {
  const [state, setState] = useState({ forQuery: '', items: [], loading: false })

  useEffect(() => {
    const q = query.trim()
    if (!enabled || q.length < 3) return

    const timer = setTimeout(async () => {
      setState({ forQuery: q, items: [], loading: true })
      try {
        const { data } = await api.get('/maps/get-suggestions', {
          params: { input: q },
        })
        setState({ forQuery: q, items: data.suggestions || [], loading: false })
      } catch {
        setState({ forQuery: q, items: [], loading: false })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query, enabled])

  const isActive = enabled && query.trim().length >= 3 && state.forQuery === query.trim()
  return {
    suggestions: isActive ? state.items : [],
    loading: isActive && state.loading,
  }
}
