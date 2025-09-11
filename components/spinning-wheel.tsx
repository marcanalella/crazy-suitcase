"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, X, RotateCcw } from "lucide-react"
import { useState } from "react"

interface Prize {
  type: string
  name: string
  value: string
  rarity: string
  color: string
  probability: number
}

interface SpinningWheelProps {
  isOpen: boolean
  onClose: () => void
  onPrizeWon: (prize: Prize | null) => void
}

export function SpinningWheel({ isOpen, onClose, onPrizeWon }: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<Prize | null>(null)
  const [showResult, setShowResult] = useState(false)

  const prizes: Prize[] = [
    { type: "Nothing", name: "Nothing", value: "Try Again!", rarity: "Common", color: "#6B7280", probability: 20 },
    { type: "Crypto", name: "USDC", value: "1 USDC", rarity: "Common", color: "#10B981", probability: 15 },
    { type: "Crypto", name: "USDC", value: "5 USDC", rarity: "Common", color: "#059669", probability: 12 },
    { type: "Crypto", name: "ETH", value: "0.001 ETH", rarity: "Uncommon", color: "#627EEA", probability: 10 },
    { type: "NFT", name: "Ticket NFT", value: "0.02 ETH", rarity: "Uncommon", color: "#8B5CF6", probability: 10 },
    { type: "Crypto", name: "USDC", value: "10 USDC", rarity: "Uncommon", color: "#047857", probability: 8 },
    { type: "NFT", name: "Banana NFT", value: "0.05 ETH", rarity: "Rare", color: "#F59E0B", probability: 7 },
    { type: "Crypto", name: "ETH", value: "0.005 ETH", rarity: "Rare", color: "#4F46E5", probability: 6 },
    { type: "Crypto", name: "USDC", value: "25 USDC", rarity: "Rare", color: "#065F46", probability: 5 },
    { type: "NFT", name: "Ruby NFT", value: "0.08 ETH", rarity: "Epic", color: "#DC2626", probability: 3 },
    { type: "NFT", name: "Diamond NFT", value: "0.1 ETH", rarity: "Epic", color: "#7C3AED", probability: 2 },
    { type: "Crypto", name: "ETH", value: "0.01 ETH", rarity: "Epic", color: "#1E40AF", probability: 1.5 },
    {
      type: "NFT",
      name: "Golden Suitcase",
      value: "0.25 ETH",
      rarity: "Legendary",
      color: "#F59E0B",
      probability: 0.4,
    },
    { type: "Crypto", name: "ETH", value: "0.05 ETH", rarity: "Legendary", color: "#7C2D12", probability: 0.1 },
  ]

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowResult(false)
    setResult(null)

    // Generate random result based on probabilities
    const random = Math.random() * 100
    let cumulative = 0
    let selectedPrize: Prize | null = null

    for (const prize of prizes) {
      cumulative += prize.probability
      if (random <= cumulative) {
        selectedPrize = prize
        break
      }
    }

    // Calculate rotation (multiple full spins + final position)
    const segmentAngle = 360 / prizes.length
    const prizeIndex = prizes.findIndex((p) => p === selectedPrize)
    const finalAngle = prizeIndex * segmentAngle + segmentAngle / 2
    const spins = 5 + Math.random() * 3 // 5-8 full rotations
    const totalRotation = rotation + spins * 360 + (360 - finalAngle)

    setRotation(totalRotation)

    // Show result after animation
    setTimeout(() => {
      setResult(selectedPrize)
      setShowResult(true)
      setIsSpinning(false)
      onPrizeWon(selectedPrize)
    }, 3000)
  }

  const handleClose = () => {
    setShowResult(false)
    setResult(null)
    setRotation(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <div className="text-center space-y-6 p-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-foreground">CRAZY WHEEL</h1>
            <p className="text-muted-foreground">Spin to win amazing prizes!</p>
          </div>

          {/* Spinning Wheel */}
          <div className="relative mx-auto w-80 h-80">
            {/* Wheel Container */}
            <div className="relative w-full h-full">
              {/* Wheel */}
              <svg
                width="320"
                height="320"
                viewBox="0 0 320 320"
                className="absolute inset-0"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 3s cubic-bezier(0.23, 1, 0.32, 1)" : "none",
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index
                  const nextAngle = (360 / prizes.length) * (index + 1)
                  const startAngle = (angle * Math.PI) / 180
                  const endAngle = (nextAngle * Math.PI) / 180

                  const x1 = 160 + 140 * Math.cos(startAngle)
                  const y1 = 160 + 140 * Math.sin(startAngle)
                  const x2 = 160 + 140 * Math.cos(endAngle)
                  const y2 = 160 + 140 * Math.sin(endAngle)

                  const largeArcFlag = nextAngle - angle > 180 ? 1 : 0

                  const pathData = [
                    `M 160 160`,
                    `L ${x1} ${y1}`,
                    `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `Z`,
                  ].join(" ")

                  const textAngle = angle + 360 / prizes.length / 2
                  const textX = 160 + 80 * Math.cos((textAngle * Math.PI) / 180)
                  const textY = 160 + 80 * Math.sin((textAngle * Math.PI) / 180)

                  return (
                    <g key={index}>
                      <path d={pathData} fill={prize.color} stroke="#ffffff" strokeWidth="2" opacity="0.9" />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      >
                        {prize.name}
                      </text>
                    </g>
                  )
                })}

                {/* Center circle */}
                <circle cx="160" cy="160" r="20" fill="#1f2937" stroke="#ffffff" strokeWidth="3" />
              </svg>

              {/* Pointer */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          {!showResult && (
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isSpinning ? (
                <>
                  <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                  Spinning...
                </>
              ) : (
                "SPIN THE WHEEL!"
              )}
            </Button>
          )}

          {/* Result Display */}
          {showResult && result && (
            <Card className="border-2" style={{ borderColor: result.color, backgroundColor: `${result.color}15` }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6" style={{ color: result.color }} />
                  <span className="text-lg font-black">
                    {result.type === "Nothing" ? "BETTER LUCK NEXT TIME!" : "YOU WON!"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{result.name}</h3>
                  <p className="text-lg font-bold" style={{ color: result.color }}>
                    {result.value}
                  </p>
                  {result.type !== "Nothing" && (
                    <div className="text-sm text-muted-foreground">Rarity: {result.rarity}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          {showResult && (
            <Button onClick={handleClose} variant="outline" className="w-full bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
