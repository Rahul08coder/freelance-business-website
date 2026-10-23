import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">404: Page not found</h1>
      <Link to="/" className="mt-4 inline-block underline">
        Go back home
      </Link>
    </div>
  )
}

export default NotFound