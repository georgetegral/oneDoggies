//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";

contract DoggiesContract is IERC721 {

    string public constant name = "ONEDoggies";
    string public constant symbol = "DOGGIES";

    event Birth(
        address owner, 
        uint256 doggieId, 
        uint256 momId, 
        uint256 dadId, 
        uint256 genes
    );

    struct Doggie {
        uint256 genes;
        uint64 birthTime;
        uint32 momId;
        uint32 dadId;
        uint16 generation;
    }

    Doggie[] doggies;
    mapping(uint256 => address) public doggieIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;

    function _createDoggie(uint256 _momId, uint256 _dadId, uint256 _generation, uint256 _genes, address _owner) private returns (uint256) {
        Doggie memory _doggie = Doggie({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        doggies.push(_doggie);
        uint256 newDoggieId = doggies.length - 1;
        emit Birth(_owner, newDoggieId, _momId, _dadId, _genes);
        _transfer(address(0), _owner, newDoggieId);
        return newDoggieId;
    }

    function balanceOf(address owner) external view returns (uint256 balance){
        return ownershipTokenCount[owner];
    }

    function totalSupply() public view returns (uint256){
        return doggies.length;
    }

    function ownerOf(uint256 _tokenId) external view returns (address){
        return doggieIndexToOwner[_tokenId];
    }

    function transfer(address _to, uint256 _tokenId) external{
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(msg.sender, _tokenId));

        _transfer(msg.sender, _to, _tokenId);
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        ownershipTokenCount[_to]++;
        doggieIndexToOwner[_tokenId] = _to;
        
        if(_from != address(0)){
            ownershipTokenCount[_from]--;
        }

        //Emit the transfer event
        emit Transfer(_from, _to, _tokenId);
    }

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool){
        return doggieIndexToOwner[_tokenId] == _claimant;
    }

}