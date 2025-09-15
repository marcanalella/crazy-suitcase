"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Sparkles, X } from "lucide-react"
import { useState, useEffect } from "react"

interface Prize {
  type: string
  name: string
  value: string
  rarity?: string
  amount?: string
}

interface PrizeRevealModalProps {
  isOpen: boolean
  onClose: () => void
  prize: Prize | null
}

export function PrizeRevealModal({ isOpen, onClose, prize }: PrizeRevealModalProps) {
  const [showPrize, setShowPrize] = useState(false)

  useEffect(() => {
    if (isOpen && prize) {
      // Delay prize reveal for dramatic effect
      const timer = setTimeout(() => setShowPrize(true), 1000)
      return () => clearTimeout(timer)
    } else {
      setShowPrize(false)
    }
  }, [isOpen, prize])

  if (!prize) return null

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-500 border-gray-500/20 bg-gray-500/5"
      case "Rare":
        return "text-blue-500 border-blue-500/20 bg-blue-500/5"
      case "Epic":
        return "text-purple-500 border-purple-500/20 bg-purple-500/5"
      case "Legendary":
        return "text-orange-500 border-orange-500/20 bg-orange-500/5"
      default:
        return "text-primary border-primary/20 bg-primary/5"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center space-y-6 p-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground">YOU WON!</h1>
            <p className="text-muted-foreground">Congratulations on your prize!</p>
          </div>

          {/* Suitcase Animation */}
          <div className="relative">
            <div className="suitcase-bounce">
              <svg width="120" height="90" viewBox="0 0 120 90" className="mx-auto drop-shadow-lg">
                {/* Open Suitcase */}
                <rect x="10" y="30" width="100" height="50" rx="5" fill="#D4A574" stroke="#8B4513" strokeWidth="2" />
                <rect x="10" y="20" width="100" height="15" rx="5" fill="#E6B887" stroke="#8B4513" strokeWidth="2" />

                {/* Sparkles */}
                {showPrize && (
                  <>
                    <circle cx="30" cy="15" r="2" fill="#FFD700" className="animate-pulse" />
                    <circle cx="90" cy="25" r="1.5" fill="#FFD700" className="animate-pulse" />
                    <circle cx="70" cy="10" r="1" fill="#FFD700" className="animate-pulse" />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Prize Reveal */}
          {showPrize ? (
            <Card className={`prize-reveal ${getRarityColor(prize.rarity)}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-secondary" />
                  <span className="text-lg font-black">PRIZE</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{prize.name}</h3>
                  {prize.rarity && (
                    <div className="flex items-center justify-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-bold">{prize.rarity}</span>
                    </div>
                  )}
                  <p className="text-lg font-bold text-secondary">
                    {prize.amount ? `${prize.amount} ` : ""}
                    {prize.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Close Button */}
          {showPrize && (
            <Button onClick={onClose} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
