import React, { useEffect, useReducer } from 'react'
import queryString from 'query-string'
import { fetchUser, fetchPosts } from '../utils/api'
import Loading from './Loading'
import { formatDate } from '../utils/helpers'
import PostsList from './PostsList'

const userReducer = (state, action) => {
  switch(action.type) {
    case "user": {
      return { ...state, user: action.user, loadingUser: false}
    }
    case "posts": {
      return {
        ...state,
        posts: action.posts,
        loadingPosts: false,
        error: null
      }
    }
    case "error": {
      return {
        error: action.message,
        loadingUser: false,
        loadingPosts: false
      }
    }
    default: {
      throw new Error(`${action.type} is not a valid action.`)
    }
  }
}

export default function User({location}) {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    posts: null, 
    loadingUser: true,
    loadingPosts: true,
    error: null
  })
  const { id } = queryString.parse(location.search)

  useEffect(() => {
    fetchUser(id)
      .then((user) => {
        dispatch({type: "user", user})

        return fetchPosts(user.submitted.slice(0, 30))
      })
      .then((posts) => dispatch({type: "posts", posts}))
      .catch(({ message }) => dispatch({type: "error", message}))
    },[id])

    const { user, posts, loadingUser, loadingPosts, error } = state

    if (error) {
      return <p className='center-text error'>{error}</p>
    }

    return (
      <React.Fragment>
        {loadingUser === true
          ? <Loading text='Fetching User' />
          : <React.Fragment>
              <h1 className='header'>{user.id}</h1>
              <div className='meta-info-light'>
                <span>joined <b>{formatDate(user.created)}</b></span>
                <span>has <b>{user.karma.toLocaleString()}</b> karma</span>
              </div>
              <p dangerouslySetInnerHTML={{__html: user.about}} />
            </React.Fragment>}
        {loadingPosts === true
          ? loadingUser === false && <Loading text='Fetching posts'/>
          : <React.Fragment>
              <h2>Posts</h2>
              <PostsList posts={posts} />
            </React.Fragment>}
      </React.Fragment>
    )
}
