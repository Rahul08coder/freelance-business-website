// site.js mein icon sirf ek naam (string) hai, jaise 'Globe'.
// Yeh file us naam ko asli Lucide icon se jodti hai.
// Naya icon chahiye toh yahan import karo aur iconMap mein add karo.

import {
  Globe,
  LayoutTemplate,
  Code,
  Layers,
  Bug,
  Smartphone,
  Plug,
  Database,
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
  MessageSquare,
  Clock,
  LifeBuoy,
}

// Naam se icon deta hai. Naam galat ho toh Code icon deta hai, taaki page crash na ho.
export function getIcon(name) {
  return iconMap[name] || Code
}