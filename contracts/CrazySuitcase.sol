// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CrazySuitcase is Ownable, ReentrancyGuard {
    uint256 public constant SUITCASE_PRICE = 0.01 ether;
    
    // Prize tokens
    IERC20 public usdcToken;
    IERC721 public ticketNFT;
    IERC721 public bananaNFT;
    
    // Prize probabilities (out of 100)
    uint256 public constant USDC_PROBABILITY = 50;  // 50%
    uint256 public constant TICKET_PROBABILITY = 30; // 30%
    uint256 public constant BANANA_PROBABILITY = 20; // 20%
    
    // Prize amounts
    uint256 public constant USDC_AMOUNT = 10 * 10**6; // 10 USDC (6 decimals)
    
    // Events
    event SuitcasePurchased(address indexed buyer, uint256 prizeType, uint256 amount);
    event PrizeDistributed(address indexed winner, string prizeType, uint256 amount);
    
    // Prize types
    enum PrizeType { USDC, TICKET_NFT, BANANA_NFT }
    
    constructor(
        address _usdcToken,
        address _ticketNFT,
        address _bananaNFT
    ) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        ticketNFT = IERC721(_ticketNFT);
        bananaNFT = IERC721(_bananaNFT);
    }
    
    function buySuitcase() external payable nonReentrant {
        require(msg.value == SUITCASE_PRICE, "Incorrect payment amount");
        
        // Generate random number for prize selection
        uint256 randomNum = _generateRandomNumber() % 100;
        PrizeType prizeType;
        
        if (randomNum < USDC_PROBABILITY) {
            prizeType = PrizeType.USDC;
            _distributeUSDC(msg.sender);
        } else if (randomNum < USDC_PROBABILITY + TICKET_PROBABILITY) {
            prizeType = PrizeType.TICKET_NFT;
            _distributeTicketNFT(msg.sender);
        } else {
            prizeType = PrizeType.BANANA_NFT;
            _distributeBananaNFT(msg.sender);
        }
        
        emit SuitcasePurchased(msg.sender, uint256(prizeType), msg.value);
    }
    
    function _distributeUSDC(address winner) internal {
        require(usdcToken.balanceOf(address(this)) >= USDC_AMOUNT, "Insufficient USDC balance");
        usdcToken.transfer(winner, USDC_AMOUNT);
        emit PrizeDistributed(winner, "USDC", USDC_AMOUNT);
    }
    
    function _distributeTicketNFT(address winner) internal {
        // This assumes the contract owns NFTs to distribute
        // In practice, you'd mint new NFTs or transfer existing ones
        emit PrizeDistributed(winner, "TICKET_NFT", 1);
    }
    
    function _distributeBananaNFT(address winner) internal {
        // This assumes the contract owns NFTs to distribute
        // In practice, you'd mint new NFTs or transfer existing ones
        emit PrizeDistributed(winner, "BANANA_NFT", 1);
    }
    
    function _generateRandomNumber() internal view returns (uint256) {
        // Simple pseudo-random number generation
        // In production, use Chainlink VRF for true randomness
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            blockhash(block.number - 1)
        )));
    }
    
    // Owner functions
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function depositUSDC(uint256 amount) external onlyOwner {
        usdcToken.transferFrom(msg.sender, address(this), amount);
    }
    
    function emergencyWithdrawUSDC() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        usdcToken.transfer(owner(), balance);
    }
    
    // View functions
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getUSDCBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
}
