"use client"

import { useState } from "react"

export function SuitcaseDisplay() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSuitcaseClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">CRAZY LOST AND FOUND SUITCASE</h1>

      <div
        className={`cursor-pointer transition-transform duration-300 hover:scale-105 ${
          isAnimating ? "suitcase-bounce" : ""
        }`}
        onClick={handleSuitcaseClick}
      >
        <svg width="200" height="150" viewBox="0 0 200 150" className="drop-shadow-lg">
          {/* Suitcase Body */}
          <rect x="20" y="40" width="160" height="90" rx="8" fill="#D4A574" stroke="#8B4513" strokeWidth="2" />

          {/* Suitcase Lid */}
          <rect x="20" y="25" width="160" height="20" rx="8" fill="#E6B887" stroke="#8B4513" strokeWidth="2" />

          {/* Handle */}
          <rect x="85" y="15" width="30" height="8" rx="4" fill="#654321" />

          {/* Latches */}
          <rect x="40" y="35" width="12" height="8" rx="2" fill="#C0C0C0" />
          <rect x="148" y="35" width="12" height="8" rx="2" fill="#C0C0C0" />

          {/* Corner Reinforcements */}
          <circle cx="30" cy="50" r="4" fill="#8B4513" />
          <circle cx="170" cy="50" r="4" fill="#8B4513" />
          <circle cx="30" cy="120" r="4" fill="#8B4513" />
          <circle cx="170" cy="120" r="4" fill="#8B4513" />

          {/* Decorative Straps */}
          <rect x="15" y="70" width="170" height="4" fill="#654321" />
          <rect x="15" y="100" width="170" height="4" fill="#654321" />

          {/* Lock */}
          <rect x="95" y="60" width="10" height="15" rx="2" fill="#FFD700" />
          <circle cx="100" cy="67" r="2" fill="#FFA500" />
        </svg>
      </div>

      <p className="text-lg text-muted-foreground max-w-md text-center">
        Click to buy a mystery suitcase and discover amazing prizes!
      </p>
    </div>
  )
}
