# aa-userop

## Usage

```typescript
const FACTORY_ADDRESS = '0x...'; // Factory address
const TARGET_WALLET_ADDRESS = '0x...';

const RPC_URL = "https://api.pimlico.io/v2/...";
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