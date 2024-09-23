import { ENTRY_POINT_ADDRESS } from '../constants/addresses';

import { PrivateKeyAccount } from 'viem/accounts';
import { getUserOperationHash } from './packUserOp';

export const signUserOp = async ({
  account,
  userOp,
}: {
  account: PrivateKeyAccount;
  userOp: object;
}) => {
  console.log('Getting UserOp Hash');
  const userOperationHash = getUserOperationHash({
    userOperation: userOp,
    entryPointAddress: ENTRY_POINT_ADDRESS,
    chainId: 421614n,
  });

  console.log('UserOp Hash: ', userOperationHash);

  // Sign the User Operation Hash
  const signature = await account.signMessage({ message: { raw: userOperationHash } });

  // Return signed User Operation
  return {
    ...userOp,
    signature,
  };
};
