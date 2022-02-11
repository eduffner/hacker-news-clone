import React, { useEffect, useReducer } from 'react'
import queryString from 'query-string'
import { fetchUser, fetchPosts, User, Post } from '../utils/api'
import Loading from './Loading'
import { formatDate } from '../utils/helpers'
import PostsList from './PostsList'

interface UserReducerState {
  user: null | User;
  loadingUser: boolean;
  posts: null | Post[];
  loadingPosts: boolean;
  error: null | string,
}

interface FetchAction {
  type: 'fetch'
}

interface UserAction {
  type: 'user';
  user: User;
}

interface PostsAction {
  type: 'posts';
  posts: Post[];
}

interface ErrorAction {
  type: 'error';
  message: string;
}

type UserReducerActions = FetchAction | UserAction | PostsAction | ErrorAction

function userReducer(state:UserReducerState, action: UserReducerActions):UserReducerState {
  switch (action.type) {
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
        user: null,
        posts: null,
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

export default function UserComponent({ location }: { location: { search: string }}) {
  const { id } = queryString.parse(location.search) as { id: string };

  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    posts: null, 
    loadingUser: true,
    loadingPosts: true,
    error: null
  })

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
      {loadingUser === true || !user
        ? <Loading text='Fetching User' />
        : <React.Fragment>
          <h1 className='header'>{user.id}</h1>
          <div className='meta-info-light'>
            <span>
              joined <b>{formatDate(user.created)}</b>
            </span>
            <span>
              has <b>{user.karma.toLocaleString()}</b> karma
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: user.about }} />
        </React.Fragment>
      }
      {loadingPosts === true
        ? loadingUser === false && <Loading text='Fetching posts' />
        : <React.Fragment>
          <h2>Posts</h2>
          <PostsList posts={posts} />
        </React.Fragment>
      }
    </React.Fragment>
  );
}
