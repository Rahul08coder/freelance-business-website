import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { fetchMe, loginAdmin, logoutAdmin } from '../services/adminService.js'
import { setCsrfToken, setUnauthorizedHandler } from '../services/api.js'

// status: 'loading' (check ho raha hai) | 'authenticated' | 'unauthenticated'
export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', admin: null })

  const clearSession = useCallback(() => {
    setCsrfToken(null)
    setState({ status: 'unauthenticated', admin: null })
  }, [])

  // Kisi admin request par 401 aaye toh yahan login state saaf ho jati hai
  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    return () => setUnauthorizedHandler(null)
  }, [clearSession])

  // Page khulte hi dekho ki session abhi bhi chal raha hai ya nahi
  useEffect(() => {
    let cancelled = false

    fetchMe()
      .then((data) => {
        if (cancelled) return
        setCsrfToken(data.csrfToken)
        setState({ status: 'authenticated', admin: data.admin })
      })
      .catch(() => {
        if (!cancelled) clearSession()
      })

    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(async (email, password) => {
    const data = await loginAdmin(email, password)
    setCsrfToken(data.csrfToken)
    setState({ status: 'authenticated', admin: data.admin })
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutAdmin()
    } catch {
      // Server tak na pahunche (ya session pehle hi khatam) tab bhi screen se logout kar do
    }
    clearSession()
  }, [clearSession])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}