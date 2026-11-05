// site.js / database mein icon sirf ek naam (string) hota hai, jaise 'Globe'.
// Yeh file us naam ko asli Lucide icon se jodti hai.
// Naya icon chahiye toh yahan import karo, iconMap mein jodo, aur (service ke liye) serviceIconNames mein bhi.
// Backend ka SERVICE_ICONS (server/src/config/constants.js) serviceIconNames se same rakhna.

import {
  Globe,
  LayoutTemplate,
  Code,
  Layers,
  Bug,
  Smartphone,
  Plug,
  Database,
  Palette,
  Server,
  Rocket,
  Wrench,
  Search,
  MessageSquare,
  Clock,
  LifeBuoy,
} from 'lucide-react'

export const iconMap = {
  Globe,
  LayoutTemplate,
  Code,
  Layers,
  Bug,
  Smartphone,
  Plug,
  Database,
  Palette,
  Server,
  Rocket,
  Wrench,
  Search,
  MessageSquare,
  Clock,
  LifeBuoy,
}

// Admin mein service ke liye chunne wale icons
export const serviceIconNames = [
  'Globe',
  'LayoutTemplate',
  'Code',
  'Layers',
  'Bug',
  'Smartphone',
  'Plug',
  'Database',
  'Palette',
  'Server',
  'Rocket',
  'Wrench',
  'Search',
]

// Naam se icon deta hai. Naam galat ho toh Code icon deta hai, taaki page crash na ho.
export function getIcon(name) {
  return iconMap[name] || Code
}