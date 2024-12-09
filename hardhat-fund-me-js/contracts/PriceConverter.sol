// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    /**
     * @notice Fetches the latest price of ETH in USD from the Chainlink data feed.
     * @return The current ETH price in USD (scaled to 18 decimals).
     */
    function getPrice() internal view returns (uint256) {
        // Sepolia ETH / USD Address
        // https://docs.chain.link/data-feeds/price-feeds/addresses#Sepolia%20Testnet
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // Convert the price to 18 decimals and return
        return uint256(answer * 1e10); // 1 * 10 ** 10 == 10000000000
    }

    /**
     * @notice Converts the provided ETH amount to its equivalent value in USD.
     * @param ethAmount The ETH amount to be converted.
     * @return The equivalent USD value (scaled to 18 decimals).
     */
    function getConversionRate(
        uint256 ethAmount
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        // Calculate the ETH amount in USD
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18; // 1 * 10 ** 18 == 1000000000000000000
        return ethAmountInUsd;
    }
}
