"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Target, Palette, Shield, Wallet, Trophy, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [dailyGoal, setDailyGoal] = useState(2000)
  const [notifications, setNotifications] = useState(true)
  const [reminderInterval, setReminderInterval] = useState(60)
  const [userName, setUserName] = useState("Hydration Hero")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings Saved! ✅",
      description: "Your preferences have been updated successfully.",
    })
    onClose()
  }

  const userStats = {
    totalDays: 45,
    currentStreak: 7,
    longestStreak: 12,
    totalLiters: 87.5,
    nftsEarned: 3,
    tokensEarned: 450,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile & Settings
          </DialogTitle>
          <DialogDescription>Manage your profile, hydration goals, and app preferences</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/diverse-user-avatars.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="username">Display Name</Label>
                  <Input
                    id="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* User Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-sm text-muted-foreground">Total Days</p>
                  <p className="font-bold">{userStats.totalDays}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Trophy className="h-4 w-4 mx-auto mb-1 text-secondary" />
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="font-bold">{userStats.currentStreak}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Target className="h-4 w-4 mx-auto mb-1 text-accent" />
                  <p className="text-sm text-muted-foreground">Total Liters</p>
                  <p className="font-bold">{userStats.totalLiters}L</p>
                </div>
              </div>

              {/* Blockchain Rewards */}
              <div className="pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  Blockchain Rewards
                </h4>
                <div className="flex gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {userStats.nftsEarned} NFTs Earned
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    {userStats.tokensEarned} AQT Tokens
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hydration Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-4 w-4" />
                Hydration Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="daily-goal">Daily Goal (ml)</Label>
                <Input
                  id="daily-goal"
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  min="500"
                  max="5000"
                  step="250"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">Recommended: 2000ml (2L) per day</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Hydration Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to drink water throughout the day</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>

              {notifications && (
                <div>
                  <Label htmlFor="reminder-interval">Reminder Interval (minutes)</Label>
                  <Input
                    id="reminder-interval"
                    type="number"
                    value={reminderInterval}
                    onChange={(e) => setReminderInterval(Number(e.target.value))}
                    min="15"
                    max="240"
                    step="15"
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-4 w-4" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Achievement Animations</Label>
                  <p className="text-sm text-muted-foreground">Show celebratory animations for achievements</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app by sharing anonymous usage data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Blockchain Transactions</Label>
                  <p className="text-sm text-muted-foreground">Enable automatic reward claiming to your wallet</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
