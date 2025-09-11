// Simple Web3 utilities without wagmi
export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (data: any) => void) => void
  removeListener: (event: string, callback: (data: any) => void) => void
  isMetaMask?: boolean
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export const BASE_SEPOLIA_CHAIN_ID = "0x14a34" // 84532 in hex

export const BASE_SEPOLIA_CONFIG = {
  chainId: BASE_SEPOLIA_CHAIN_ID,
  chainName: "Base Sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: ["https://sepolia-explorer.base.org"],
}

export async function connectWallet(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error("No wallet found. Please install MetaMask.")
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    return accounts
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect wallet")
  }
}

export async function getBalance(address: string): Promise<string> {
  if (!window.ethereum) {
    return "0"
  }

  try {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    })
    // Convert from wei to ETH
    return (Number.parseInt(balance, 16) / 1e18).toFixed(4)
  } catch (error) {
    console.error("Error getting balance:", error)
    return "0"
  }
}

export async function switchToBaseSepolia(): Promise<void> {
  if (!window.ethereum) {
    throw new Error("No wallet found")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
    })
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BASE_SEPOLIA_CONFIG],
        })
      } catch (addError) {
        throw new Error("Failed to add Base Sepolia network")
      }
    } else {
      throw new Error("Failed to switch to Base Sepolia network")
    }
  }
}

export async function getCurrentChainId(): Promise<string> {
  if (!window.ethereum) {
    return "0x1" // Default to mainnet
  }

  try {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    })
    return chainId
  } catch (error) {
    console.error("Error getting chain ID:", error)
    return "0x1"
  }
}

export async function sendTransaction(to: string, value: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No wallet found")
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    })

    if (accounts.length === 0) {
      throw new Error("No connected accounts")
    }

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to: to,
          value: `0x${(Number.parseFloat(value) * 1e18).toString(16)}`, // Convert ETH to wei in hex
        },
      ],
    })

    return txHash
  } catch (error: any) {
    throw new Error(error.message || "Transaction failed")
  }
}
