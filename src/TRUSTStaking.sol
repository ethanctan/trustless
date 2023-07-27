// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TRUSTStaking is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 public immutable token;
    address public trustDAO;

    uint256 public MIN_STAKE_INCREMENT;
    uint256 public REWARD_MULTIPLIER;

    uint256 public epochCount = 0;

    bool public allowStaking = true;

    struct Stats {
        uint256 staked;
        uint256 stakeTransformed;
        uint256 reward;
        bool isRewarded;
    }

    struct Epoch {
        uint256 epochCount;
        uint256 minStake;
        uint256 totalTrustReward;
        mapping(address => Stats) tracker;
        uint256 totalStaked;
        uint totalRewardInserted;
        bool changeMinStake;
        bool changeRewardMultiplier;
    }

    mapping(uint256 => Epoch) public history;
    bool public startEpoch = true;

    event StakeSuccessful(uint256 amount, address staker);
    event MinStakeMet(uint256 epochCount);
    event AirdropSuccessful(uint256 amount, address recipient);
    event AllRewardsDistributed(uint256 epochCount);

    constructor(
        IERC20 _token,
        uint _MIN_STAKE_INCREMENT,
        uint _REWARD_MULTIPLIER,
        address _trustDAO
    ) {
        token = _token;
        MIN_STAKE_INCREMENT = _MIN_STAKE_INCREMENT;
        REWARD_MULTIPLIER = _REWARD_MULTIPLIER;
        trustDAO = _trustDAO;
    }

    modifier onlyContractOrAdmin() {
        require(
            msg.sender == address(this) || msg.sender == owner(),
            "Not contract or owner"
        );
        _;
    }

    modifier onlyDAO() {
        require(msg.sender == trustDAO, "Not DAO");
        _;
    }

    function confirmDeposit() external onlyOwner {
        require(epochCount == 0, "Must be first epoch");
        require(
            token.balanceOf(address(this)) == (100000000 * 775) / 1000,
            "Incorrect amount from token contract"
        );
        _initializeEpoch();
    }

    function startEpochManually() external onlyOwner {
        require(startEpoch, "Ratings not done or useconfirmDeposit()");
        require(epochCount > 0, "Cannot be first epoch");
        _initializeEpoch();
    }

    function _initializeEpoch() internal onlyContractOrAdmin {
        require(token.balanceOf(address(this)) != 0, "all TRUST airdropped");
        require(allowStaking, "Epoch started");
        require(
            history[epochCount].totalTrustReward == 0,
            "Epoch already created"
        );
        require(startEpoch, "Airdrop not complete");

        Epoch storage currentEpoch = history[epochCount];

        currentEpoch.minStake = epochCount * MIN_STAKE_INCREMENT;

        if (epochCount == 0) {
            currentEpoch.totalTrustReward =
                (token.balanceOf(address(this)) * 25) /
                775; // 2.5% of tokens
        } else {
            require(
                token.balanceOf(address(this)) >=
                    currentEpoch.minStake * REWARD_MULTIPLIER,
                "Insufficient tokens left for new epoch"
            );
            currentEpoch.totalTrustReward =
                currentEpoch.minStake *
                REWARD_MULTIPLIER;
        }

        currentEpoch.totalStaked = 0;
        startEpoch = false;
    }

    //need to require token owners to approve this smart contract
    // NEED TO CHECK THAT MSG.SENDER == STAKER
    function stakeEpoch(uint256 amount, address staker) external {
        require(staker != address(0), "Cannot stake from the zero address");
        require(msg.sender == staker, "Cannot stake for someone else");
        require(
            token.balanceOf(staker) >= amount,
            "Insufficient token balance to stake"
        );
        require(allowStaking, "Epoch started");
        require(history[epochCount].totalTrustReward != 0, "Epoch not created");

        //access epoch instance
        Epoch storage currentEpoch = history[epochCount];

        // staker needs to approve address(this) to transferFrom
        token.safeTransferFrom(staker, address(this), amount);

        currentEpoch.tracker[staker].staked = amount;

        currentEpoch
            .tracker[staker]
            .stakeTransformed = applyDecreasingPercentage(amount);

        emit StakeSuccessful(amount, staker);

        currentEpoch.totalStaked += applyDecreasingPercentage(amount);

        if (currentEpoch.totalStaked >= currentEpoch.minStake) {
            allowStaking = false;
            emit MinStakeMet(epochCount);
        }
    }

    //to be called for a particular address to set reward
    function insertAirdropRewards(
        address recipient,
        uint amount
    ) external onlyOwner {
        require(
            recipient != address(0),
            "Cannot set rewards for the zero address"
        );
        require(
            !allowStaking,
            "Min stake hasn't been met, so ratings are not open and cannot insert airdrop rewards"
        );
        require(history[epochCount].totalTrustReward != 0, "Epoch not created");
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient tokens in contract for airdrop"
        );

        //access epoch instance
        Epoch storage currentEpoch = history[epochCount];

        require(
            currentEpoch.tracker[recipient].reward == 0,
            "Reward for this address has been inserted"
        );
        require(
            currentEpoch.tracker[recipient].isRewarded == false,
            "Recipient has already claimed airdrop for this epoch"
        );
        require(
            amount <= currentEpoch.totalTrustReward,
            "Cannot reward more than epoch's allocation"
        );

        currentEpoch.tracker[recipient].reward = amount;

        currentEpoch.totalRewardInserted += amount;

        require(
            currentEpoch.totalRewardInserted <= currentEpoch.totalTrustReward,
            "Insufficient allocation for airdrops"
        );
    }

    //to be called after window closes by our backend; we calculate reward distributions on server side
    function airdrop(address recipient) public {
        require(recipient != address(0), "Cannot airdrop to the zero address");
        require(history[epochCount].totalTrustReward != 0, "Epoch not created");
        require(
            !allowStaking,
            "Min stake hasn't been met, so ratings are not open and no one can be airdropped"
        );
        require(msg.sender == recipient, "Not your airdrop");
        require(startEpoch == false, "Rating window closed");

        //access epoch instance
        Epoch storage currentEpoch = history[epochCount];
        uint amount = currentEpoch.tracker[recipient].reward;

        require(
            currentEpoch.tracker[recipient].reward != 0,
            "Recipient not eligible for an airdrop for this epoch"
        );
        require(
            currentEpoch.tracker[recipient].isRewarded == false,
            "Recipient has already claimed airdrop for this epoch"
        );
        require(
            currentEpoch.totalTrustReward > 0,
            "Current Epoch rewards exhasted"
        );

        token.safeTransfer(recipient, amount);

        currentEpoch.tracker[recipient].isRewarded = true;

        currentEpoch.totalTrustReward -= amount;

        emit AirdropSuccessful(amount, recipient);

        if (currentEpoch.totalTrustReward <= 0) {
            allowStaking = true;
            epochCount++;
            startEpoch = true;
            emit AllRewardsDistributed(epochCount);
        }
    }

    function withdrawStake(address staker) public {
        require(allowStaking, "Epoch started");
        require(history[epochCount].totalTrustReward != 0, "Epoch not created");
        require(msg.sender == staker, "Not your stake");

        Epoch storage currentEpoch = history[epochCount];

        uint256 amount = currentEpoch.tracker[staker].staked;

        require(amount > 0, "No stake to withdraw");

        token.safeTransfer(staker, amount);

        currentEpoch.totalStaked -= amount;
        currentEpoch.tracker[staker].staked = 0;
    }

    function changeMinStake(uint amount) external onlyDAO {
        require(allowStaking, "Epoch started");
        require(history[epochCount].totalTrustReward != 0, "Epoch not created");

        Epoch storage currentEpoch = history[epochCount];

        require(
            currentEpoch.changeMinStake == false,
            "The stake increment has been altered for this epoch"
        );

        MIN_STAKE_INCREMENT = amount;

        currentEpoch.changeMinStake = true;
    }

    function changeRewardMultiplier(uint amount) external onlyDAO {
        require(allowStaking, "Epoch started");
        require(history[epochCount].totalTrustReward != 0, "Epoch not created");

        Epoch storage currentEpoch = history[epochCount];

        require(
            currentEpoch.changeRewardMultiplier == false,
            "The reward multiplier has been altered for this epoch"
        );

        REWARD_MULTIPLIER = amount;

        currentEpoch.changeRewardMultiplier = true;
    }

    //needs to handle fractional and negative values
    function applyDecreasingPercentage(
        uint256 number
    ) internal pure returns (uint256) {
        if (number <= 100) {
            return number;
        } else if (number <= 1000) {
            return (number * 90) / 100;
        } else if (number <= 10000) {
            return (number * 80) / 100;
        } else if (number <= 100000) {
            return (number * 70) / 100;
        } else if (number <= 1000000) {
            return (number * 60) / 100;
        } else if (number <= 1000000) {
            return (number * 60) / 100;
        } else if (number <= 10000000) {
            return (number * 50) / 100;
        } else if (number <= 10000000) {
            return (number * 40) / 100;
        } else if (number <= 100000000) {
            return (number * 30) / 100;
        } else if (number <= 1000000000) {
            return (number * 20) / 100;
        } else if (number <= 10000000000) {
            return (number * 10) / 100;
        }
        // Any greater, take 1%
        return (number * 1) / 100;
    }

    //for testing
    function getTotalStaked(uint256 _epochCount) public view returns (uint256) {
        return history[_epochCount].totalStaked;
    }

    //for testing
    function getTotalTrustReward(
        uint256 _epochCount
    ) public view returns (uint256) {
        return history[_epochCount].totalTrustReward;
    }

    //for testing
    function getTotalRewardInserted(
        uint256 _epochCount
    ) public view returns (uint256) {
        return history[_epochCount].totalRewardInserted;
    }

    //for testing
    function getMinStake(uint256 _epochCount) public view returns (uint256) {
        return history[_epochCount].minStake;
    }

    //for testing
    function getStakerInfo(
        uint256 _epoch,
        address _staker
    )
        public
        view
        returns (
            uint256 stakedAmount,
            uint256 stakeTransformedAmount,
            uint256 rewardAmount,
            bool isRewarded
        )
    {
        stakedAmount = history[_epoch].tracker[_staker].staked;
        stakeTransformedAmount = history[_epoch]
            .tracker[_staker]
            .stakeTransformed;
        rewardAmount = history[_epoch].tracker[_staker].reward;
        isRewarded = history[_epoch].tracker[_staker].isRewarded;
        return (stakedAmount, stakeTransformedAmount, rewardAmount, isRewarded);
    }

    //for testing
    function getMinStakeIncrement() external view returns (uint256) {
        return MIN_STAKE_INCREMENT;
    }

    //for testing
    function getRewardMultiplier() external view returns (uint256) {
        return REWARD_MULTIPLIER;
    }

    //for testing - MUST DELETE
    function drainTokens(address recipient) external onlyOwner {
        token.safeTransfer(recipient, token.balanceOf(address(this)));
    }
}
