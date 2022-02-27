// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Painting {
    address public owner;
    string[24][24] public pixels;
    mapping(address => uint256) public timestamps;

    modifier isOwner() {
        require(msg.sender == owner, "Message sender is not contract owner");
        _;
    }

    modifier validTimestamp() {
        require(timestamps[msg.sender] + 60 < block.timestamp, "Not enough time has passed");
        _;
    }

    constructor() {
        owner = msg.sender;
        resetPainting();
    }

    function resetPainting() public isOwner{
        uint256 i;
        uint256 j;
        for (i = 0; i < 24; i++) {
            for (j = 0; j < 24; j++) {
                pixels[i][j] = "FFFFFF";
            }
        }
    }

    function setPixel(uint256 _i, uint256 _j, string memory _color) public validTimestamp {
        pixels[_i][_j] = _color;
        timestamps[msg.sender] = block.timestamp;
    }

    function getPixels() public view returns (string[24][24] memory) {
        return (pixels);
    }
}