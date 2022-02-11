import React from 'react'
import { Comment as CommentType } from '../utils/api'
import PostMetaInfo from './PostMetaInfo'


export default function Comment({ comment }: { comment: Pick<CommentType, "by" | "time" | "id" | "text">; }) {
  return (
    <div className='comment'>
      <PostMetaInfo
        by={comment.by}
        time={comment.time}
        id={comment.id}
      />
      <p dangerouslySetInnerHTML={{__html: comment.text}} />
    </div>
  )
}