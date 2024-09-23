import { Address } from 'viem';
import { publicClient } from './clients';
import { ENTRY_POINT_ADDRESS } from '../constants/addresses';
import { ENTRY_POINT_ABI } from '../constants/abis';

// Get the nonce for the sender address
export const nonce = async ({ sender }: { sender: Address }): Promise<string> => {
  console.log('Getting nonce for sender: ', sender);
  const nonce = (await publicClient.readContract({
    address: ENTRY_POINT_ADDRESS,
    abi: ENTRY_POINT_ABI,
    functionName: 'getNonce',
    args: [sender, 0],
  })) as number;

  console.log('Got nonce: ', nonce);

  return '0x' + nonce.toString(16);
};
