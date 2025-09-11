"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WaterIntakeTrackerProps {
  currentIntake: number
  onIntakeUpdate: (newIntake: number) => void
}

export function WaterIntakeTracker({ currentIntake, onIntakeUpdate }: WaterIntakeTrackerProps) {
  const { toast } = useToast()

  const addWater = (amount: number) => {
    const newIntake = currentIntake + amount
    onIntakeUpdate(newIntake)

    toast({
      title: `Added ${amount}ml! 💧`,
      description: `Total intake: ${newIntake}ml`,
    })
  }

  const removeWater = (amount: number) => {
    const newIntake = Math.max(0, currentIntake - amount)
    onIntakeUpdate(newIntake)

    toast({
      title: `Removed ${amount}ml`,
      description: `Total intake: ${newIntake}ml`,
    })
  }

  const quickAmounts = [250, 500, 750]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Quick Add</h3>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {quickAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            className="h-16 flex-col gap-1 border-primary/20 hover:bg-primary/5 bg-transparent"
            onClick={() => addWater(amount)}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">{amount}ml</span>
          </Button>
        ))}
      </div>

      {/* Custom Amount Controls */}
      <Card className="border-muted">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => removeWater(100)} disabled={currentIntake === 0}>
              <Minus className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Custom Amount</p>
              <p className="text-lg font-bold">100ml</p>
            </div>

            <Button variant="outline" size="icon" onClick={() => addWater(100)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
