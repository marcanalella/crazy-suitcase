"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Gift } from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import { SuitcaseDisplay } from "@/components/suitcase-display"
import { PrizePool } from "@/components/prize-pool"
import { InventoryModal } from "@/components/inventory-modal"
import { PrizeRevealModal } from "@/components/prize-reveal-modal"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"

const SUITCASE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

export default function HomePage() {
  const { isConnected, isCorrectNetwork } = useWallet()
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [isPrizeRevealOpen, setIsPrizeRevealOpen] = useState(false)
  const [lastPrize, setLastPrize] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleBuySuitcase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first!",
        variant: "destructive",
      })
      return
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Base Sepolia testnet!",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      toast({
        title: "Transaction Submitted! 🚀",
        description: "Your suitcase purchase is being processed...",
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const prizes = [
        { type: "Crypto", name: "USDC", amount: "50", value: "$50", rarity: "Common" },
        { type: "NFT", name: "Ticket NFT", value: "0.02 ETH", rarity: "Uncommon" },
        { type: "NFT", name: "Banana NFT", value: "0.05 ETH", rarity: "Rare" },
      ]

      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)]
      setLastPrize(randomPrize)
      setIsPrizeRevealOpen(true)

      toast({
        title: "Suitcase Purchased! 🎉",
        description: "Check your prize!",
      })

      // Uncomment this when contracts are deployed:
      // const txHash = await sendTransaction(SUITCASE_CONTRACT_ADDRESS, "0.01")
      // console.log("Transaction hash:", txHash)
    } catch (error: any) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase Failed",
        description: error?.message || "There was an error processing your purchase.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-black text-primary">CRAZY SUITCASE</h1>
          </div>
          <WalletConnection />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Suitcase Display */}
        <div className="text-center space-y-6">
          <SuitcaseDisplay />

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <Button
              onClick={handleBuySuitcase}
              className="h-14 text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-lg border-2 border-primary/30"
              disabled={!isConnected || !isCorrectNetwork || isProcessing}
            >
              {isProcessing ? "Processing..." : "BUY SUITCASE - 0.01 ETH"}
            </Button>

            <Button
              onClick={() => setIsInventoryOpen(true)}
              variant="outline"
              className="h-12 text-base font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Gift className="mr-2 h-5 w-5" />
              MIEI BAGAGLI
            </Button>
          </div>
        </div>

        {/* Prize Pool */}
        <PrizePool />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Suitcases Sold</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-secondary">89</div>
              <div className="text-sm text-muted-foreground">NFTs Won</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-accent">12.5</div>
              <div className="text-sm text-muted-foreground">ETH Distributed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-black text-primary">156</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <InventoryModal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />

      <PrizeRevealModal isOpen={isPrizeRevealOpen} onClose={() => setIsPrizeRevealOpen(false)} prize={lastPrize} />
    </div>
  )
}
