import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Page badalne par scroll upar le jata hai.
// Iske bina, neeche scroll karke link click karo toh naya page bhi neeche se khulta hai.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop