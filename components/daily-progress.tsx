"use client"

import { Progress } from "@/components/ui/progress"
import { Droplets } from "lucide-react"

interface DailyProgressProps {
  current: number
  goal: number
  percentage: number
}

export function DailyProgress({ current, goal, percentage }: DailyProgressProps) {
  const isGoalReached = percentage >= 100

  return (
    <div className="space-y-4">
      {/* Progress Circle Visual */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
            <div className="text-center">
              <Droplets
                className={`h-8 w-8 mx-auto mb-1 ${isGoalReached ? "text-primary" : "text-muted-foreground"}`}
              />
              <p className="text-2xl font-bold">{Math.round(percentage)}%</p>
            </div>
          </div>
          {isGoalReached && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={percentage} className="h-3" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{current}ml</span>
          <span className="font-medium text-primary">{goal}ml goal</span>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {isGoalReached ? (
          <p className="text-primary font-medium">🎉 Goal achieved! Great job!</p>
        ) : (
          <p className="text-muted-foreground">{goal - current}ml to go - you've got this! 💪</p>
        )}
      </div>
    </div>
  )
}
