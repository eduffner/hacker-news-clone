import React, { useEffect, useState, CSSProperties } from 'react'

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  } as CSSProperties
}

export default function Loading({text='Loading', speed=300}) {
  const [content, setContent] = useState(text)

  useEffect(() => {
    const id = window.setInterval(() => {
      setContent((content) => {
        return content === `${text}...`
          ? text
          : `${content}.`
        })
    }, speed)

    return () => window.clearInterval(id)
  }, [speed, text])

  return (
    <p style={styles.content}>
      {content}
    </p>
  )
}