# aa-userop

## Usage

```typescript
// Import function
import { sendUserOperation } from 'aa-userop';

// Declare addresses
const FACTORY_ADDRESS = '0x...';
const TARGET_WALLET_ADDRESS = '0x...';

// Define RPC_URL and account that will sign the User Operations
const RPC_URL = 'https://api.pimlico.io/v2/...';
const account = privateKeyToAccount('0x...');

async function main() {
  await sendUserOperation({
    accountFunctionName: 'execute',
    accountFunctionArgs: [TARGET_WALLET_ADDRESS, 4000000000n, '0x'],
    createAccountFunctionName: 'createAccount',
    createAccountArgs: [TARGET_WALLET_ADDRESS],
    // createAccountArgs: [account.address],
    factoryAddress: FACTORY_ADDRESS,
    factoryAbi: accountFactoryAbi,
    accountAbi: accountAbi,
    account: account,
    rpcUrl: RPC_URL,
  });
}
```
