"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InventoryModal({ isOpen, onClose }: InventoryModalProps) {
  // Mock inventory data - horizontal pill containers as per wireframe
  const inventory = [
    { id: 1, status: "unopened", rarity: "common" },
    { id: 2, status: "unopened", rarity: "rare" },
    { id: 3, status: "opened", rarity: "common", prize: "100 MST Tokens" },
    { id: 4, status: "unopened", rarity: "epic" },
    { id: 5, status: "opened", rarity: "rare", prize: "Dragon NFT" },
    { id: 6, status: "unopened", rarity: "common" },
    { id: 7, status: "unopened", rarity: "legendary" },
    { id: 8, status: "opened", rarity: "epic", prize: "0.05 ETH" },
    { id: 9, status: "unopened", rarity: "common" },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-400"
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-orange-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-[#f5f0d8]">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-black text-center text-black">MIEI BAGAGLI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-4 pb-6">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="relative flex items-center bg-white rounded-full border-4 border-purple-500 p-2 h-16"
            >
              {/* Purple circle indicator on the left */}
              <div className={`w-10 h-10 rounded-full ${getRarityColor(item.rarity)} flex-shrink-0 mr-4`} />

              {/* Content area */}
              <div className="flex-1 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 capitalize">{item.rarity} Suitcase</span>
                  {item.status === "opened" && item.prize && (
                    <span className="text-xs text-gray-700 font-medium">Won: {item.prize}</span>
                  )}
                </div>

                <Badge variant={item.status === "opened" ? "secondary" : "default"} className="mr-2">
                  {item.status === "opened" ? "Opened" : "Sealed"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center p-4 border-t border-purple-200">
          <p className="text-sm text-gray-700 font-medium">
            Total: {inventory.length} | Unopened: {inventory.filter((i) => i.status === "unopened").length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
