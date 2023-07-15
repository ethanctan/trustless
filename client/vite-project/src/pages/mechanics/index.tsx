export default function Mechanics(){
    return (
        <div className="text-left flex flex-col mx-auto">
            <h3 className="unbounded text-3xl my-5 w-2/3 mx-auto">
                Overview of TRUSTLESS
            </h3>

            <div className="poppins text-lg pb-1 rounded-b-lg duration-300 w-2/3 mx-auto">
                <p className="mb-4">
                TRUSTLESS is an open-source DeFi analytics dashboard that aggregates user trust ratings of DeFi protocols. By rating DeFi protocols, users earn $TRUST rewards while collectively forming public consensus on the reliability and trustworthiness of DeFi protocols. TRUSTLESS offers analytics on 3000+ protocols across 30+ chains.                 
                </p>
                <p className="mb-4">
                The TRUSTLESS rating system scores protocols on a scale of 1-10 across 5 metrics: Smart contract security, treasury management, reliability, quality of governance, and team reputation.
                </p>
                <p className="mb-4">
                Users may only rate DeFi protocls by participating in specific 36-hour rating epochs, where they will be rewarded in $TRUST based on how close their rating submissions are to the public consensus established during that epoch. The frequency of epochs, as well as the reward distribution mechanism of each epoch, will initially be set by the TRUST team and subsequently determined by $TRUST holders over time. 
                </p>
            </div>        

            <h3 className="unbounded text-3xl my-5 w-2/3 mx-auto">
                $TRUST Rewards Mechanism
            </h3>

            <div className="poppins text-lg pb-1 rounded-b-lg duration-300 w-2/3 mx-auto">
                <p className="mb-4">
                During each 36-hour rating epoch, users can earn $TRUST rewards by participaing in the rating of DeFi protocols featured on TRUST. Users are welcome to rate anywhere between 1 to 3000+ protocols but can only rate each protocol once. At the end of each epoch, consensus ratings will be published. Participants of the epoch will receive $TRUST rewards based on how close their ratings were to the average and how many protocols they rated.                 
                </p>
                <p className="mb-4">
                Closeness will be determined by <a className="text-red-500">INSERT ALGORITHM HERE</a>
                </p>
                <p className="mb-4">
                During any epoch, participants may also share their ratings with other particpants through the “TRUST Multiplier” option, which allows other particpants to copy their ratings, thereby influencing public consensus. The more copiers one amasses, the higher the multiplier applied to their $TRUST rewards at the end of each epoch. If you choose to do this, remember that users will still want to submit ratings that they expect to be close to the average. Thus, you'll want to justify why your scores for any given protocol make sense.
                </p>
                <p className="mb-4">
                After each epoch, users will be able to stake $TRUST into a reward pool to participate in the next epoch. The pool will have a hard cap, which upon being filled, will be doubled by the TRUST treasury. This will then trigger the start of a new epoch in 7 days, where rewards from the reward pool will be once again distributed to participants based on their ratings performance during that epoch. 
                </p>
            </div> 

            <h3 className="unbounded text-3xl my-5 w-2/3 mx-auto">
                $TRUST Tokenomics
            </h3>  
            <div className="poppins text-lg pb-1 rounded-b-lg duration-300 w-2/3 mx-auto">
                <p className="mb-4">
                Total Supply: 1,000,000,000 $TRUST 
                </p>
                <p className="mb-4">
                Inital LP: 2.5%
                </p>
                <p className="mb-4">
                Initial Epoch Airdrop: 2.5%             
                </p>
                <p className="mb-4">
                Team Allocation: 7.5% 
                </p>
                <p className="mb-4">
                Community Treasury: 87.5%
                </p>
                <p className="mb-4">
                $TRUST from the treasury will contribute to new reward pools for future epochs and protocol development. 
                </p>
                <p className="mb-4">
                Users can stake $TRUST to participate in new rating epochs to earn further $TRUST rewards. $TRUST can also be burned for utility NFTs on TRUSTLESS' sister protocol (huge announcement coming soon 👀)
                </p>
                <p className="mb-4">
                TRUSTLESS will initially be governed by the team as the ecosystem is being developed. Eventually, TRUSTLESS will be governed by $TRUST holders who can decide on how maintenance of the TRUSTLESS dashboard and reward distributions should be managed.
                </p>
            </div>    
        </div>
    )
}