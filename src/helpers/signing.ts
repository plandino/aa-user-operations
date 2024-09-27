import { ENTRY_POINT_ADDRESS } from '../constants/addresses';

import { PrivateKeyAccount } from 'viem/accounts';
import { getUserOperationHash } from './packUserOp';
import { arbitrumSepolia } from 'viem/chains';
import { createWalletClient, custom } from 'viem';

export const signUserOp = async ({
  account,
  userOp,
}: {
  account?: PrivateKeyAccount;
  userOp: object;
}) => {
  console.log('Getting UserOp Hash');
  const userOperationHash = getUserOperationHash({
    userOperation: userOp,
    entryPointAddress: ENTRY_POINT_ADDRESS,
    chainId: 421614n,
  });

  console.log('UserOp Hash: ', userOperationHash);

  // If got an account from a private key, use it to sign the User Operation
  if (account) {
    return {
      ...userOp,
      signature: await account.signMessage({ message: { raw: userOperationHash } }),
    };
  }

  // Otherwise, use the Wallet Client using the browser's wallet to sign the User Operation
  const client = createWalletClient({
    chain: arbitrumSepolia,
    transport: custom(window.ethereum!),
  });

  const [address] = await client.getAddresses();

  console.log('My Address: ', address);

  // Return signed User Operation
  return {
    ...userOp,
    signature: await client.signMessage({
      account: address,
      message: { raw: userOperationHash },
    }),
  };
};
