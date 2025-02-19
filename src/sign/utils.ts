import { Domain, Providers } from './types';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Web3Eth } from 'web3-eth';
import { WalletClient } from 'viem';
import { FMT_NUMBER, FMT_BYTES } from 'web3-types';

export async function getChainId(provider: Providers) {
  if (provider instanceof Web3Provider) {
    const network = await provider.getNetwork();
    return network.chainId;
  } else if (provider instanceof Wallet) {
    return await provider.getChainId();
  } else if (provider instanceof Web3Eth) {
    return await provider.getChainId({
      number: FMT_NUMBER.NUMBER,
      bytes: FMT_BYTES.HEX
    });
  } else {
    return await (provider as WalletClient).getChainId();
  }
}

export async function signTypedData(
  provider: Providers,
  from: string,
  domain: Domain,
  types: Record<string, any>,
  message: Record<string, any>,
  primaryType: string
): Promise<string> {
  if (provider instanceof Web3Provider) {
    const signer = provider.getSigner();
    return await signer._signTypedData(domain, types, message);
  } else if (provider instanceof Wallet) {
    return await provider._signTypedData(domain, types, message);
  } else if (provider instanceof Web3Eth) {
    return await provider.signTypedData(
      from,
      { domain, types: <any>types, message, primaryType },
      false
    );
  } else {
    // Assume the remaining case is a WalletClient from viem which supports a promise-based signTypedData.
    // Its API might expect an object with the signing parameters.
    return await (provider as WalletClient).signTypedData({
      account: from as `0x${string}`,
      domain,
      types,
      message,
      primaryType
    });
  }
}
