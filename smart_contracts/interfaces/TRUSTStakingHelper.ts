// SPDX-License-Identifier: MIT
import { ContractTransaction } from "ethers";

export interface ITRUSTStakingHelper {
  trustToken: () => Promise<string>;
  minStake: () => Promise<string>;
  mainStakingContract: () => Promise<string>;
  owner: () => Promise<string>;
  stake: (amount: string) => Promise<ContractTransaction>;
  transferStake: () => Promise<ContractTransaction>;
  withdraw: () => Promise<ContractTransaction>;
  viewStake: () => Promise<number>;
  stakedAmounts: (minStake: number, userAddress: string) => Promise<number>;
}

