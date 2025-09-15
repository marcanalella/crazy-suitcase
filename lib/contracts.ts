// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  CRAZY_SUITCASE: "0x527a3fBBcDd97ECB467F9cE5a9d11c13EF5414Bd",
} as const

// Contract ABIs
export const CRAZY_SUITCASE_ABI = [
  {
    inputs: [],
    name: "buySuitcase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "SUITCASE_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUSDCBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "prizeType", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "SuitcasePurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "string", name: "prizeType", type: "string" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "PrizeDistributed",
    type: "event",
  },
] as const

export const MOCK_USDC_ABI = [
  {
    inputs: [],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const
