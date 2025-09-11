# Smart Contract Deployment Guide

## Prerequisites
1. Install MetaMask or another Web3 wallet
2. Get Base Sepolia testnet ETH from faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
3. Access Remix IDE: https://remix.ethereum.org

## Step 1: Deploy Contracts in Remix

### 1.1 Setup Remix
1. Open Remix IDE
2. Create a new workspace
3. Copy all `.sol` files from the `contracts/` folder into Remix

### 1.2 Install Dependencies
1. In Remix, go to File Explorer
2. Create a new file: `package.json`
3. Add OpenZeppelin dependencies:
\`\`\`json
{
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0"
  }
}
\`\`\`

### 1.3 Compile Contracts
1. Go to Solidity Compiler tab
2. Select compiler version 0.8.19+
3. Compile all contracts

### 1.4 Deploy Order
Deploy in this exact order:

1. **MockUSDC.sol**
   - No constructor parameters needed
   - Copy deployed address

2. **TicketNFT.sol**
   - No constructor parameters needed
   - Copy deployed address

3. **BananaNFT.sol**
   - No constructor parameters needed
   - Copy deployed address

4. **CrazySuitcase.sol**
   - Constructor parameters:
     - `_usdcToken`: MockUSDC contract address
     - `_ticketNFT`: TicketNFT contract address
     - `_bananaNFT`: BananaNFT contract address

## Step 2: Setup Contract Permissions

### 2.1 Fund MockUSDC Contract
1. Call `MockUSDC.mint()` with CrazySuitcase address and amount (e.g., 1000000000000 for 1M USDC)

### 2.2 Set NFT Minting Permissions
1. Call `TicketNFT.transferOwnership()` with CrazySuitcase address
2. Call `BananaNFT.transferOwnership()` with CrazySuitcase address

## Step 3: Update Frontend

Update `lib/contracts.ts` with your deployed addresses:

\`\`\`typescript
export const CONTRACT_ADDRESSES = {
  CRAZY_SUITCASE: "0xYourCrazySuitcaseAddress",
  MOCK_USDC: "0xYourMockUSDCAddress", 
  TICKET_NFT: "0xYourTicketNFTAddress",
  BANANA_NFT: "0xYourBananaNFTAddress",
}
\`\`\`

## Step 4: Test the App

1. Connect wallet to Base Sepolia
2. Ensure you have testnet ETH
3. Click "BUY SUITCASE" to test the lottery
4. Check transaction on Base Sepolia explorer

## Prize Distribution
- 50% chance: 10 USDC tokens
- 30% chance: Ticket NFT
- 20% chance: Banana NFT

## Troubleshooting
- Ensure wallet is on Base Sepolia (Chain ID: 84532)
- Check contract has sufficient USDC balance
- Verify NFT contracts have proper ownership setup
- Use Base Sepolia block explorer to verify transactions
