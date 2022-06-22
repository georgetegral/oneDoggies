// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./doggiesContract.sol";
import "./Ownable.sol";

contract DoggieMarketplace is Ownable {
    DoggiesContract private _DoggiesContract;

    struct Offer {
        address payable seller;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }

    Offer[] offers;

    event MarketTransaction(string TxType, address owner, uint256 tokenId);

    mapping(uint256 => Offer) tokenIdToOffer;

    function setDoggiesContract(address _DoggiesContractAddress) public onlyOwner {
        _DoggiesContract = DoggiesContract(_DoggiesContractAddress);
    }

    constructor(address _DoggiesContractAddress) {
        setDoggiesContract(_DoggiesContractAddress);
    }

    function getOffer(uint256 _tokenId) public view returns (
        address payable seller, 
        uint256 price, 
        uint256 index, 
        uint256 tokenId, 
        bool active
        ) {
            Offer storage offer = tokenIdToOffer[_tokenId];
            return (
                offer.seller,
                offer.price,
                offer.index,
                offer.tokenId,
                offer.active
            );
        }

    function getAllTokenOnSale() public view returns (uint256[] memory listOfOffers){
        uint256 totalOffers = offers.length;

        if(totalOffers == 0){
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](totalOffers);
            uint256 offerId;

            for (offerId = 0; offerId < totalOffers; offerId++){
                if(offers[offerId].active == true){
                    result[offerId] = offers[offerId].tokenId;
                }
            }
            return result;
        }
    }

    function _ownsDoggie(address _address, uint256 _tokenId) internal view returns (bool){
        return (_DoggiesContract.ownerOf(_tokenId) == _address);
    }

    //Create a new offer based on the given tokenId and price
    function setOffer(uint256 _price, uint256 _tokenId) public {
        require(_ownsDoggie(msg.sender, _tokenId), "You are not the owner of that doggie");
        require(tokenIdToOffer[_tokenId].active == false, "You can't sell twice the same offers");
        require(_DoggiesContract.isApprovedForAll(msg.sender, address(this)), "Contract needs to be approved to transfer the kitty in the future");
    
        Offer memory _offer = Offer({
            seller: payable(msg.sender),
            price: _price,
            active: true,
            tokenId: _tokenId,
            index: offers.length
        });   

        tokenIdToOffer[_tokenId] = _offer;
        offers.push(_offer);

        emit MarketTransaction("Create offer", msg.sender, _tokenId); 
    }

    //Remove an existing offer
    function removeOffer(uint256 _tokenId) public {
        Offer memory offer = tokenIdToOffer[_tokenId];
        require(
            offer.seller == msg.sender,
            "You are not the seller of that doggie"
        );
        delete tokenIdToOffer[_tokenId];
        offers[offer.index].active = false;
        emit MarketTransaction("Remove offer", msg.sender, _tokenId);
    }

    //Accept an offer and buy the kitty
    function buyKitty(uint256 _tokenId) public payable {
        Offer memory offer = tokenIdToOffer[_tokenId];
        require (msg.value == offer.price, "The price is incorrect");
        require(tokenIdToOffer[_tokenId].active == true, "No active order present");

        //Important: delete the kitty from the mapping before paying out to prevent reentrancy attack
        delete tokenIdToOffer[_tokenId];
        offers[offer.index].active = false;

        //Transfer the funds to the seller
        //TODO: Make this logic pull instead of push
        if(offer.price > 0){
            offer.seller.transfer(offer.price);
        }

        //transfer ownership of the doggie
        _DoggiesContract.transferFrom(offer.seller, msg.sender, _tokenId);
        emit MarketTransaction("Buy", msg.sender, _tokenId);
    }

}