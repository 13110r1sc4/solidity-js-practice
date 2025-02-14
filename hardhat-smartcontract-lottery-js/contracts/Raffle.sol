// Enter thel lottery
// Pick a random winner
// winner to be selectde every X minutes -> automated

// -> we need chainlink oracles -> randomness , automated execution (chainlink keepers)

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

error Raffle__NotEnoughETHEntered();

contract Raffle {
    /* State Variables */
    uint256 private i_entranceFee;
    addess payable[] private s_players;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender))
    }

    function getEntranceFee() {
        return i_entranceFee
    }

    function getPlayer(uint256 index) public view returns(address){
        return s_players[index];
    }
}
