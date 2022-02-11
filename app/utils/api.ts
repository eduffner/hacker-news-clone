const api = `https://hacker-news.firebaseio.com/v0`
const json = '.json?print=pretty'

export interface Item {
  dead: boolean;
  deleted: boolean;
  type: PostTypeOption;
  by: string;
  time: number;
  id: string;
  text: string;
  descendants: unknown;
  url: string;
  title: string;
  kids: string[];
}

export type PostTypeOption = "comment" | "story";

export interface Comment extends Item {
  type: 'comment'
};

export interface Post extends Item {
  type: 'story'
};


function removeDead (posts: Item[]): Item[] {
  return posts.filter(Boolean).filter(({ dead }) => dead !== true)
}

function removeDeleted (posts: Item[]): Item[] {
  return posts.filter(({ deleted }) => deleted !== true)
}

function onlyComments (posts: Item[]): Comment[]{
  return posts.filter(({ type }) => type === 'comment') as Comment[]
}

function onlyPosts (posts: Item[]): Post[] {
  return posts.filter(({ type }) => type === 'story') as Post[]
}

export function fetchItem (id: string): Promise<Post> {
  return fetch(`${api}/item/${id}${json}`)
    .then((res) => res.json())
}

export function fetchComments (ids: string[]): Promise<Comment[]> {
  return Promise.all(ids.map(fetchItem))
    .then((comments) => onlyComments(removeDeleted(removeDead(comments))))
}

export function fetchMainPosts (type: string): Promise<Post[]> {
  return fetch(`${api}/${type}stories${json}`)
    .then((res) => res.json())
    .then((ids) => {
      if (!ids) {
        throw new Error(`There was an error fetching the ${type} posts.`)
      }

      return ids.slice(0, 50)
    })
    .then((ids: string[]) => Promise.all(ids.map(fetchItem)))
    .then((posts) => onlyPosts(removeDeleted(removeDead(posts))))
}

export interface User {
  id: string;
  submitted: string[];
  created: number;
  karma: number;
  about: string;
}

export function fetchUser (id: string): Promise<User> {
  return fetch(`${api}/user/${id}${json}`)
    .then((res) => res.json())
}

export function fetchPosts (ids: string[]): Promise<Post[]> {
  return Promise.all(ids.map(fetchItem))
    .then((posts) => onlyPosts(removeDeleted(removeDead(posts))))
}