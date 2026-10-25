import { Link } from 'react-router-dom'
import './MoodCard.css'

function MoodCard({ mood }) {
  return (
    <Link
      to={`/browse?mood=${encodeURIComponent(mood.id)}`}
      className="mood-card"
      style={{ background: `linear-gradient(135deg, ${mood.from}, ${mood.to})` }}
    >
      {mood.label}
    </Link>
  )
}

export default MoodCard