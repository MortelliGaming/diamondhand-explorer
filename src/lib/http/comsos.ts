
import type { Subscription } from "xstream";

import { 
    type Block, 
    StargateClient,
    defaultRegistryTypes,
    setupStakingExtension,
    setupAuthExtension,
    setupAuthzExtension,
    setupBankExtension,
    setupDistributionExtension,
    setupFeegrantExtension,
    setupGovExtension,
    setupIbcExtension,
    setupMintExtension,
    setupSlashingExtension,
    setupTxExtension,
    QueryClient,
    StakingExtension,
    AuthExtension,
    BankExtension,
    DistributionExtension,
    GovExtension,
    IbcExtension,
    MintExtension,
    TxExtension,
} from '@cosmjs/stargate';

import { type AuthzExtension } from '@cosmjs/stargate/build/modules/authz/queries'
import { type SlashingExtension } from '@cosmjs/stargate/build/modules/slashing/queries'
import { type FeegrantExtension } from '@cosmjs/stargate/build/modules/feegrant/queries'
import { QueryValidatorsResponse, QueryParamsResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query'
import { QueryProposalsResponse, } from 'cosmjs-types/cosmos/gov/v1beta1/query'
import { type QueryParamsResponse as SlashingQueryParametersResponse  } from 'cosmjs-types/cosmos/slashing/v1beta1/query'

import { type BlockchainResponse, NewBlockHeaderEvent, Tendermint37Client, } from "@cosmjs/tendermint-rpc";
import { decodeTxRaw, Registry, GeneratedType } from '@cosmjs/proto-signing';

import { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

import type { ChainInfo } from '@keplr-wallet/types';

import { BondStatusString } from "@cosmjs/stargate/build/modules/staking/queries";
import { SoftwareUpgradeProposal, CancelSoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { MsgSoftwareUpgrade, MsgCancelUpgrade } from 'cosmjs-types/cosmos/upgrade/v1beta1/tx';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params';
import { MsgUpdateParams as MsgFeemarketUpdateParams } from '@/lib/proto/ethermint/feemarket/v1/tx'
import { QueryVoteResponse, QueryVotesResponse } from "@/lib/proto/cosmos/gov/v1beta1/query";
import { QueryValidatorDelegationsResponse } from "@/lib/proto/cosmos/staking/v1beta1/query";
// Map message type strings to decoder functions
export const protoRegistry = new  Registry(defaultRegistryTypes)

protoRegistry.register(SoftwareUpgradeProposal.typeUrl, SoftwareUpgradeProposal)
protoRegistry.register(CancelSoftwareUpgradeProposal.typeUrl, CancelSoftwareUpgradeProposal)
protoRegistry.register(ParameterChangeProposal.typeUrl, ParameterChangeProposal)
protoRegistry.register(MsgCancelUpgrade.typeUrl, MsgCancelUpgrade)
protoRegistry.register(MsgSoftwareUpgrade.typeUrl, MsgSoftwareUpgrade)
protoRegistry.register(MsgFeemarketUpdateParams.typeUrl, MsgFeemarketUpdateParams as GeneratedType)

export type CosmosHelperPublic = {
    GetIsConnecting: () => boolean
    ConnectClients: (keplrConfigs: ChainInfo[]) => void
    GetBlock: (chainId: string, height?: number) => Promise<Block|undefined>
    GetlatestEthTxHashes: (chainId: string)  => string[]
    GetChainInfo: (chainId: string) => Promise<BlockchainResponse|undefined>
    GetBondedValidatorsInfo: (chainId: string) => Promise<QueryValidatorsResponse|undefined>
    GetAllValidators: (chainId: string) => Promise<QueryValidatorsResponse|undefined>
    GetUnbondedValidatorsInfo: (chainId: string) => Promise<QueryValidatorsResponse|undefined>
    GetUnbondingValidatorsInfo: (chainId: string) => Promise<QueryValidatorsResponse|undefined>
    GetStakingParams: (chainId: string) => Promise<QueryParamsResponse|undefined>
    GetSlashingParams: (chainId: string) => Promise<SlashingQueryParametersResponse|undefined>
    GetAllProposals: (chainId: string) => Promise<QueryProposalsResponse|undefined>
    GetProposalValidatorVotes: (chainId: string, proposalId: BigInt, operatorAddress: string) => Promise<QueryVoteResponse|undefined>
    GetProposalVotes: (chainId: string, proposalId: BigInt) => Promise<QueryVotesResponse|undefined>
    GetValidatorDelegations: (chainId: string, valoperAddress: string) => Promise<QueryValidatorDelegationsResponse|undefined>
} & EventTarget

export class EvmTxEvent extends Event {
    constructor(chainId: string, evmChainId: string, txHash: string) {
        super('evmTx');
        this.chainId = chainId;
        this.evmChainId = evmChainId;
        this.txHash = txHash;
    }
    chainId: string;
    evmChainId: string;
    txHash: string;
}

export class CosmosNewBlockheaderEvent extends Event {
    constructor(chainId: string, blockHeight: number) {
        super('cosmosNewBlock');
        this.chainId = chainId;
        this.blockHeight = blockHeight;
    }
    chainId: string;
    blockHeight: number;
}

export class CosmosHelper extends EventTarget {
    constructor(keplrConfigs: ChainInfo[]) {
        super()
        this.isConnecting = false;
        this.starGateClients = {};
        this.tendermintClients = {};
        this.blockHeaderStreams = {};
        this.queryClients = {};
        this.ConnectClients(keplrConfigs)
    }

    private isConnecting: boolean = false;

    private starGateClients: {
        [id: string]: StargateClient
    }

    private tendermintClients: {
        [id: string]: Tendermint37Client
    }

    private queryClients: {
        [id: string]: {
            client: QueryClient,
            extensions: {
                staking: StakingExtension,
                auth: AuthExtension,
                authZ: AuthzExtension,
                bank: BankExtension,
                distribution: DistributionExtension
                feeGrant: FeegrantExtension,
                gov: GovExtension,
                ibc: IbcExtension,
                mint: MintExtension,
                slashing: SlashingExtension,
                tx: TxExtension
            }
        }
    }

    private blockHeaderStreams: {
        [id: string]: Subscription
    }

    private latestEthTxHashes: {[chainId: string] : string[]} = {}
    private numEthTxHashesToKeep = 50


    public GetIsConnecting() {
        return this.isConnecting
    }

    public GetlatestEthTxHashes(chainId: string) : string[] {
        return this.latestEthTxHashes[chainId] || [];
    }
    private addLatestEthTxHashForChain(chainId: string, value: string) {
        // Fügen Sie das neue Element hinzu und entfernen Sie das älteste Element, wenn die maximale Größe erreicht ist
        if(!this.latestEthTxHashes[chainId]) {
            this.latestEthTxHashes[chainId] = []
        }
        this.latestEthTxHashes[chainId].unshift(value); // Fügen Sie das neue Element an Position 0 hinzu
        while (this.latestEthTxHashes[chainId]?.length > this.numEthTxHashesToKeep) {
            // Entfernen Sie das älteste Element, wenn die maximale Größe überschritten wird
            this.latestEthTxHashes[chainId]?.pop();
        }
    }

    private webSocketClosed(chainId: string) {
        console.log('websocket closed ' + chainId)
    }

    private webSocketError(chainId: string, err: any) {
        console.log('websocket error ' + chainId + ': ' + err)
    }

    private NewBlockHeaderEventHandler(chainId: string, blockInfo: NewBlockHeaderEvent) {
        const eventForStore = new CosmosNewBlockheaderEvent(chainId, blockInfo.height)
        this.dispatchEvent(eventForStore)
        // console.log('new Block header received ' + chainId + ': ' + blockInfo.height)
        this.GetBlock(chainId, blockInfo.height).then((newBlockInfo) => {
            for(const tx of newBlockInfo?.txs || []) {
                // console.log(decodeTxRaw(tx))
                const parsedTx = decodeTxRaw(tx)
                for(const msg of parsedTx.body.messages) {
                    // console.log('msg of type '+ msg.typeUrl)
                    try {
                        // console.log(protoRegistry.decode(msg))
                    } catch { 
                        if(msg.typeUrl === '/ethermint.evm.v1.MsgEthereumTx') {
                           // 
                        }
                    }
                    // console.log(decodeMsg)
                }
            }
        })
    }

    public async ConnectClients(keplrConfigs: ChainInfo[]) {
        this.isConnecting = true;
        for(const chainInfo of keplrConfigs){
            try {
                await this.starGateClients[chainInfo.chainId]?.disconnect()
                await this.tendermintClients[chainInfo.chainId]?.disconnect()
                this.blockHeaderStreams[chainInfo.chainId]?.unsubscribe();
            } catch { /** */}

            try {
                const tendermintClient = await Tendermint37Client.connect(chainInfo.rpc.replace('https', 'wss'))
                const queryClient = QueryClient.withExtensions(tendermintClient)
                this.queryClients[chainInfo.chainId] = {
                    client: queryClient,
                    extensions: {
                        staking: setupStakingExtension(queryClient),
                        auth: setupAuthExtension(queryClient),
                        authZ: setupAuthzExtension(queryClient),
                        bank: setupBankExtension(queryClient),
                        distribution: setupDistributionExtension(queryClient),
                        feeGrant: setupFeegrantExtension(queryClient),
                        gov: setupGovExtension(queryClient),
                        ibc: setupIbcExtension(queryClient),
                        mint: setupMintExtension(queryClient),
                        slashing: setupSlashingExtension(queryClient),
                        tx: setupTxExtension(queryClient),
                    }
                }
                // store client and open stream
                this.tendermintClients[chainInfo.chainId] = tendermintClient
                const newBlockHeaderStream = this.tendermintClients[chainInfo.chainId].subscribeNewBlockHeader()
                // subscribe new block header
                const subscription = newBlockHeaderStream.subscribe({
                    next: (event: NewBlockHeaderEvent) => this.NewBlockHeaderEventHandler(chainInfo.chainId, event),
                    error: (error) => this.webSocketError(chainInfo.chainId, error),
                    complete: () => this.webSocketClosed(chainInfo.chainId)
                });
                this.blockHeaderStreams[chainInfo.chainId] = subscription
            } catch(err) {
                console.error('err subscribe blockheader and create query clients '+ chainInfo.chainId)
                console.error(err)
            }

            // connect stargate client
            try {
                const stargateClient = await StargateClient.connect(chainInfo.rpc)
                this.starGateClients[chainInfo.chainId] = stargateClient
            } catch(err) {
                console.error('could not connect stargate client for '+ chainInfo.chainId)
                console.error(err)
            }
        }
        this.isConnecting = false;
    }

    public async GetBlock(chainId: string, height?: number) {
        if(this.starGateClients[chainId]) {
            return this.starGateClients[chainId].getBlock(height);
        }
    }
    public async GetChainInfo(chainId: string) {
        if(this.starGateClients[chainId]) {
            return this.tendermintClients[chainId].blockchain();
        }
    }
    public async GetAllValidators(chainId: string) {
        const response = {
            validators: []
        } as QueryValidatorsResponse
        if(this.queryClients[chainId]) {
            for(const bondStatus of ['BOND_STATUS_BONDED','BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING']) {
                try {
                    const validators = await this.queryClients[chainId].extensions.staking.staking.validators(bondStatus as BondStatusString)
                    while (validators.pagination && validators.pagination.nextKey.length > 0) {
                        try {
                            const nextResult = await this.queryClients[chainId].extensions.staking.staking.validators(bondStatus as BondStatusString, validators.pagination.nextKey)
                            validators.validators.push(...nextResult.validators)
                            validators.pagination = nextResult.pagination
                        } catch {
                            validators.pagination = undefined
                        }
                    }
                    response.validators.push(...validators.validators)
                } catch(err) { 
                    console.error('error fetching validator infos: ', err)
                }
            }
        }
        return Promise.resolve(response);
    }
    public async GetBondedValidatorsInfo(chainId: string) {
        if(this.queryClients[chainId]) {
            return this.queryClients[chainId].extensions.staking.staking.validators('BOND_STATUS_BONDED');
        }
    }
    public async GetUnbondedValidatorsInfo(chainId: string) {
        if(this.queryClients[chainId]) {
            return this.queryClients[chainId].extensions.staking.staking.validators('BOND_STATUS_UNBONDED');
        }
    }
    public async GetUnbondingValidatorsInfo(chainId: string) {
        if(this.queryClients[chainId]) {
            return this.queryClients[chainId].extensions.staking.staking.validators('BOND_STATUS_UNBONDING');
        }
    }
    public async GetStakingParams(chainId: string) {
        if(this.queryClients[chainId]) {
            return this.queryClients[chainId].extensions.staking.staking.params();
        }
    }
    public async GetSlashingParams(chainId: string) {
        if(this.queryClients[chainId]) {
            return this.queryClients[chainId].extensions.slashing.slashing.params();
        }
    }
    public async GetAllProposals(chainId: string) {
        if(this.queryClients[chainId]) {
            const response = {
                proposals: []
            } as QueryProposalsResponse

            for(const proposalStatus of [ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD, ProposalStatus.PROPOSAL_STATUS_FAILED, ProposalStatus.PROPOSAL_STATUS_PASSED, ProposalStatus.PROPOSAL_STATUS_REJECTED, ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD]) {
                try {
                    const proposals = await this.queryClients[chainId].extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '')
                    while (proposals.pagination && proposals.pagination.nextKey.length  > 0) {
                        try {
                            const nextResult = await this.queryClients[chainId].extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '', proposals.pagination.nextKey)
                            proposals.proposals.push(...nextResult.proposals)
                            proposals.pagination = nextResult.pagination
                        } catch {
                            proposals.pagination = undefined
                            proposals.proposals = []
                        }
                    }
                    response.proposals.push(...proposals.proposals)
                } catch(err) { 
                    console.error('error fetching validator infos: ', err)
                }
            }
            return Promise.resolve(response)
        }
        return Promise.resolve(undefined)
    }

    public async GetProposalValidatorVotes(chainId: string, proposalId: BigInt, operatorAddress: string) {
        if(this.queryClients[chainId]) {
            try {
                return this.queryClients[chainId].extensions.gov.gov.vote(proposalId.toString(), operatorAddress);
            } catch {
                return Promise.resolve(undefined)
            }
        }
    }
    public async GetProposalVotes(chainId: string, proposalId: BigInt) {
        const response = {
            votes: []
        } as QueryVotesResponse

        if(this.queryClients[chainId]) {
            try {
                const votes = await this.queryClients[chainId].extensions.gov.gov.votes(proposalId.toString());
                while (votes.pagination && votes.pagination.nextKey.length > 0) {
                    try {
                        const nextResult = await this.queryClients[chainId].extensions.gov.gov.votes(proposalId.toString())
                        votes.votes.push(...nextResult.votes)
                        votes.pagination = nextResult.pagination
                    } catch {
                        votes.pagination = undefined
                    }
                }
                response.votes = votes.votes
            } catch {
                return Promise.resolve(undefined)
            }
        }
        return Promise.resolve(response)
    }

    public async GetValidatorDelegations(chainId: string, valoperAddress: string) {
        const response = {
            delegationResponses: []
        } as QueryValidatorDelegationsResponse

        if(this.queryClients[chainId]) {
            try {
                const delegations = await this.queryClients[chainId].extensions.staking.staking.validatorDelegations(valoperAddress)
                while (delegations.pagination && delegations.pagination.nextKey.length > 0) {
                    try {
                        const nextResult = await this.queryClients[chainId].extensions.staking.staking.validatorDelegations(valoperAddress, delegations.pagination.nextKey)
                        delegations.delegationResponses.push(...nextResult.delegationResponses)
                        delegations.pagination = nextResult.pagination
                    } catch {
                        delegations.pagination = undefined
                    }
                }
                response.delegationResponses.push(...delegations.delegationResponses)
            } catch(err) { 
                console.error('error fetching validator infos: ', err)
            }
        }
        return Promise.resolve(response)
    }
}