import { Address } from "viem";

export type Props = {
    firstName: string;
}

export type SenderAndFactoryData = {
    sender: Address;
    factory: Address | null;
    factoryData: Address | null;
}

export type UserOperationBase = {
    sender: Address;
    nonce: string;
    factory: Address;
    factoryData: string;
    callData: string;
    signature: string;
}

export type EIP1159Fees = {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
}

export type GasPrices = {
    slow: EIP1159Fees;
    standard: EIP1159Fees;
    fast: EIP1159Fees;
}

export type GasPricesResponse = {
    result: GasPrices;
}

export type PaymasterAndGasData = {
    preVerificationGas: string;
    verificationGasLimit: string;
    callGasLimit: string;
    paymasterVerificationGasLimit: string;
    paymasterPostOpGasLimit: string;
}

export type PaymasterAndGasDataResponse = {
    result: PaymasterAndGasData;
}

export type UserOperationResult = {
	result: string;
}

export type UserOperationReceipt = {
	result: {
        receipt: {
            status: string;
            transactionHash: string;
        };
    };
}

export type UserOperationStatusResponse = {
	result: {
        status: string;
        transactionHash: string
    };
}

declare global {
    interface Window {
      ethereum: any;
    }
}