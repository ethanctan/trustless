// SPDX-License-Identifier: MIT
import { ContractTransaction } from "ethers";

export interface ITRUST {
  setStakingAddress: (
    stakingAddress: string
  ) => Promise<ContractTransaction>;
  admin: () => Promise<string>;
}

