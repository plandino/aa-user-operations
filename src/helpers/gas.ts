import { estimateUserOperationGas, getUserOperationGasPrice } from "./https";

export const addGasFields = async ({ userOp, rpcUrl }: { userOp: object; rpcUrl: string }) => {
    console.log('Adding gas fields to User Operation: ', userOp);
    const { maxFeePerGas, maxPriorityFeePerGas } = (await getUserOperationGasPrice(rpcUrl)).fast;

    console.log('Max Fee Per Gas: ', maxFeePerGas);
    console.log('Max Priority Fee Per Gas: ', maxPriorityFeePerGas);

    const userOpWithGasPrice = {
        ...userOp,
        maxFeePerGas,
        maxPriorityFeePerGas,
    }

    console.log('Getting PaymasterAndGasData for user op: ', userOpWithGasPrice);
    const { 
        preVerificationGas,
        verificationGasLimit,
        callGasLimit,
        paymasterVerificationGasLimit,
        paymasterPostOpGasLimit,
    } = await estimateUserOperationGas(userOpWithGasPrice, rpcUrl);

    return {
        ...userOpWithGasPrice,
        preVerificationGas,
        verificationGasLimit,
        callGasLimit,
        paymasterVerificationGasLimit,
        paymasterPostOpGasLimit,
    }
};
