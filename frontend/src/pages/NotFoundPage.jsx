import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page">
      <h1>Page not found</h1>
      <p className="page-subtitle">The page you are looking for does not exist.</p>
      <Link to="/">Back to Home</Link>
    </section>
  )
}

export default NotFoundPage