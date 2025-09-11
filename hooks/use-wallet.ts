"use client"

import { useState, useEffect, useCallback } from "react"
import { connectWallet, getBalance, getCurrentChainId, switchToBaseSepolia, BASE_SEPOLIA_CHAIN_ID } from "@/lib/web3"

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0")
  const [chainId, setChainId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const updateBalance = useCallback(async (addr: string) => {
    if (addr) {
      const bal = await getBalance(addr)
      setBalance(bal)
    }
  }, [])

  const updateChainId = useCallback(async () => {
    const id = await getCurrentChainId()
    setChainId(id)
  }, [])

  const connect = async () => {
    setIsLoading(true)
    try {
      const accounts = await connectWallet()
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        await updateBalance(accounts[0])
        await updateChainId()
      }
    } catch (error) {
      console.error("Connection failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress("")
    setBalance("0")
    setChainId("")
  }

  const switchNetwork = async () => {
    try {
      await switchToBaseSepolia()
      await updateChainId()
    } catch (error) {
      console.error("Network switch failed:", error)
      throw error
    }
  }

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            await updateBalance(accounts[0])
            await updateChainId()
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()
  }, [updateBalance, updateChainId])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
          updateBalance(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId)
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [updateBalance])

  const isCorrectNetwork = chainId === BASE_SEPOLIA_CHAIN_ID

  return {
    isConnected,
    address,
    balance,
    chainId,
    isLoading,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
  }
}
