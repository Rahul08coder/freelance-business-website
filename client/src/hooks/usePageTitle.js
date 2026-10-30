import { useEffect } from 'react'
import { siteConfig } from '../config/site.js'

// Browser tab ka title set karta hai, jaise "About | DevLance".
// Har page ke andar usePageTitle('About') likhna hota hai.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.brandName}` : siteConfig.brandName
  }, [title])
}