// Enter thel lottery
// Pick a random winner
// winner to be selectde every X minutes -> automated

// -> we need chainlink oracles -> randomness , automated execution (chainlink keepers)

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    /* State Variables */
    uint256 private i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable vrfCoordinator;

    // Events
    event RaffleEnter(address indexed player);

    constructor(address vrfCoordinatorV2, uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    }
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        // events: emit an event when changing a dynamic array or mapping
        // Named events with the function name revrsed
        emit RaffleEnter(msg.sender);
    }

    function pickRandomWinner() external {
        // request the random number
        // do something wit it
        // 2 trans process
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
