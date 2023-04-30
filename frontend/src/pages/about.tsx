import Link from "next/link";
import Navbar from "../components/Navbar";
export default function About(){
    const were = "We're"
    const whats = "What's"
    return(
        <>
        <Navbar />
        <div className="p-4 ml-[10vw] w-[75%]">
            <div>
                <h1 className="text-2xl font-bold">What is FundPG</h1>
                <br/>
                <p>{were} just a bunch of regenerates doing our best to fund public goods 🌱
                <br/> <br/>
                We won ETH Denver 2023 by building a product that allows you to allocate a percentage of your yield to funding public goods via the <Link href="https://bounties.gitcoin.co/grants/12/gitcoin-grants-official-matching-pool-fund"><span className="font-bold">Gitcoin Matching Pool.</span></Link>
                <br/><br/>
                We also made a merch collaboration between <Link href="/merch"><span className="font-bold">Gitcoin and Creatures World</span></Link> for ETH Denver 2023, where 100% of the proceeds went to funding public goods.</p>
            </div>
            <div className="mt-[5vh]">
                <h1 className="text-2xl font-bold">{whats} Next</h1>
                <br/>
                <p>{were} currently working to drive the adoption of the Gitcoin standard, where protocols and crypto games allocate a percentage of their revenue to funding public goods.</p>
            </div>
            <div className="mt-[5vh]">
                <h1 className="text-2xl font-bold">How can you help?</h1>
                <br/>
                <p>The development of FundPG is entirely funded by donations and public goods funding. Please support by donating ETH or any ERC20 to our ENS below:</p>
                <br/>
                <Link href="https://etherscan.io/address/0x94aaf5ceb457057ac4d1588257988d487272984f">
                    <button className="rounded-md bg-[#D9D9D9] pt-1.5 pb-1.5 pl-2 pr-2 text-light">fundpg.eth</button>
                </Link>
            </div>
        </div>
        </>
    )
}