import { useEffect, useState } from 'react'
import { SettingsContext } from './settingsContext.js'
import { siteConfig } from '../config/site.js'
import { apiGet } from '../services/api.js'

// Shuru mein site.js ki values (taaki site turant dikhe), phir API se aate hi nayi values.
// API na chale (backend so raha ho) tab bhi site kaam karti hai, purani values ke saath.
const fallbackSettings = {
  email: siteConfig.email,
  location: siteConfig.location,
  socials: siteConfig.socials,
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings)

  useEffect(() => {
    const controller = new AbortController()

    apiGet('/settings', { signal: controller.signal })
      .then((data) => {
        // settings: null ka matlab admin ne abhi kuch save nahi kiya
        if (!data.settings) return

        setSettings({
          email: data.settings.email || fallbackSettings.email,
          location: data.settings.location,
          socials: data.settings.socials,
        })
      })
      .catch(() => {
        // Koi dikkat ho toh built-in values hi rehne do
      })

    return () => controller.abort()
  }, [])

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}