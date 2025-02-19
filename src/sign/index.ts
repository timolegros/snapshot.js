import fetch from 'cross-fetch';
import { getAddress } from '@ethersproject/address';
import {
  Space,
  Proposal,
  UpdateProposal,
  FlagProposal,
  CancelProposal,
  Vote,
  Follow,
  Unfollow,
  Subscribe,
  Unsubscribe,
  Profile,
  Alias,
  DeleteSpace,
  Statement,
  spaceTypes,
  proposalTypes,
  updateProposalTypes,
  flagProposalTypes,
  cancelProposalTypes,
  cancelProposal2Types,
  voteTypes,
  voteArrayTypes,
  voteStringTypes,
  vote2Types,
  voteArray2Types,
  voteString2Types,
  followTypes,
  subscribeTypes,
  unfollowTypes,
  unsubscribeTypes,
  profileTypes,
  aliasTypes,
  deleteSpaceType,
  statementTypes,
  Providers,
  Messages,
  MessageTypes
} from './types';
import constants from '../constants.json';
import { getChainId, signTypedData } from './utils';

const NAME = 'snapshot';
const VERSION = '0.1.4';

export const domain: {
  name: string;
  version: string;
  chainId?: number;
} = {
  name: NAME,
  version: VERSION
  // chainId: 1
};

export class Client {
  readonly address: string;
  readonly options: any;

  constructor(address: string = constants.mainnet.sequencer, options = {}) {
    address = address.replace(
      constants.mainnet.hub,
      constants.mainnet.sequencer
    );
    address = address.replace(
      constants.testnet.hub,
      constants.testnet.sequencer
    );
    address = address.replace(constants.local.hub, constants.local.sequencer);
    this.address = address;
    this.options = options;
  }

  async sign(
    provider: Providers,
    address: string,
    message: Messages,
    types: MessageTypes,
    primaryType: string
  ) {
    const checksumAddress = getAddress(address);
    if ('from' in message && typeof message.from === 'string')
      message.from = getAddress(message.from);
    else message.from = checksumAddress;
    if (!message.timestamp)
      message.timestamp = parseInt((Date.now() / 1e3).toFixed());

    const domainData = {
      ...domain
    };
    if (
      typeof window !== 'undefined' &&
      'ethereum' in window &&
      typeof window.ethereum === 'object' &&
      window.ethereum &&
      'isTrust' in window.ethereum &&
      window.ethereum?.isTrust
    ) {
      domainData.chainId = await getChainId(provider);
    }
    const data = { domain: domainData, types, message };
    const sig = await signTypedData(
      provider,
      checksumAddress,
      domainData,
      types,
      message,
      primaryType
    );
    return await this.send({ address: checksumAddress, sig, data });
  }

  async send(envelop: Record<string, unknown>) {
    let address = this.address;
    if (envelop.sig === '0x' && this.options.relayerURL)
      address = this.options.relayerURL;
    const init = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelop)
    };
    return new Promise((resolve, reject) => {
      fetch(address, init)
        .then((res) => {
          if (res.ok) return resolve(res.json());
          if (res.headers.get('content-type')?.includes('application/json'))
            return res.json().then(reject).catch(reject);
          throw res;
        })
        .catch(reject);
    });
  }

  async space(provider: Providers, address: string, message: Space) {
    return await this.sign(provider, address, message, spaceTypes, 'Space');
  }

  async proposal(provider: Providers, address: string, message: Proposal) {
    if (!message.discussion) message.discussion = '';
    if (!message.app) message.app = '';
    if (!message.privacy) message.privacy = '';
    return await this.sign(
      provider,
      address,
      message,
      proposalTypes,
      'Proposal'
    );
  }

  async updateProposal(
    provider: Providers,
    address: string,
    message: UpdateProposal
  ) {
    if (!message.privacy) message.privacy = '';
    return await this.sign(
      provider,
      address,
      message,
      updateProposalTypes,
      'UpdateProposal'
    );
  }

  async flagProposal(
    provider: Providers,
    address: string,
    message: FlagProposal
  ) {
    return await this.sign(
      provider,
      address,
      message,
      flagProposalTypes,
      'FlagProposal'
    );
  }

  async cancelProposal(
    provider: Providers,
    address: string,
    message: CancelProposal
  ) {
    const type2 = message.proposal.startsWith('0x');
    return await this.sign(
      provider,
      address,
      message,
      type2 ? cancelProposal2Types : cancelProposalTypes,
      'CancelProposal'
    );
  }

  async vote(provider: Providers, address: string, message: Vote) {
    const isShutter = message?.privacy === 'shutter';
    if (!message.reason) message.reason = '';
    if (!message.app) message.app = '';
    if (!message.metadata) message.metadata = '{}';
    const type2 = message.proposal.startsWith('0x');
    let type = type2 ? vote2Types : voteTypes;
    if (['approval', 'ranked-choice'].includes(message.type))
      type = type2 ? voteArray2Types : voteArrayTypes;
    if (!isShutter && ['quadratic', 'weighted'].includes(message.type)) {
      type = type2 ? voteString2Types : voteStringTypes;
      message.choice = JSON.stringify(message.choice);
    }
    if (isShutter) type = type2 ? voteString2Types : voteStringTypes;
    delete message.privacy;
    // @ts-ignore
    delete message.type;
    return await this.sign(provider, address, message, type, 'Vote');
  }

  async follow(provider: Providers, address: string, message: Follow) {
    return await this.sign(provider, address, message, followTypes, 'Follow');
  }

  async unfollow(provider: Providers, address: string, message: Unfollow) {
    return await this.sign(
      provider,
      address,
      message,
      unfollowTypes,
      'Unfollow'
    );
  }

  async subscribe(provider: Providers, address: string, message: Subscribe) {
    return await this.sign(
      provider,
      address,
      message,
      subscribeTypes,
      'Subscribe'
    );
  }

  async unsubscribe(
    provider: Providers,
    address: string,
    message: Unsubscribe
  ) {
    return await this.sign(
      provider,
      address,
      message,
      unsubscribeTypes,
      'Unsubscribe'
    );
  }

  async profile(provider: Providers, address: string, message: Profile) {
    return await this.sign(provider, address, message, profileTypes, 'Profile');
  }

  async statement(provider: Providers, address: string, message: Statement) {
    return await this.sign(
      provider,
      address,
      message,
      statementTypes,
      'Statement'
    );
  }

  async alias(provider: Providers, address: string, message: Alias) {
    return await this.sign(provider, address, message, aliasTypes, 'Alias');
  }

  async deleteSpace(
    provider: Providers,
    address: string,
    message: DeleteSpace
  ) {
    return await this.sign(
      provider,
      address,
      message,
      deleteSpaceType,
      'DeleteSpace'
    );
  }
}

export default Client;
