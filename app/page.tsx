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
import { CRAZY_SUITCASE_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { decodeEventLog } from "viem"
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { sdk } from '@farcaster/miniapp-sdk'

export default function HomePage() {
  const { isConnected, isCorrectNetwork } = useWallet()
  const [isPrizeRevealOpen, setIsPrizeRevealOpen] = useState(false)
  const [lastPrize, setLastPrize] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()


  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
      if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  // Check if contract exists by reading SUITCASE_PRICE
  const { error: contractError, data: suitcasePrice } = useReadContract({
    address: CONTRACT_ADDRESSES.CRAZY_SUITCASE as `0x${string}`,
    abi: CRAZY_SUITCASE_ABI,
    functionName: "SUITCASE_PRICE",
  })

  const { writeContract, data: txHash, isPending: isSubmitting } = useWriteContract()
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    if (!receipt) return
    try {
      console.log("[buySuitcase] receipt:", receipt)
      // Filter logs to our contract address first
      const contractAddress = (CONTRACT_ADDRESSES.CRAZY_SUITCASE as string).toLowerCase()
      const relatedLogs = receipt.logs.filter((log: any) => (log.address as string)?.toLowerCase() === contractAddress)
      console.log("[buySuitcase] relatedLogs:", relatedLogs)

      // Try to decode logs using our ABI
      const decoded = relatedLogs
        .map((log) => {
          try {
            return decodeEventLog({ abi: CRAZY_SUITCASE_ABI as any, ...log })
          } catch {
            return null
          }
        })
        .filter(Boolean) as any[]
      console.log("[buySuitcase] decoded:", decoded)

      // Prefer PrizeDistributed, but fall back to SuitcasePurchased
      const prizeDistributed = decoded.find((e) => e.eventName === "PrizeDistributed")
      const suitcasePurchased = decoded.find((e) => e.eventName === "SuitcasePurchased")

      if (prizeDistributed) {
        const { prizeType, amount } = prizeDistributed.args as any
        const prizeTypeStr = String(prizeType)
        if (prizeTypeStr === "Mock USDC") {
          const formatted = (Number(amount) / 1_000_000).toString()
          setLastPrize({ type: "On-chain Prize", name: "Mock USDC", value: "USDC", amount: formatted })
        } else if (prizeTypeStr === "TicketNFT") {
          setLastPrize({ type: "On-chain Prize", name: "Ticket NFT", value: "NFT", amount: "1" })
        } else if (prizeTypeStr === "BananaNFT") {
          setLastPrize({ type: "On-chain Prize", name: "Banana NFT", value: "NFT", amount: "1" })
        } else {
          setLastPrize({ type: "On-chain Prize", name: prizeTypeStr, value: "", amount: String(amount) })
        }
        setIsPrizeRevealOpen(true)
      } else if (suitcasePurchased) {
        const { prizeType, amount } = suitcasePurchased.args as any
        const prizeTypeNum = Number(prizeType)
        if (prizeTypeNum === 0) {
          const formatted = (Number(amount) / 1_000_000).toString()
          setLastPrize({ type: "Purchase", name: "Mock USDC", value: "USDC", amount: formatted })
        } else if (prizeTypeNum === 1) {
          setLastPrize({ type: "Purchase", name: "Ticket NFT", value: "NFT", amount: "1" })
        } else if (prizeTypeNum === 2) {
          setLastPrize({ type: "Purchase", name: "Banana NFT", value: "NFT", amount: "1" })
        } else {
          setLastPrize({ type: "Purchase", name: `Prize #${String(prizeType)}`, value: "", amount: String(amount) })
        }
        setIsPrizeRevealOpen(true)
      } else {
        // If no known event was found but tx confirmed, still show a generic success
        setLastPrize({ type: "Purchase", name: "Suitcase Purchased", amount: "" })
        setIsPrizeRevealOpen(true)
        toast({ title: "Purchase Confirmed", description: "No prize event found in receipt logs." })
      }
      setIsProcessing(false)
    } catch (e) {
      console.error("[buySuitcase] error decoding events:", e)
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

    if (contractError) {
      toast({
        title: "Contract Not Found",
        description: "The contract is not deployed on this network. Please deploy contracts first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.CRAZY_SUITCASE as `0x${string}`,
        abi: CRAZY_SUITCASE_ABI,
        functionName: "buySuitcase",
        value: (suitcasePrice as bigint) ?? undefined,
      })
      toast({ title: "Transaction Submitted! 🚀", description: "Waiting for confirmation..." })

    } catch (error: any) {
      console.error("Purchase error:", error)
      setIsProcessing(false)
      
      let errorMessage = "There was an error processing your purchase."
      
      if (error?.message?.includes("Internal JSON-RPC error")) {
        errorMessage = "Contract not found or network issue. Please check you're on Base Sepolia."
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH balance for transaction."
      } else if (error?.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user."
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      })
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
              disabled={!isConnected || !isCorrectNetwork || isProcessing || !!contractError}
            >
              {isProcessing ? "Processing..." : 
               contractError ? "Contract Not Deployed" :
               "BUY SUITCASE"}
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
