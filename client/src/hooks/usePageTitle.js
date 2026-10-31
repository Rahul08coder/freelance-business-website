import { useEffect } from 'react'
import { siteConfig } from '../config/site.js'

// Browser tab ka title set karta hai.
// usePageTitle('About')  ->  "About | DevLance"
// usePageTitle()         ->  "DevLance | Websites and web apps built for your business"
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${siteConfig.brandName}`
      : `${siteConfig.brandName} | ${siteConfig.tagline}`
  }, [title])
}