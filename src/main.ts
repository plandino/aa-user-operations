import { Abi, Address, encodeFunctionData, Hex, PrivateKeyAccount } from 'viem';
import { addGasFields } from './helpers/gas';
import { signUserOp } from './helpers/signing';
import { eth_getUserOperationReceipt, eth_sendUserOperation } from './helpers/https';
import { nonce } from './helpers/nonce';
import { senderAndFactoryData } from './helpers/factory';

export const sendUserOperation = async ({
  accountFunctionName,
  accountFunctionArgs,
  createAccountFunctionName,
  createAccountArgs,
  factoryAbi,
  factoryAddress,
  accountAbi,
  account,
  rpcUrl,
}: {
  accountFunctionName: string;
  /**
   * Account function args can be of two types:
   *   - For transfers: [targetAddress, value, "0x"]
   *     The last argument is the calldata field, which is empty
   *   - For contract call: [contractAddress, value, calldata]
   *     Pass a value only if you wish to send some ether along with the call
   */
  accountFunctionArgs: any[];
  createAccountFunctionName: string;
  createAccountArgs: any[];
  factoryAddress: Address;
  factoryAbi: Abi;
  accountAbi: Abi;
  account?: PrivateKeyAccount;
  rpcUrl: string;
}) => {
  const { sender, factory, factoryData } = await senderAndFactoryData({
    createAccountFunctionName,
    createAccountArgs,
    factoryAbi,
    factoryAddress,
  });

  console.log('Getting calldata');
  const callData = encodeFunctionData({
    abi: accountAbi,
    functionName: accountFunctionName,
    args: accountFunctionArgs,
  });

  console.log('Got callData: ', callData);

  console.log('Assembling the base of the User Operation');
  const userOp = {
    // Base params
    sender: sender,
    factory,
    factoryData,
    nonce: await nonce({ sender }),
    callData,

    // Dummy signature, needs to be there until real signature
    signature:
      '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c' as Hex,
  };

  const userOpWithGasValues = await addGasFields({ userOp, rpcUrl });

  console.log('User Operation with gas values: ', userOpWithGasValues);

  console.log('Signing User Operation');
  const signedUserOperation = await signUserOp({
    account,
    userOp: userOpWithGasValues,
  });

  console.log('Got Signed User Operation: ', signedUserOperation, '\n');

  console.log('Sending User Operation');
  const userOperationHash = await eth_sendUserOperation(signedUserOperation, rpcUrl);
  console.log('User Operation Hash: ', userOperationHash);

  // Waits for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log('Getting User Operation Receipt');
  const userOperationReceipt = await eth_getUserOperationReceipt(userOperationHash.result, rpcUrl);
  console.log('Got Operation Receipt: ', userOperationReceipt);
  return { userOperationReceipt, userOperationHash };
};
