import type { Address, Hash, Hex } from 'viem';
import { concat, encodeAbiParameters, keccak256, pad, toHex } from 'viem';

export const packUserOp = ({
  userOperation,
}: {
  // @typescript-eslint/no-explicit-any
  userOperation: any;
}): Hex => {
  console.log('Calculatig hashedInitCode');
  const hashedInitCode = keccak256(
    userOperation.factory && userOperation.factoryData
      ? concat([userOperation.factory, userOperation.factoryData])
      : '0x'
  );
  console.log('HashedInitCode: ', hashedInitCode);
  console.log('Calculatig hashedCallData');
  const hashedCallData = keccak256(userOperation.callData);
  console.log('HashedCallData: ', hashedCallData);

  console.log('Calculatig hashedPaymasterAndData');
  const hashedPaymasterAndData = keccak256(
    userOperation.paymaster
      ? concat([
          userOperation.paymaster,
          pad(toHex(userOperation.paymasterVerificationGasLimit || 0n), {
            size: 16,
          }),
          pad(toHex(userOperation.paymasterPostOpGasLimit || BigInt(0)), {
            size: 16,
          }),
          userOperation.paymasterData || '0x',
        ])
      : '0x'
  );
  console.log('HashedCallData: ', hashedCallData);

  return encodeAbiParameters(
    [
      { type: 'address' },
      { type: 'uint256' },
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'uint256' },
      { type: 'bytes32' },
      { type: 'bytes32' },
    ],
    [
      userOperation.sender as Address,
      userOperation.nonce,
      hashedInitCode,
      hashedCallData,
      concat([
        pad(toHex(userOperation.verificationGasLimit || 0n), {
          size: 16,
        }),
        pad(toHex(userOperation.callGasLimit || 0n), { size: 16 }),
      ]),
      userOperation.preVerificationGas || 0n,
      concat([
        pad(toHex(userOperation.maxPriorityFeePerGas || 0n), {
          size: 16,
        }),
        pad(toHex(userOperation.maxFeePerGas || 0n), { size: 16 }),
      ]),
      hashedPaymasterAndData,
    ]
  );
};

export const getUserOperationHash = ({
  userOperation,
  entryPointAddress,
  chainId,
}: {
  userOperation: object;
  entryPointAddress: Address;
  chainId: bigint;
}): Hash => {
  console.log('Packing User Operation');
  const packedUserOperation = packUserOp({ userOperation });
  console.log('PackedUserOperation: ', packedUserOperation, '\n');
  console.log('Encoding Packed User Operation');
  const encoded = encodeAbiParameters(
    [{ type: 'bytes32' }, { type: 'address' }, { type: 'uint256' }],
    [keccak256(packedUserOperation), entryPointAddress, chainId]
  ) as `0x${string}`;
  console.log('Result: ', encoded, '\n');

  return keccak256(encoded);
};
