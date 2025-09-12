"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Check, Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"

export function WalletConnection() {
  const { isConnected, address, balance, isLoading, isCorrectNetwork, connect, disconnect, switchNetwork } = useWallet()
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      await connect()
      toast({
        title: "Wallet Connected! 🎉",
        description: "Your crypto wallet is now connected to CRAZY LOST AND FOUND SUITCASE.",
      })
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been safely disconnected.",
    })
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork()
      toast({
        title: "Network Switched",
        description: "Successfully switched to Base Sepolia network.",
      })
    } catch (error: any) {
      toast({
        title: "Network Switch Failed",
        description: error?.message || "Failed to switch network",
        variant: "destructive",
      })
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col text-xs text-right">
          <span className="text-muted-foreground">Balance:</span>
          <span className="font-mono text-primary">{balance} ETH</span>
        </div>

        {isCorrectNetwork ? (
          <Badge variant="secondary" className="bg-green-600 text-white border-green-700 font-semibold">
            <Check className="h-3 w-3 mr-1" />
            Base Sepolia
          </Badge>
        ) : (
          <Button size="sm" variant="destructive" onClick={handleSwitchNetwork} className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Switch Network
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
      {isLoading ? "Connecting..." : "CONNECT WALLET"}
    </Button>
  )
}
