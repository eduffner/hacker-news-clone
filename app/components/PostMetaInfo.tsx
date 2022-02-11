import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import ThemeContext from '../contexts/theme'
import { Item } from '../utils/api'

export default function PostMetaInfo ({ by, time, id, descendants }: Partial<Item>) {
  const theme = useContext(ThemeContext)

  return (
    <div className={`meta-info-${theme}`}>
      <span>by <Link to={`/user?id=${by}`}>{by}</Link></span>
      {time && <span> on {formatDate(time)}</span>}
      {typeof descendants === 'number' && (
        <span>
          with <Link to={`/post?id=${id}`}>{descendants}</Link> comments
        </span>
      )}
    </div>
  )
}