//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";
import "./Ownable.sol";

contract DoggiesContract is IERC721, Ownable {

    uint256 public constant CREATION_LIMIT_GEN0 = 100;
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

    mapping(uint256 => address) public doggieIndexToApproved;
    //MYADDR => OPERATORADDR => TRUE/FALSE
    //_operatorApprovals [MYADDR][OPERATORADDR]
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    uint256 public gen0Counter;

    function approve(address _to, uint256 _tokenId) public {
        require(_owns(msg.sender, _tokenId));

        _approve(_tokenId, _to);
        emit Approval(msg.sender, _to, _tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender);

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    //Getting the approved status of a token
    function getApproved(uint256 tokenId) public view returns (address) {
        require(tokenId < doggies.length); //Token must exist
        return doggieIndexToApproved[tokenId];
    }

    //Getter for the operators
    function isApprovedForAll(address owner, address operator) public view returns (bool){
        return _operatorApprovals[owner][operator];
    }

    function getDoggie(uint256 _id) external view returns (
        uint256 genes,
        uint256 birthTime,
        uint256 momId,
        uint256 dadId,
        uint256 generation
    ){
        Doggie storage doggie = doggies[_id]; //pointer, uses less memory than "memory" as that would copy the value

        genes = doggie.genes;
        birthTime = uint256(doggie.birthTime);
        momId = uint256(doggie.momId);
        dadId = uint256(doggie.dadId);
        generation = uint256(doggie.generation);
        
    }

    function createDoggieGen0(uint256 _genes) public onlyOwner returns (uint256) {
        require(gen0Counter < CREATION_LIMIT_GEN0);
        gen0Counter++;
        //Gen 0 have no owners, they are owned by the contract
        return _createDoggie(0,0,0,_genes, msg.sender);
    }

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
            delete doggieIndexToApproved[_tokenId]; //Delete approved address when a successful transfer is made
        }

        //Emit the transfer event
        emit Transfer(_from, _to, _tokenId);
    }

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool){
        return doggieIndexToOwner[_tokenId] == _claimant;
    }

    function _approve(uint256 _tokenId, address _approved) internal {
        doggieIndexToApproved[_tokenId] = _approved;
    }

}