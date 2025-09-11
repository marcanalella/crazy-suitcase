// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TicketNFT is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    
    constructor() ERC721("Crazy Suitcase Ticket", "CST") Ownable(msg.sender) {
        _baseTokenURI = "https://api.crazysuitcase.com/ticket/";
    }
    
    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(to, tokenId);
        return tokenId;
    }
    
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
