import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from '../utils/api'

export default function Title ({ url, title, id }: Partial<Item>) {
  return url
    ? <a className='link' href={url}>{title}</a>
    : <Link className='link' to={`/post?id=${id}`}>{title}</Link>
}