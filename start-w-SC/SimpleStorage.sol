// SPDX-License-Identifier: MIT
pragma solidity 0.8.26; // hello

contract SimpleStorage {

    // boolean, uint, int, address, bytes, string
    uint256 favoriteNumber; // set to 0

    mapping(string => uint256) public nameToFavoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    // more stuff in function makes gas fee go up

    // view makes the fun blu: just view, cannot update the blockchain.
    // clicking blu buttons does not make a transaction
    // pure fun is a pure fun, without having to read any storage
    function retrieve() public view returns(uint256){
        return favoriteNumber;
    }

    // EVM can access and store info in six pplaces:
    // - Stack
    // - Memory only within fun, can be modified - for var
    // - Storage also outside, default type - for var
    // - Calldata only within fun, cannot be modified - for var
    // - Code
    // - Logs
    function addperson(string memory _name, uint256 _favoriteNumber) public { // scep memory for string but not for uint256
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}