//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./Ownable.sol";
import "./Base64.sol";

contract DoggiesContract is IERC721, Ownable {

    uint256 public constant CREATION_LIMIT_GEN0 = 100;
    string public constant name = "ONEDoggies";
    string public constant symbol = "DOGGIES";
    using Strings for uint256;

    bytes4 internal constant ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    event Birth(
        address owner, 
        uint256 doggieId, 
        uint256 momId, 
        uint256 dadId, 
        uint256 dna
    );

    struct Doggie {
        uint256 dna;
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

    function breed( uint256 _dadId, uint256 _momId) public returns (uint256) {
        //Check ownership
        require(_owns(msg.sender, _dadId), "The user doesn't own the token.");
        require(_owns(msg.sender, _momId), "The user doesn't own the token.");
        //Get the DNA of the parents
        (uint256 _dadDna,,,,uint256 _dadGeneration) = getDoggie(_dadId);
        (uint256 _momDna,,,,uint256 _momGeneration) = getDoggie(_momId);
        //Get the new dna
        uint256 _newDna = _mixDna(_dadDna, _momDna);
        //Figure out the generation
        uint256 _kidGeneration = 0;
        if(_dadGeneration < _momGeneration){
            _kidGeneration = _momGeneration + 1;
            _kidGeneration /=2;
        }
        else if (_dadGeneration > _momGeneration){
            _kidGeneration = _dadGeneration + 1;
            _kidGeneration /=2;
        }
        else {
            _kidGeneration = _momGeneration + 1;
        }
        //Create a new cat with the new properties, give it to the msg.sender
        return _createDoggie(_momId, _dadId, _kidGeneration, _newDna, msg.sender);
    }

    function supportsInterface(bytes4 _interfaceId) external pure returns (bool){
        return (_interfaceId == _INTERFACE_ID_ERC721 || _interfaceId == _INTERFACE_ID_ERC165);
    }

    function safeTransferFrom( address _from, address _to, uint256 _tokenId) public {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function safeTransferFrom( address _from, address _to, uint256 _tokenId, bytes memory _data) public {
        require( _isApprovedOrOwner(msg.sender, _from, _to, _tokenId));
        _safeTransfer(_from, _to, _tokenId, _data);
    }

    function _safeTransfer(address _from, address _to, uint256 _tokenId, bytes memory _data) internal{
        _transfer(_from, _to, _tokenId);
        require(_checkERC721Support(_from, _to, _tokenId, _data) );
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require( _isApprovedOrOwner(msg.sender, _from, _to, _tokenId));

        _transfer(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        address _owner = ownerOf(_tokenId);
        require(_to != _owner, "ERC721: approval to current owner");

        require(_owns(msg.sender, _tokenId) || isApprovedForAll(_owner, msg.sender), "ERC721: approve caller is not token owner nor approved for all");

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

    function getDoggie(uint256 _id) public view returns (
        uint256 dna,
        uint256 birthTime,
        uint256 momId,
        uint256 dadId,
        uint256 generation
    ){
        Doggie storage doggie = doggies[_id]; //pointer, uses less memory than "memory" as that would copy the value

        dna = doggie.dna;
        birthTime = uint256(doggie.birthTime);
        momId = uint256(doggie.momId);
        dadId = uint256(doggie.dadId);
        generation = uint256(doggie.generation);
        
    }

    function createDoggieGen0(uint256 _dna) public onlyOwner returns (uint256) {
        require(gen0Counter < CREATION_LIMIT_GEN0);
        gen0Counter++;
        //Gen 0 have no owners, they are owned by the contract
        return _createDoggie(0,0,0,_dna, msg.sender);
    }

    function _createDoggie(uint256 _momId, uint256 _dadId, uint256 _generation, uint256 _dna, address _owner) private returns (uint256) {
        Doggie memory _doggie = Doggie({
            dna: _dna,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        doggies.push(_doggie);
        uint256 newDoggieId = doggies.length - 1;
        emit Birth(_owner, newDoggieId, _momId, _dadId, _dna);
        _transfer(address(0), _owner, newDoggieId);
        return newDoggieId;
    }

    function balanceOf(address owner) external view returns (uint256 balance){
        return ownershipTokenCount[owner];
    }

    function totalSupply() public view returns (uint256){
        return doggies.length;
    }

    function ownerOf(uint256 _tokenId) public view returns (address){
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

    function tokenURI(uint256 tokenId) public view returns (string memory){
        require(tokenId < doggies.length, "URI query for nonexistent token."); //Token must exist
        (uint256 _dna,,,,) = getDoggie(tokenId);
        (uint256 primaryColor,uint256 secondaryColor,uint256 stomachColor,uint256 backgroundColor,uint256 locketColor,uint256 beltColor,uint256 dotsColor,uint256 animation,) = _divideDna(_dna);
        string memory jsonURI = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "ONEDoggie #',
                        tokenId.toString(),
                        '", "description": "ONEDoggies are adorable randomized dogs residing on the Harmony ONE Blockchain.",',
                        '"attributes": [{"Primary Color": "',
                        primaryColor.toString(),
                        '",Secondary Color": "',
                        secondaryColor.toString(),
                        '","Stomach Color": "',
                        stomachColor.toString(),
                        '","Background Color": "',
                        backgroundColor.toString(),
                        '","Locket Color": "',
                        locketColor.toString(),
                        '","Belt Color": "',
                        beltColor.toString(),
                        '","Dots Color": "',
                        dotsColor.toString(),
                        '","Animation Type": "',
                        animation.toString(),
                        '"}]}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,",jsonURI));
    }

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool){
        return doggieIndexToOwner[_tokenId] == _claimant;
    }

    function _approve(uint256 _tokenId, address _approved) internal {
        doggieIndexToApproved[_tokenId] = _approved;
    }

    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return doggieIndexToApproved[_tokenId] == _claimant;
    }

    function _checkERC721Support(address _from, address _to, uint256 _tokenId, bytes memory _data) internal returns (bool) {
        if(!_isContract(_to)){
            return true;
        }
        //Call onERC721Received in the _to contract
        bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
        //Check return value
        return returnData == ERC721_RECEIVED;
    }

    function _isContract(address _to) view internal returns (bool){
        //Solidity assembly language
        uint32 size;
        assembly{
            size := extcodesize(_to)
        }
        return size > 0;
    }

    function _isApprovedOrOwner(address _spender, address _from, address _to, uint256 _tokenId) internal view returns (bool){
        require(_tokenId < doggies.length); //Token must exist
        require(_to != address(0)); //To address is not zero address
        require(_owns(_from, _tokenId)); //From owns the token

        //spender is from, or spender is approved for tokenId, or spender is operator for from
        return (_spender == _from || _approvedFor(_spender, _tokenId) || isApprovedForAll(_from, _spender));
    }

    function _mixDna(uint256 _dadDna, uint256 _momDna) internal view returns (uint256){
        // Example dad DNA: 10111213132311 ---> 10 11 12 13 1 3 23 1 1
        // Example mom DNA: 97143939141639 ---> 97 14 39 39 2 9 16 3 9
        uint256 primaryColor;
        uint256 secondaryColor;
        uint256 stomachColor;
        uint256 backgroundColor;
        uint256 locketColor;
        uint256 beltColor;
        uint256 dotsColor;
        uint256 animation;
        uint256 secret;
        uint256 finalDna;

        uint priority = _getRandomPriority(); //0 = Mom Priority, 1 = Dad Priority
        //Priority gets primary color and animation
        //Mom Priority
        if(priority == 0){
            primaryColor = _getDnaSection(_momDna, 12, 2);
            secondaryColor = _getDnaSection(_dadDna, 10, 2);
            stomachColor = _getDnaSection(_dadDna, 8, 2);
            animation = _getDnaSection(_momDna, 1, 1);
        }
        //Dad Priority
        else{
            primaryColor = _getDnaSection(_dadDna, 12, 2);
            secondaryColor = _getDnaSection(_momDna, 10, 2);
            stomachColor = _getDnaSection(_momDna, 8, 2);
            animation = _getDnaSection(_dadDna, 1, 1);
        }
        backgroundColor = _getRandomNumber(10,89);
        locketColor = _getRandomNumber(1,2);
        beltColor = _getRandomNumber(3,9);
        dotsColor = _getRandomNumber(10,89);
        secret = _getRandomNumber(1,9);

        finalDna = primaryColor     *1000000000000;
        finalDna += secondaryColor  *10000000000;
        finalDna += stomachColor    *100000000;
        finalDna += backgroundColor *1000000;
        finalDna += locketColor     *100000;
        finalDna += beltColor       *10000;
        finalDna += dotsColor       *100;
        finalDna += animation       *10;
        finalDna += secret;

        return finalDna;
    }

    function _getRandomPriority() internal view returns (uint){
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number))) % 2;
        return randomnumber;
    }

    function _getRandomNumber(uint256 lowerRange, uint256 upperRange) internal view returns (uint256) {
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number))) % upperRange;
        return randomnumber + lowerRange;    
    }

    function _getDnaSection(uint256 _dna, uint8 _rightDiscard, uint8 sectionSize) internal pure returns (uint256){
        return uint256(
            (_dna % (1 * 10 ** (_rightDiscard + sectionSize))) / (1 * 10 ** _rightDiscard)
        );
    }

    function _divideDna(uint256 _dna) internal pure returns(
        uint256 primaryColor,
        uint256 secondaryColor,
        uint256 stomachColor,
        uint256 backgroundColor,
        uint256 locketColor,
        uint256 beltColor,
        uint256 dotsColor,
        uint256 animation,
        uint256 secret
    ){
        primaryColor = _getDnaSection(_dna, 12, 2);
        secondaryColor = _getDnaSection(_dna, 10, 2);
        stomachColor = _getDnaSection(_dna, 8, 2);
        backgroundColor = _getDnaSection(_dna, 6, 2);
        locketColor = _getDnaSection(_dna, 5, 1);
        beltColor = _getDnaSection(_dna, 4, 1);
        dotsColor = _getDnaSection(_dna, 2, 2);
        animation = _getDnaSection(_dna, 1, 1);
        secret = _getDnaSection(_dna, 0, 1);
    }

}