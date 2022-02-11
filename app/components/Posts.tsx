import React, { useEffect, useReducer } from 'react'
import { fetchMainPosts, Item } from '../utils/api'
import Loading from './Loading'
import PostsList from './PostsList'

interface PostsReducerState {
  posts: null | Item[];
  error: string | null;
  loading: boolean;
}

interface FetchAction {
  type: "loading";
}

interface SuccessAction {
  type: "posts";
  posts: Item[];
}

interface ErrorAction {
  type: 'error';
  message: string;
}

type PostsReducerActions = FetchAction | SuccessAction | ErrorAction;

function postsReducer(state: PostsReducerState, action: PostsReducerActions): PostsReducerState {
  switch(action.type) {
    case "posts": {
      return {
        posts: action.posts,
        loading: false,
        error: null
      }
    } 
    case "error": {
      return {
        posts: null,
        error: action.message,
        loading: false
      }
    }
    case "loading": {
      return {
        posts: null,
        error: null,
        loading: true,
      }
    }
    default: throw new Error(`${action.type} is not a valid action`)
  }
}

export default function Posts({type} : { type: 'top'|'new' }) {
  const [state, dispatch] = useReducer(postsReducer, {
    posts: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    handleFetch()
  }, [type])

  function handleFetch() {
    dispatch({type: "loading"})

    fetchMainPosts(type)
      .then((posts) => dispatch({type: "posts", posts}))
      .catch(({ message }) => dispatch({type: "error", message}))
  }

  const { posts, error, loading } = state

    if (loading === true) {
      return <Loading />
    }

    if (error) {
      return <p className='center-text error'>{error}</p>
    }

    return <PostsList posts={posts} />
  }