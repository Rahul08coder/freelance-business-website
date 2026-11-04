import { useEffect } from 'react'

// Page par "noindex" lagata hai, taaki Google admin pages ko search results mein na dikhaye
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)

    return () => meta.remove()
  }, [])
}