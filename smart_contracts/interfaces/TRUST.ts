// SPDX-License-Identifier: MIT
import { Address } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

export interface ITRUST  {
  setStakingAddress: (
    _stakingAddress: string
  ) => Promise<ethers.ContractTransaction>;
  admin: () => Promise<string>;
  airdropReserve: () => Promise<ethers.BigNumberish>;
  stakingAddress: () => Promise<string>;
}
