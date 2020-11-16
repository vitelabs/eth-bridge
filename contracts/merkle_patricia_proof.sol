pragma solidity ^0.6.3;

pragma experimental ABIEncoderV2; // todo delete

import "./rlp.sol";

library MerklePatriciaProof {
    /*
     * @dev Verifies a merkle patricia proof.
     * @param value The terminating value in the trie.
     * @param encodedPath The path in the trie leading to value.
     * @param rlpParentNodes The rlp encoded stack of nodes.
     * @param root The root hash of the trie.
     * @return The boolean validity of the proof.
     */
    function verify(
        bytes memory value,
        bytes memory encodedPath,
        bytes memory rlpParentNodes,
        bytes32 root
    ) internal pure returns (bool) {
        RLP.RLPItem memory item = RLP.toRLPItem(rlpParentNodes);
        RLP.RLPItem[] memory parentNodes = RLP.toList(item);

        bytes memory currentNode;
        RLP.RLPItem[] memory currentNodeList;

        bytes32 nodeKey = root;
        uint256 pathPtr = 0;

        bytes memory path = _getNibbleArray(encodedPath);
        if (path.length == 0) {
            require(1 < 0, "0009342");
            return false;
        }

        for (uint256 i = 0; i < parentNodes.length; i++) {
            if (pathPtr > path.length) {
                require(1 < 0, "00091");
                return false;
            }

            currentNode = RLP.toBytes(parentNodes[i]);
            if (nodeKey != keccak256(currentNode)) {
                require(1 < 0, "0009");
                return false;
            }
            currentNodeList = RLP.toList(RLP.toRLPItem(currentNode));
            // currentNodeList = RLP.toList(parentNodes[i]);

            // require(1<0, "dddddd22232");
            if (currentNodeList.length == 17) {
                require(uint8(path[0]) == 8, "path[0] ==8");
                if (pathPtr == path.length) {
                    if (
                        keccak256(RLP.toBytes(currentNodeList[16])) ==
                        keccak256(value)
                    ) {
                        return true;
                    } else {
                        require(1 < 0, "00");
                        return false;
                    }
                }

                uint8 nextPathNibble = uint8(path[pathPtr]);

                if (nextPathNibble > 16) {
                    require(1 < 0, "22");
                    return false;
                }
                nodeKey = RLP.toBytes32(currentNodeList[nextPathNibble]);
                pathPtr += 1;
            } else if (currentNodeList.length == 2) {
                pathPtr += _nibblesToTraverse(
                    RLP.toBytes(currentNodeList[0]),
                    path,
                    pathPtr
                );

                if (pathPtr == path.length) {
                    //leaf node
                    if (
                        keccak256(RLP.toBytes(currentNodeList[1])) ==
                        keccak256(value)
                    ) {
                        return true;
                    } else {
                        require(1 < 0, "1");
                        return false;
                    }
                }
                //extension node
                if (
                    _nibblesToTraverse(
                        RLP.toBytes(currentNodeList[0]),
                        path,
                        pathPtr
                    ) == 0
                ) {
                    require(1 < 0, "2");
                    return false;
                }

                nodeKey = RLP.toBytes32(currentNodeList[1]);
            } else {
                require(1 < 0, "3");
                return false;
            }
        }
    }

    function _nibblesToTraverse(
        bytes memory encodedPartialPath,
        bytes memory path,
        uint256 pathPtr
    ) private pure returns (uint256) {
        uint256 len;
        // encodedPartialPath has elements that are each two hex characters (1 byte), but partialPath
        // and slicedPath have elements that are each one hex character (1 nibble)
        bytes memory partialPath = _getNibbleArray2(encodedPartialPath);
        bytes memory slicedPath = new bytes(partialPath.length);

        // pathPtr counts nibbles in path
        // partialPath.length is a number of nibbles
        for (uint256 i = pathPtr; i < pathPtr + partialPath.length; i++) {
            bytes1 pathNibble = path[i];
            slicedPath[i - pathPtr] = pathNibble;
        }

        if (keccak256(partialPath) == keccak256(slicedPath)) {
            len = partialPath.length;
        } else {
            len = 0;
        }
        return len;
    }

    // bytes b must be hp encoded
    function _getNibbleArray(bytes memory b)
        private
        pure
        returns (bytes memory)
    {
        bytes memory nibbles;

        if (b.length > 0) {
            nibbles = new bytes(b.length * 2);
            for (uint256 i = 0; i < nibbles.length; i++) {
                nibbles[i] = _getNthNibbleOfBytes(i, b);
            }
        }
        return nibbles;
    }

    function _getNthNibbleOfBytes(uint256 n, bytes memory str)
        private
        pure
        returns (bytes1)
    {
        return
            bytes1(
                n % 2 == 0 ? uint8(str[n / 2]) / 0x10 : uint8(str[n / 2]) % 0x10
            );
    }

    // bytes b must be hp encoded
    function _getNibbleArray2(bytes memory b)
        private
        pure
        returns (bytes memory)
    {
        bytes memory nibbles;
        if (b.length > 0) {
            uint8 offset;
            uint8 hpNibble = uint8(_getNthNibbleOfBytes(0, b));
            if (hpNibble == 1 || hpNibble == 3) {
                nibbles = new bytes(b.length * 2 - 1);
                bytes1 oddNibble = _getNthNibbleOfBytes(1, b);
                nibbles[0] = oddNibble;
                offset = 1;
            } else {
                nibbles = new bytes(b.length * 2 - 2);
                offset = 0;
            }

            for (uint256 i = offset; i < nibbles.length; i++) {
                nibbles[i] = _getNthNibbleOfBytes(i - offset + 2, b);
            }
        }
        return nibbles;
    }
}
