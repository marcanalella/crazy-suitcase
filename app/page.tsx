"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import { SuitcaseDisplay } from "@/components/suitcase-display"
import { PrizePool } from "@/components/prize-pool"
import { PrizeRevealModal } from "@/components/prize-reveal-modal"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { CRAZY_SUITCASE_ABI } from "@/lib/contracts"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, decodeEventLog } from "viem"
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { sdk } from '@farcaster/miniapp-sdk'


const SUITCASE_CONTRACT_ADDRESS = "0x52b6c8F41AFC2E5CdCe9cBAD85E3CAace54a1329"

export default function HomePage() {
  const { isConnected, isCorrectNetwork } = useWallet()
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [isPrizeRevealOpen, setIsPrizeRevealOpen] = useState(false)
  const [lastPrize, setLastPrize] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()


  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
      if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  const { writeContract, data: txHash, isPending: isSubmitting } = useWriteContract()
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    if (!receipt) return
    try {
      // Try to decode PrizeDistributed event for prize details
      const prizeLogs = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({ abi: CRAZY_SUITCASE_ABI as any, ...log })
          } catch {
            return null
          }
        })
        .filter(Boolean) as any[]

      const prizeEvent = prizeLogs.find((e) => e.eventName === "PrizeDistributed")
      if (prizeEvent) {
        const [, prizeType, amount] = prizeEvent.args as any
        setLastPrize({ type: "On-chain Prize", name: String(prizeType), amount: String(amount) })
        setIsPrizeRevealOpen(true)
      }
      setIsProcessing(false)
    } catch (e) {
      setIsProcessing(false)
    }
  }, [receipt])

  const handleBuySuitcase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first!",
        variant: "destructive",
      })
      return
    }

    await sdk.actions.ready();

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
      const priceEth = "0.00001"
      writeContract({
        address: SUITCASE_CONTRACT_ADDRESS as `0x${string}`,
        abi: CRAZY_SUITCASE_ABI,
        functionName: "buySuitcase",
        value: parseEther(priceEth),
      })
      toast({ title: "Transaction Submitted! 🚀", description: "Waiting for confirmation..." })

    } catch (error: any) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase Failed",
        description: error?.message || "There was an error processing your purchase.",
        variant: "destructive",
      })
    } finally {
      // actual completion handled by receipt effect
    }
  }

  const handleWheelPrize = (prize: any) => {
    if (prize && prize.type !== "Nothing") {
      setLastPrize(prize)
      // Don't show prize reveal modal immediately, let wheel show result first
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-black text-primary">CRAZY LOST AND FOUND SUITCASE</h1>
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
          </div>
        </div>

        {/* Prize Pool */}
        <PrizePool />
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
            Developed in occasion of: <span className="font-semibold text-primary">[Urbe Campus ETHNA Edition]</span>
          </p>

          <div className="flex justify-center">
            <img 
              src="/placeholder-logo.avif" 
              alt="Event Logo" 
              className="w-auto object-contain"
            />
          </div>
        </div>
      </footer>

      <PrizeRevealModal isOpen={isPrizeRevealOpen} onClose={() => setIsPrizeRevealOpen(false)} prize={lastPrize} />

    </div>
  )
}
