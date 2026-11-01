import { useCallback, useEffect, useState } from 'react'
import { apiGet } from '../services/api.js'

// Ek path se data laata hai. Deta hai: { data, loading, error, retry }
//   const { data, loading, error, retry } = useFetch('/services')
export function useFetch(path) {
  const [result, setResult] = useState({ path: null, data: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    apiGet(path, { signal: controller.signal })
      .then((data) => setResult({ path, data, error: null }))
      .catch((error) => {
        // Page chhodne par request cancel hoti hai, wo error nahi hai
        if (error.name === 'AbortError') return
        setResult({ path, data: null, error })
      })

    return () => controller.abort()
  }, [path, attempt])

  const retry = useCallback(() => {
    setResult({ path: null, data: null, error: null })
    setAttempt((count) => count + 1)
  }, [])

  // Result kisi purane path ka ho toh usse "loading" maano
  const isCurrent = result.path === path

  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: !isCurrent,
    retry,
  }
}