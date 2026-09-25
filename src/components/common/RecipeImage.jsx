import React, { useState } from 'react'
import { APPROVED_IMAGES } from '../../approved-images.js'

export default function RecipeImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  const finalSrc = !src || failed ? APPROVED_IMAGES.placeholder : src
  return (
    <img
      className={className}
      src={finalSrc}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
