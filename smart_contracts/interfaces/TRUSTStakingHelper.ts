// SPDX-License-Identifier: MIT
import { ContractTransaction } from "ethers";

export interface ITRUSTStakingHelper {
  trustToken: () => Promise<string>;
  minStake: () => Promise<string>;
  mainStakingContract: () => Promise<string>;
  owner: () => Promise<string>;
  canStake: () => Promise<boolean>;
  stake: (amount: string) => Promise<ContractTransaction>;
  openStaking: () => Promise<ContractTransaction>;
  withdraw: () => Promise<ContractTransaction>;
}
