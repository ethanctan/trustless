import { ContractTransaction, BigNumberish } from "ethers";

export interface ITRUSTStaking {
  owner: () => Promise<string>;
  trustToken: () => Promise<string>;
  insertAirdrop: (
    recipient: string,
    amount: BigNumberish,
    epoch: BigNumberish
  ) => Promise<ContractTransaction>;
  claimAirdrop: (epoch: BigNumberish) => Promise<ContractTransaction>;
}

