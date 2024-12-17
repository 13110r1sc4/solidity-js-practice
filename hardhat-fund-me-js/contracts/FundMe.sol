// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title A contract for crowd funding
 * @author Leonardo Risca
 * @notice This contract is to demo a sample funding contract
 */

contract FundMe {
    // Type declarations
    using PriceConverter for uint256;

    // sttae variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address private immutable i_owner; // not storage
    address[] private s_funders; // storage
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface public s_priceFeed; // storage
    // NB: usually we use underscorse in naming variables when it is in storage s_

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    /**
     * @notice
     * @dev
     */

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    // we are using a lot of gas here for storage and reading from storage
    // -> lets rceate a function that is cheaper

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders; // memory is chaper than storage
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    function getAddressToAmountFunded(
        address fundingAddress
    ) public view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
    // these functions are used to keep the returned variables private -> the variables names like s_funders should be replaced
    // with getFunder
}
