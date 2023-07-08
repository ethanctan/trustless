export default function Navbar(){
    return (
        <nav className="nav">
            <ul>
                <li>
                    <a href="/about">About</a>
                    <a href="/airdrop">Claim Airdrop</a>
                    <a href="/mechanics">Mechanics</a>
                    <a href="/submitRatings">Submit Ratings</a>
                    <a href="/viewRatings">View Ratings</a>
                </li>
            </ul>
            <button>Connect Wallet</button>
        </nav>
    )
}