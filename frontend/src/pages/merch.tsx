import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import creatureShirt from '../creatureShirt.png'
import memsShirt from '../memsShirt.png'

export default function GitcoinCreatures(){
    return(
        <>
        <Navbar />
        <center>
            <Image src={creatureShirt} alt="Gitcoin x Creature World shirt" width={600} height={600} />
            <Link href="https://store.gitcoin.co/products/creature-shipping">
              <button className="rounded-lg px-4 py-3 bg-[#0e76fd] text-white text-lg font-medium">Creatures x Gitcoin Limited Edition</button>
            </Link>
        </center>
        </>
    )
}