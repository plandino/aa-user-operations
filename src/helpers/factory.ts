import { Abi, Address, BaseError, ContractFunctionRevertedError, encodeFunctionData } from "viem";
import { publicClient } from "./clients";
import { ENTRY_POINT_ADDRESS } from "../constants/addresses";
import { ENTRY_POINT_ABI } from "../constants/abis";
import { SenderAndFactoryData } from "../types";

export const sender = async ({
    initCode
}: {
    initCode: Address;
}): Promise<Address> => {
    console.log(`Getting sender from EntryPoint with initcode: ${initCode}`);
    try {
        // Executes the getSenderAddress method in the factory contract
        // which reverts and returns the sender address
        await publicClient.readContract({
            address: ENTRY_POINT_ADDRESS,
            abi: ENTRY_POINT_ABI,
            functionName: 'getSenderAddress',
            args: [initCode]
        });
    } catch (error: unknown) {
        if (error instanceof BaseError) {
            // Walk through the error to get the sender address
            const revertError = error.walk(err => err instanceof ContractFunctionRevertedError)
            if (revertError instanceof ContractFunctionRevertedError) {
                const sender = revertError.data?.args?.[0] as Address;
                console.log('Got sender: ', sender);
                return sender;
            }
          }
    }
    throw new Error('Something is broken, sender does not exist. Sender: 0x');
}

export const senderAndFactoryData = async ({
    createAccountFunctionName,
    createAccountArgs,
    factoryAbi,
    factoryAddress,
}: {
    createAccountArgs: any[];
    createAccountFunctionName: string;
    factoryAbi: Abi;
    factoryAddress: Address;
}): Promise<SenderAndFactoryData>  => {
    // Encodes the calldata used for creating an account with the factory
    let factoryData = encodeFunctionData({
        abi: factoryAbi,
        functionName: createAccountFunctionName,
        args: createAccountArgs,
    });

    // Hex concatenation of the factory address with the calldata for creating the account
    let initCode = factoryAddress + factoryData.slice(2) as Address;

    // Get the sender address
    const senderAddress = await sender({ initCode });

    // Get the bytecode of the sender address
    const bytecode = await publicClient.getCode({ address: senderAddress })
    
    // Create return object
    const senderAndInitCode: SenderAndFactoryData = {
        sender: senderAddress,
        // If there is bytecode at the `sender` address, it means that the contract has already been deployed and
        // `factory` and `factoryData` should be 0x (or null in the case of Pimlico)
        factory: bytecode !== '0x' ? null : factoryAddress,
        factoryData: bytecode !== '0x' ? null : factoryData,
    }

    return senderAndInitCode;
}