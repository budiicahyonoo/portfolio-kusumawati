"use client"

import { useEffect, useState } from "react"

export function AmbientBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="ambient-scene" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="noise" />
    </div>
  )
}