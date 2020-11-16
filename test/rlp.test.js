const RLP1 = artifacts.require("RLP1");
const RLP2 = artifacts.require("RLP2");
const RLPEncoder = artifacts.require("RLPEncoder");
const Tools = artifacts.require('Tools');
const TestRLP = artifacts.require('TestRLP');

const keccak256 = require('keccak256');
const { bufferToHex, bufferToInt, toBuffer, rlp } = require('ethereumjs-util');
const { Account, Header, Log, Proof, Receipt, Transaction } = require('eth-object')
const Web3 = require('web3');
const { encode } = require('rlp');


contract('rlp verify', ([owner, alice]) => {
    beforeEach(async () => {
        const rlpEncoder = await RLPEncoder.new();
        await RLP1.link('RLPEncoder', rlpEncoder.address);
        await RLP2.link('RLPEncoder', rlpEncoder.address);
    });
    // it('verify header rlp', async function () {
    //     const blockHex = '0xf90211a05dbc20ff76aeb219b08984b6373e4be230b50db0c784d3cd7fa792ca929c2a5ba01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347945a0b54d5dc17e0aadc383d2db43b0a0d3e029c4ca0946a698b5bd180d307a8fc5045998f381957a9e739a51f3ea010ce233ead16f6a02bbb882b75d225b550f4a925422854b2f25bb2d2a882ecbed6dd7f80b5c446c9a08a5249ef06503334c704b7606ef0f0306cb0d2474e069050a77a46c7cb52faedb90100b5a54ba0b056090c00151c1881145fa9ba10e2c835044084a083248881420b45430541200d701101dd4066409007d9178a4c2287792c26a0281480c8d83c814c4a02a2280ec0cf83f826998eb430f261129c9d0e08edb0042c3211929220a9911822c110a2d8110224b562011ba749b028821e78781c74004852b11c198240a0bfdbd49f8e244000b4c00aa5b088274b1c4e0ac119b0509c621004c0031841128af585893440ae028cc6ffa97940181a0776408280425b0048030264224b264051472982f0305682213256213b12f28d28e0562281e4201c41124f1311f1280010983067654eb518db01aea015a6af1a03903016c28c0040c0481d484a24094e870b951f9771780683a92be983bebc2083beb041845f8d9bdf906574682d70726f2d687a6f2d74303035a070a5dae1d9aa80afc8a8d8ab98825f48cb9d8db8194a6929f1b49b207d97f12c88972c9d98010783e2';
    //     const blockHeader = Header.fromHex(blockHex);
    //     console.log('block parentHash', bufferToHex(blockHeader.parentHash)); //0
    //     console.log('block sha3Uncles', bufferToHex(blockHeader.sha3Uncles)); //1
    //     console.log('block miner', bufferToHex(blockHeader.miner));  //2
    //     console.log('block stateRoot', bufferToHex(blockHeader.stateRoot));//3
    //     console.log('block transactionsRoot', bufferToHex(blockHeader.transactionsRoot));//4
    //     console.log('block receiptRoot', bufferToHex(blockHeader.receiptRoot));//5
    //     console.log('block logsBloom', bufferToHex(blockHeader.logsBloom));//6
    //     console.log('block difficulty', bufferToHex(blockHeader.difficulty));//7
    //     console.log('block number', bufferToHex(blockHeader.number));//8
    //     console.log('block gasLimit', bufferToHex(blockHeader.gasLimit));//9
    //     console.log('block gasUsed', bufferToHex(blockHeader.gasUsed));//10
    //     console.log('block timestamp', bufferToHex(blockHeader.timestamp));//11
    //     console.log('block extraData', bufferToHex(blockHeader.extraData));//12
    //     console.log('block mixHash', bufferToHex(blockHeader.mixHash));//13
    //     console.log('block nonce', bufferToHex(blockHeader.nonce));//14
    //     const header = {
    //         parentHash: blockHeader.parentHash,
    //         sha3Uncles: blockHeader.sha3Uncles,
    //         miner: blockHeader.miner,
    //         stateRoot: blockHeader.stateRoot,
    //         transactionsRoot: blockHeader.transactionsRoot,
    //         receiptsRoot: blockHeader.receiptRoot,
    //         logsBloom: blockHeader.logsBloom,
    //         difficulty: blockHeader.difficulty,
    //         number: blockHeader.number,
    //         gasLimit: blockHeader.gasLimit,
    //         gasUsed: blockHeader.gasUsed,
    //         timestamp: blockHeader.timestamp,
    //         extraData: blockHeader.extraData,
    //         mixHash: blockHeader.mixHash,
    //         nonce: blockHeader.nonce,
    //         raw: '0x'
    //     };

    //     const blockHash = '0x4a419022aa83efd6332ac4a0a0b5be84591a025e73a33086fe918b03bc11de41';
    //     {
    //         const bridge = await RLP1.new();
    //         await bridge.verifyHeader(blockHash, header);

    //         const raw = await bridge.raw();
    //         console.log('result', raw);

    //         const hash = await bridge.headerHash();
    //         console.log('result hash', hash);
    //     }
    //     {
    //         const headers = [
    //             blockHeader.parentHash,
    //             blockHeader.sha3Uncles,
    //             blockHeader.miner,
    //             blockHeader.stateRoot,
    //             blockHeader.transactionsRoot,
    //             blockHeader.receiptRoot,
    //             blockHeader.logsBloom,
    //             blockHeader.difficulty,
    //             blockHeader.number,
    //             blockHeader.gasLimit,
    //             blockHeader.gasUsed,
    //             blockHeader.timestamp,
    //             blockHeader.extraData,
    //             blockHeader.mixHash,
    //             blockHeader.nonce,
    //         ];


    //         const bridge = await RLP2.new();
    //         await bridge.verifyHeader(blockHash, headers);
    //     }
    // });

    // it('merkle patricia proof', async function () {
    //     const tools = await Tools.new();
    //     const value = toBuffer('0xf9043a01830196aab9010000200000000000000000000080000000000000000000000000000000000000000000000000000000000000001004000002000000080000000000000000000000000000000000000000000008000000200000000000400000000000000000000000000000000000000000000000000000000000000000040000000010000200000000400000000000000000000000040000080000000000082000004000000000000000000000000000400000000000000000000000000000000100000000000000000102000000000000000000000000000000020000001000000002000000000000200000000000000000000000000000000000000000000000010000000000f9032ff89b947a9277aa08a633766461351ec00996a0cbe905adf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a0000000000000000000000000000000000000000000000008252610ddca3f2a7cf89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87994e1ee482eefd3fc379b7154399f8d52956fb3c520e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000008137f863472c77294900000000000000000000000000000000000000000000000665553354489d7a49f8fc94e1ee482eefd3fc379b7154399f8d52956fb3c520f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965b880000000000000000000000000000000000000000000000008252610ddca3f2a7c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a07fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca9');
    //     const encodedPath = encode(0);
    //     const proofs = toBuffer('0xf905d3b90134f90131a0da224d56bce5841673a059da3d3625b5d14b3d95e1333253df4853d4de332e84a099c693c82f2c8883be479ef1f729d3fe3bb865f5f81d3239f810b047cd1aac0ea031e20b5e3ff892f350e1b0769ab0957ac295f9000d2170c9b86c1dfde38067d4a07378e0c3c8a819f6c7fde2e6a39d2c304088d2465cdb192c3766d5d8073432d8a00363d020fd44a89dabf2c1663117dde76f88c842e03de3daacece3ec9b79e63aa0a33dbe0b21cca068091b3443dd16f895fbb8c12b44891c8a51054e45ff3bf39da0d71863db1af1486822e0c6700c0ea8c912853b9eed6d90d078a788ca0118370fa0a3da2ffc13ffec1a9aa3891f72db9a430fa6470308e011583c67a339ec77c9bea0895072c8b994ad86b685735475dd335b06bdeaf7f6c7398bdebf09686314ee078080808080808080b853f851a0a55653bbffc1067439bfb89d05461769df318adb2185f30f91daf45126b9f494a060e55c1901f62e70f3f5bc6de8e57c4f41b097819fb7ec3303ade67513d4580e808080808080808080808080808080b90444f9044120b9043df9043a01830196aab9010000200000000000000000000080000000000000000000000000000000000000000000000000000000000000001004000002000000080000000000000000000000000000000000000000000008000000200000000000400000000000000000000000000000000000000000000000000000000000000000040000000010000200000000400000000000000000000000040000080000000000082000004000000000000000000000000000400000000000000000000000000000000100000000000000000102000000000000000000000000000000020000001000000002000000000000200000000000000000000000000000000000000000000000010000000000f9032ff89b947a9277aa08a633766461351ec00996a0cbe905adf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a0000000000000000000000000000000000000000000000008252610ddca3f2a7cf89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87994e1ee482eefd3fc379b7154399f8d52956fb3c520e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000008137f863472c77294900000000000000000000000000000000000000000000000665553354489d7a49f8fc94e1ee482eefd3fc379b7154399f8d52956fb3c520f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965b880000000000000000000000000000000000000000000000008252610ddca3f2a7c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a07fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca9');
    //     const root = toBuffer('0x8a5249ef06503334c704b7606ef0f0306cb0d2474e069050a77a46c7cb52faed');

    //     const result = await tools.verifyMerklePatriciaProof(
    //         value,
    //         ensureByte(encodedPath.toString('hex')),
    //         ensureByte(proofs.toString('hex')),
    //         root);

    //     console.log(result);
    // });

    // it('receipt', async function () {
    //     const receiptBuff = toBuffer('0xf906710183aa0943b9010010204000000000000004000080000000000000000000000000010000000000000000000000000000000000000000000202000000080000000000000000280000000000000000000008000008000002600000000000040000000000000000000000000000200000000000000000004000000000000000000000000010000000000000000000000000004000000000000800000000010000080000004000000000020000000000200200000000000010000000000000000000000000000000000040000802000000000000002000000000000000000000001000000000000020000018200000000000000000000000000000000000000000000000000000000000f90566f89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000000000000000000000000001962cde83c99ac832f89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a08c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0fffffffffffffffffffffffffffffffffffffffffffffffa4fbcd49f75a5945af89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca000000000000000000000000000000000000000000000000003bc43ef4c08a8e6f87994e3e15b09e1a8cb96032690448a18173b170a8d5ce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000017bf9d63930dacb54b00000000000000000000000000000000000000000000000037d876b38ca168e53f8fc94e3e15b09e1a8cb96032690448a18173b170a8d5cf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dcb880000000000000000000000000000000000000000000000001962cde83c99ac8320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e6f89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca000000000000000000000000000000000000000000000000000000000061437acf87994b4e16d0168e52d35cacd2c6185b44281ec28c9dce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000000000010c295dbacc7300000000000000000000000000000000000000000000a44929ecfbcd22a6264bf8fc94b4e16d0168e52d35cacd2c6185b44281ec28c9dcf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dcb880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e600000000000000000000000000000000000000000000000000000000061437ac0000000000000000000000000000000000000000000000000000000000000000')

    //     const tools = await Tools.new();
    //     const logs = [
    //         toBuffer('0xf89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000000000000000000000000001962cde83c99ac832'),
    //         toBuffer('0xf89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a08c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0fffffffffffffffffffffffffffffffffffffffffffffffa4fbcd49f75a5945a'),
    //         toBuffer('0xf89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca000000000000000000000000000000000000000000000000003bc43ef4c08a8e6'),
    //         toBuffer('0xf87994e3e15b09e1a8cb96032690448a18173b170a8d5ce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000017bf9d63930dacb54b00000000000000000000000000000000000000000000000037d876b38ca168e53'),
    //         toBuffer('0xf8fc94e3e15b09e1a8cb96032690448a18173b170a8d5cf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dcb880000000000000000000000000000000000000000000000001962cde83c99ac8320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e6'),
    //         toBuffer('0xf89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca000000000000000000000000000000000000000000000000000000000061437ac'),
    //         toBuffer('0xf87994b4e16d0168e52d35cacd2c6185b44281ec28c9dce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000000000010c295dbacc7300000000000000000000000000000000000000000000a44929ecfbcd22a6264b'),
    //         toBuffer('0xf8fc94b4e16d0168e52d35cacd2c6185b44281ec28c9dcf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dcb880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e600000000000000000000000000000000000000000000000000000000061437ac0000000000000000000000000000000000000000000000000000000000000000'),
    //     ]
    //     const status = toBuffer('0x01');
    //     const gas = toBuffer('0xaa0943');
    //     const logsBloom = toBuffer('0x10204000000000000004000080000000000000000000000000010000000000000000000000000000000000000000000202000000080000000000000000280000000000000000000008000008000002600000000000040000000000000000000000000000200000000000000000004000000000000000000000000010000000000000000000000000004000000000000800000000010000080000004000000000020000000000200200000000000010000000000000000000000000000000000040000802000000000000002000000000000000000000001000000000000020000018200000000000000000000000000000000000000000000000000000000000');

    //     const result = await tools.receiptBuild(
    //         status,
    //         gas,
    //         logsBloom,
    //         logs, 0);
    //     // 思路应该是插入所有，然后在solidity中解析，然后比对地址和事件类型
    //     console.log("-----------", result);
    //     console.log("***********", bufferToHex(keccak256(receiptBuff)));
    // });

    it('receipt', async function () {
        const receiptBuff = toBuffer('0xf906710183aa0943b9010010204000000000000004000080000000000000000000000000010000000000000000000000000000000000000000000202000000080000000000000000280000000000000000000008000008000002600000000000040000000000000000000000000000200000000000000000004000000000000000000000000010000000000000000000000000004000000000000800000000010000080000004000000000020000000000200200000000000010000000000000000000000000000000000040000802000000000000002000000000000000000000001000000000000020000018200000000000000000000000000000000000000000000000000000000000f90566f89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000000000000000000000000001962cde83c99ac832f89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a08c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0fffffffffffffffffffffffffffffffffffffffffffffffa4fbcd49f75a5945af89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca000000000000000000000000000000000000000000000000003bc43ef4c08a8e6f87994e3e15b09e1a8cb96032690448a18173b170a8d5ce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000017bf9d63930dacb54b00000000000000000000000000000000000000000000000037d876b38ca168e53f8fc94e3e15b09e1a8cb96032690448a18173b170a8d5cf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dcb880000000000000000000000000000000000000000000000001962cde83c99ac8320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e6f89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca000000000000000000000000000000000000000000000000000000000061437acf87994b4e16d0168e52d35cacd2c6185b44281ec28c9dce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000000000010c295dbacc7300000000000000000000000000000000000000000000a44929ecfbcd22a6264bf8fc94b4e16d0168e52d35cacd2c6185b44281ec28c9dcf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dcb880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e600000000000000000000000000000000000000000000000000000000061437ac0000000000000000000000000000000000000000000000000000000000000000')

        const tools = await Tools.new();
        const logs = [
            toBuffer('0xf89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000000000000000000000000001962cde83c99ac832'),
            toBuffer('0xf89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a08c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0fffffffffffffffffffffffffffffffffffffffffffffffa4fbcd49f75a5945a'),
            toBuffer('0xf89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca000000000000000000000000000000000000000000000000003bc43ef4c08a8e6'),
            toBuffer('0xf87994e3e15b09e1a8cb96032690448a18173b170a8d5ce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000017bf9d63930dacb54b00000000000000000000000000000000000000000000000037d876b38ca168e53'),
            toBuffer('0xf8fc94e3e15b09e1a8cb96032690448a18173b170a8d5cf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dcb880000000000000000000000000000000000000000000000001962cde83c99ac8320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e6'),
            toBuffer('0xf89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca000000000000000000000000000000000000000000000000000000000061437ac'),
            toBuffer('0xf87994b4e16d0168e52d35cacd2c6185b44281ec28c9dce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000000000010c295dbacc7300000000000000000000000000000000000000000000a44929ecfbcd22a6264b'),
            toBuffer('0xf8fc94b4e16d0168e52d35cacd2c6185b44281ec28c9dcf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dcb880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e600000000000000000000000000000000000000000000000000000000061437ac0000000000000000000000000000000000000000000000000000000000000000'),
        ]
        const status = toBuffer('0x01');
        const gas = toBuffer('0xaa0943');
        const logsBloom = toBuffer('0x10204000000000000004000080000000000000000000000000010000000000000000000000000000000000000000000202000000080000000000000000280000000000000000000008000008000002600000000000040000000000000000000000000000200000000000000000004000000000000000000000000010000000000000000000000000004000000000000800000000010000080000004000000000020000000000200200000000000010000000000000000000000000000000000040000802000000000000002000000000000000000000001000000000000020000018200000000000000000000000000000000000000000000000000000000000');

        // const value = toBuffer('0xf9043a01830196aab9010000200000000000000000000080000000000000000000000000000000000000000000000000000000000000001004000002000000080000000000000000000000000000000000000000000008000000200000000000400000000000000000000000000000000000000000000000000000000000000000040000000010000200000000400000000000000000000000040000080000000000082000004000000000000000000000000000400000000000000000000000000000000100000000000000000102000000000000000000000000000000020000001000000002000000000000200000000000000000000000000000000000000000000000010000000000f9032ff89b947a9277aa08a633766461351ec00996a0cbe905adf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a0000000000000000000000000000000000000000000000008252610ddca3f2a7cf89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87994e1ee482eefd3fc379b7154399f8d52956fb3c520e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000008137f863472c77294900000000000000000000000000000000000000000000000665553354489d7a49f8fc94e1ee482eefd3fc379b7154399f8d52956fb3c520f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965b880000000000000000000000000000000000000000000000008252610ddca3f2a7c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a07fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca9');
        const encodedPath = encode(202);
        const proofs = toBuffer('0xf90b16b90134f90131a0da224d56bce5841673a059da3d3625b5d14b3d95e1333253df4853d4de332e84a099c693c82f2c8883be479ef1f729d3fe3bb865f5f81d3239f810b047cd1aac0ea031e20b5e3ff892f350e1b0769ab0957ac295f9000d2170c9b86c1dfde38067d4a07378e0c3c8a819f6c7fde2e6a39d2c304088d2465cdb192c3766d5d8073432d8a00363d020fd44a89dabf2c1663117dde76f88c842e03de3daacece3ec9b79e63aa0a33dbe0b21cca068091b3443dd16f895fbb8c12b44891c8a51054e45ff3bf39da0d71863db1af1486822e0c6700c0ea8c912853b9eed6d90d078a788ca0118370fa0a3da2ffc13ffec1a9aa3891f72db9a430fa6470308e011583c67a339ec77c9bea0895072c8b994ad86b685735475dd335b06bdeaf7f6c7398bdebf09686314ee078080808080808080b853f851a0a55653bbffc1067439bfb89d05461769df318adb2185f30f91daf45126b9f494a060e55c1901f62e70f3f5bc6de8e57c4f41b097819fb7ec3303ade67513d4580e808080808080808080808080808080b8f3f8f18080808080808080a010cfa7e22390867ee4f26da6f25015c9414792254586e691815cedbbf577aaf7a0f1e1fb8fa10c2159e9223a38a24e052ae57cac8ec037ec8d3a20f16f178a6023a0b27bdd11afc091ad40aa7957644d7f1e5c8f9a96676ff3dedc64aa0c97182aeca0b0d8e125e12e8570889471702bcf7051fabe9a2d8f7e7f7d0549269ebad01f4ca01626007d2353c6ccf3426468d1bc52f396e7364f928bc8cd7a6893de9d5bb01ba006cc8640fcfb553788f1f0bd3aec0f165c6d4138af421586add017e4acff96dda0792448deb180ce9ba0900b50812ddce0daae9a829a7a580532fb63736c9d2cbf8080b90214f90211a0a44a67d5ff87c03f633e3aac61cd4b8a4b624bfccdeea56b57b6909ed25e62c1a089bc59201eae47153b33f62586f10252de177dccd4564948e3fbcf50ec1574ada049ed0b3e5cbf578115c0dc3a66b12d4382f2cf8aa20ecafb34a5a688a2fcb138a09dc4769b53d45287ddf8629b68f9c09347d6efa261e6bcd2022ea9ae7eb8d0e3a0451b664bee5372f866585f2e8c514159b9eb0bf2d8434b41560404d3aa28f463a025067272615e2557f3ba884946aa80e9c0ca23c0d0f1236624ae7b3f2d7fe421a0d4e653d7e75959d2eb32ca0a6f3caf76bba465b64e87529af325224284401cd0a07d685915f903eb6593155a9d63f89e2bbbfed5376510c8ef13931d3dad4cca8fa091970fdf843fd9bc8e357d08cbda05743bb854f4b0aafa20afac045d6f62a0a4a0c29bdb1d6825cb720fe7333851a63527496673b4aae7823a2e96366ebb62a7baa0ea7cd42f8b7660e5d2685251e6a86c072041234f86086db40c1d10fb839ffd8fa01ca000a11b4f9f324665e9ad6d58ceac43b2800b1a359370727ded254ee60c04a076b7d0f27427b4f6f71f6115c09368ec20bbc0239d5a18dd2cf5aec7d77f5bf0a063c482ac3446f9a579fd4f8ace5978b31cf3d09a9a04b6038b10066dc506de7ca029fdb28c55e40a74d4918274d684f6fe3db7666d6803499863b1c70098535f21a0478693adc33d27b33ddd223bd950b7d70bee0ab67a8fe4dc3996b7d9a5d99e8780b9067bf9067820b90674f906710183aa0943b9010010204000000000000004000080000000000000000000000000010000000000000000000000000000000000000000000202000000080000000000000000280000000000000000000008000008000002600000000000040000000000000000000000000000200000000000000000004000000000000000000000000010000000000000000000000000004000000000000800000000010000080000004000000000020000000000200200000000000010000000000000000000000000000000000040000802000000000000002000000000000000000000001000000000000020000018200000000000000000000000000000000000000000000000000000000000f90566f89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000000000000000000000000001962cde83c99ac832f89b94021576770cb3729716ccfb687afdb4c6bf720cb6f863a08c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0fffffffffffffffffffffffffffffffffffffffffffffffa4fbcd49f75a5945af89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e3e15b09e1a8cb96032690448a18173b170a8d5ca0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca000000000000000000000000000000000000000000000000003bc43ef4c08a8e6f87994e3e15b09e1a8cb96032690448a18173b170a8d5ce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000017bf9d63930dacb54b00000000000000000000000000000000000000000000000037d876b38ca168e53f8fc94e3e15b09e1a8cb96032690448a18173b170a8d5cf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dcb880000000000000000000000000000000000000000000000001962cde83c99ac8320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e6f89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dca0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dca000000000000000000000000000000000000000000000000000000000061437acf87994b4e16d0168e52d35cacd2c6185b44281ec28c9dce1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000000000010c295dbacc7300000000000000000000000000000000000000000000a44929ecfbcd22a6264bf8fc94b4e16d0168e52d35cacd2c6185b44281ec28c9dcf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000efd0199657b444856e3259ed8e3c39ee43cf51dcb880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc43ef4c08a8e600000000000000000000000000000000000000000000000000000000061437ac0000000000000000000000000000000000000000000000000000000000000000');
        const root = toBuffer('0x8a5249ef06503334c704b7606ef0f0306cb0d2474e069050a77a46c7cb52faed');

        const result = await tools.verifyReceipt(
            root,
            ensureByte(encodedPath.toString('hex')),
            ensureByte(proofs.toString('hex')),
            status,
            gas,
            logsBloom,
            logs);

        // 思路应该是插入所有，然后在solidity中解析，然后比对地址和事件类型
        console.log("-----------", result);
        console.log("***********", bufferToHex(keccak256(receiptBuff)));




        // it('Test', async function () {
        //     const te = await TestRLP.new();
        //     const proofs = toBuffer('0xf905d3b90134f90131a0da224d56bce5841673a059da3d3625b5d14b3d95e1333253df4853d4de332e84a099c693c82f2c8883be479ef1f729d3fe3bb865f5f81d3239f810b047cd1aac0ea031e20b5e3ff892f350e1b0769ab0957ac295f9000d2170c9b86c1dfde38067d4a07378e0c3c8a819f6c7fde2e6a39d2c304088d2465cdb192c3766d5d8073432d8a00363d020fd44a89dabf2c1663117dde76f88c842e03de3daacece3ec9b79e63aa0a33dbe0b21cca068091b3443dd16f895fbb8c12b44891c8a51054e45ff3bf39da0d71863db1af1486822e0c6700c0ea8c912853b9eed6d90d078a788ca0118370fa0a3da2ffc13ffec1a9aa3891f72db9a430fa6470308e011583c67a339ec77c9bea0895072c8b994ad86b685735475dd335b06bdeaf7f6c7398bdebf09686314ee078080808080808080b853f851a0a55653bbffc1067439bfb89d05461769df318adb2185f30f91daf45126b9f494a060e55c1901f62e70f3f5bc6de8e57c4f41b097819fb7ec3303ade67513d4580e808080808080808080808080808080b90444f9044120b9043df9043a01830196aab9010000200000000000000000000080000000000000000000000000000000000000000000000000000000000000001004000002000000080000000000000000000000000000000000000000000008000000200000000000400000000000000000000000000000000000000000000000000000000000000000040000000010000200000000400000000000000000000000040000080000000000082000004000000000000000000000000000400000000000000000000000000000000100000000000000000102000000000000000000000000000000020000001000000002000000000000200000000000000000000000000000000000000000000000010000000000f9032ff89b947a9277aa08a633766461351ec00996a0cbe905adf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a0000000000000000000000000000000000000000000000008252610ddca3f2a7cf89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000e1ee482eefd3fc379b7154399f8d52956fb3c520a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87994e1ee482eefd3fc379b7154399f8d52956fb3c520e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000000000008137f863472c77294900000000000000000000000000000000000000000000000665553354489d7a49f8fc94e1ee482eefd3fc379b7154399f8d52956fb3c520f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965b880000000000000000000000000000000000000000000000008252610ddca3f2a7c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006dd1d3e675d12ca8f87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a07fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65a00000000000000000000000003e1804fa401d96c48bed5a9de10b6a5c99a53965a00000000000000000000000000000000000000000000000006dd1d3e675d12ca9');

        //     const result = await te.test(proofs);
        //     console.log(result);
        // });
    });

    // left-pad half-bytes
    function ensureByte(s) {
        if (s.substr(0, 2) == '0x') { s = s.slice(2); }
        if (s.length % 2 == 0) { return `0x${s}`; }
        else { return `0x0${s}`; }
    }
});