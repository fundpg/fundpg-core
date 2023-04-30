import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import creaturesShirt from '../creaturesShirt.png'
import memsShirt from '../memsShirt.png'

export default function Merch(){
    return(
    <>
        <Navbar />
        <center>
            <div className="flex sm:flex-row flex-col p-10 ml-[5vw] lg:ml-[7.5vw]">
                <div>
                    <Image src={memsShirt} alt="Mems Collab Shirt" width={500} height={500} />
                    <button className="rounded-lg px-4 py-3 bg-[#0e76fd] text-white text-lg font-medium">Sold Out</button>
                </div>
                <div>
                    <Image src={creaturesShirt} alt="Gitcoin x Creature World shirt" width={550} height={550} />
                    <Link href="https://store.gitcoin.co/products/creature-shipping">
                    <button className="rounded-lg px-4 py-3 bg-[#0e76fd] text-white text-lg font-medium">Creatures x Gitcoin Limited Edition</button>
                    </Link>
                </div>
            </div>
        </center>
    </>
    )
}