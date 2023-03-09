import { useAccount } from "wagmi"
import React from 'react';
import Image from 'next/image';
import imageUrl from '../fpglogo-transparent.png'
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const { isConnected } = useAccount()
  const router = useRouter()
  console.log(router)
  return (
    <nav className="flex items-center justify-between flex-wrap bg-white p-6 sticky top-0 z-50">
      <div className="flex items-center flex-shrink-0">
        <div className="mr-6">
          <Link href="/">
            <Image src={imageUrl} width={48} height={48} alt="Logo" />
          </Link>
        </div>
        <div className="flex justify-start">
        {(isConnected || router.pathname !== '/') && <div className="mr-5"><ConnectButton  /></div>}
        <Link href="/about" className="mr-6 text-gray-600 hover:text-gray-800">
          About
        </Link>
        <Link href="/gitcoin-creatures" className="mr-6 text-gray-600 hover:text-gray-800">
          Gitcoin x Creatures
        </Link>
      </div>
      </div>
      <div className="flex justify-end">
        <Link href="https://github.com/jolow99/funding-public-goods" className="mr-6 text-gray-600 hover:text-gray-800">
          GitHub
        </Link>
        <Link href="https://t.me/+V4o6DzTwfLBjNDlh" className="mr-6 text-gray-600 hover:text-gray-800">
          Telegram
        </Link>
        <Link href="https://twitter.com/FundPG" className="text-gray-600 hover:text-gray-800">
          Twitter
        </Link>
      </div>
    </nav>
  );
};
