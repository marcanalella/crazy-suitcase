"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Banana, DollarSign, Plane } from "lucide-react"

export function PrizePool() {
  const prizes = [
    {
      icon: DollarSign,
      name: "Mock USDC",
      amount: "10$",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Plane,
      name: "Ticket NFT",
      amount: "Time to travel!",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Banana,
      name: "Banana NFT",
      amount: "It's a Banana!",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-foreground">Jackpot</CardTitle>
        <p className="text-muted-foreground">Discover what amazing prizes await in your suitcase!</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prizes.map((prize, index) => {
            const Icon = prize.icon
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-4 rounded-lg ${prize.bgColor} border border-border/50`}
              >
                <div className={`p-3 rounded-full ${prize.bgColor} mb-2`}>
                  <Icon className={`h-6 w-6 ${prize.color}`} />
                </div>
                <h3 className="font-bold text-sm text-center">{prize.name}</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">{prize.amount}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
