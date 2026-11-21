import { useContext } from 'react'
import { SettingsContext } from '../context/settingsContext.js'

// { email, location, socials: { github, linkedin, twitter } }
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider')
  }
  return context
}