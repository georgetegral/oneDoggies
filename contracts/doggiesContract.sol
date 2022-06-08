//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";

contract DoggiesContract is IERC721 {

    string public constant name = "ONEDoggies";
    string public constant symbol = "DOGGIES";

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

    function balanceOf(address owner) external view returns (uint256 balance){
        return ownershipTokenCount[owner];
    }

}