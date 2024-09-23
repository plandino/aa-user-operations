import axios from 'axios';
import { ENTRY_POINT_ADDRESS } from '../constants/addresses';
import {
  GasPrices,
  GasPricesResponse,
  PaymasterAndGasData,
  PaymasterAndGasDataResponse,
  UserOperationReceipt,
  UserOperationResult,
  UserOperationStatusResponse,
} from '../types';

/** Plimco: get 'maxFeePerGas' and 'maxPriorityFeePerGas' **/
export async function getUserOperationGasPrice(rpcUrl: string): Promise<GasPrices> {
  console.log('Getting gas prices for user operation from pimlico_getUserOperationGasPrice.');
  const options = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'pimlico_getUserOperationGasPrice',
      params: [],
    },
  };
  try {
    const response = await axios.request<GasPricesResponse>(options);
    if (response.status === 200) {
      console.log('Got response: \n', response.data);
      return response.data.result;
    }
    console.log('Got response code: \n', response.status);
    throw response.data;
  } catch (error) {
    console.error('Error when calling pimlico_getUserOperationGasPrice. ', error);
    throw error;
  }
}

/** eth_estimateUserOperationGas **/
export async function estimateUserOperationGas(
  userOperation: object,
  rpcUrl: string
): Promise<PaymasterAndGasData> {
  console.log('Estimating PaymasterAndGasData from pimlico using eth_estimateUserOperationGas.');
  const options = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_estimateUserOperationGas',
      params: [userOperation, ENTRY_POINT_ADDRESS],
    },
  };
  try {
    const response = await axios.request<PaymasterAndGasDataResponse>(options);
    if (response.status === 200) {
      console.log('Got response: \n', response.data);
      return response.data.result;
    }
    console.log('Got response code: \n', response.status);
    throw response.data;
  } catch (error) {
    console.error('Error when calling eth_estimateUserOperationGas. ', error);
    throw error;
  }
}

/** eth_sendUserOperation **/
export async function eth_sendUserOperation(
  userOperation: object,
  rpcUrl: string
): Promise<UserOperationResult> {
  console.log('Sending User Operation using eth_eth_sendUserOperation.');
  const options = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_sendUserOperation',
      params: [userOperation, ENTRY_POINT_ADDRESS],
    },
  };
  try {
    const response = await axios.request<UserOperationResult>(options);
    if (response.status === 200) {
      console.log('Got response: \n', response.data);
      return response.data;
    }
    console.log('Got response code: \n', response.status);
    throw response.data;
  } catch (error) {
    console.error('Error when calling eth_sendUserOperation. ', error);
    throw error;
  }
}

/** eth_getUserOperationReceipt **/
export async function eth_getUserOperationReceipt(
  userOperationHash: string,
  rpcUrl: string
): Promise<UserOperationReceipt> {
  console.log('Getting User Operation Receipt using eth_getUserOperationReceipt.');
  const options = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getUserOperationReceipt',
      params: [userOperationHash],
    },
  };
  try {
    const response = await axios.request<UserOperationReceipt>(options);
    if (response.status === 200) {
      console.log('Got response: \n', response.data);
      return response.data;
    }
    console.log('Got response code: \n', response.status);
    throw response.data;
  } catch (error) {
    console.error('Error when calling eth_getUserOperationReceipt. ', error);
    throw error;
  }
}

/** pimlico_getUserOperationStatus **/
export async function pimlico_getUserOperationStatus(
  userOperationHash: string,
  rpcUrl: string
): Promise<UserOperationStatusResponse> {
  console.log('Sending User Operation using eth_pimlico_getUserOperationStatus.');
  const options = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'pimlico_getUserOperationStatus',
      params: [userOperationHash],
    },
  };
  try {
    const response = await axios.request<UserOperationStatusResponse>(options);
    if (response.status === 200) {
      console.log('Got response: \n', response.data);
      return response.data;
    }
    console.log('Got response code: \n', response.status);
    throw response.data;
  } catch (error) {
    console.error('Error when calling pimlico_getUserOperationStatus. ', error);
    throw error;
  }
}
