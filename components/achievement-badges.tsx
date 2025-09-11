"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Droplets, Target, Zap } from "lucide-react"

interface AchievementBadgesProps {
  currentIntake: number
}

export function AchievementBadges({ currentIntake }: AchievementBadgesProps) {
  const achievements = [
    {
      id: "first-drop",
      title: "First Drop",
      description: "Log your first water intake",
      icon: Droplets,
      unlocked: currentIntake > 0,
      reward: "10 AQT tokens",
    },
    {
      id: "half-way",
      title: "Halfway Hero",
      description: "Reach 50% of daily goal",
      icon: Target,
      unlocked: currentIntake >= 1000,
      reward: "Hydration NFT #001",
    },
    {
      id: "goal-crusher",
      title: "Goal Crusher",
      description: "Complete daily hydration goal",
      icon: Trophy,
      unlocked: currentIntake >= 2000,
      reward: "Premium Badge NFT",
    },
    {
      id: "overachiever",
      title: "Overachiever",
      description: "Exceed daily goal by 25%",
      icon: Zap,
      unlocked: currentIntake >= 2500,
      reward: "50 AQT tokens",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-muted"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      achievement.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`font-medium text-sm ${
                          achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    <p className="text-xs font-medium text-secondary">🎁 {achievement.reward}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
