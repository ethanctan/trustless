// ITRUSTStaking.ts

export interface ITRUSTStaking {
    confirmDeposit: () => Promise<void>;
    startEpochManually: () => Promise<void>;
    stakeEpoch: (amount: number, staker: string) => Promise<void>;
    insertAirdropRewards: (recipient: string, amount: number) => Promise<void>;
    airdrop: (recipient: string) => Promise<void>;
    withdrawStake: (staker: string) => Promise<void>;
    changeMinStake: (amount: number) => Promise<void>;
    changeRewardMultiplier: (amount: number) => Promise<void>;
}

