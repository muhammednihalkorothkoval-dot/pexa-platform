"use client";

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#FFC400] p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-[#111111] font-bold text-xl">
          PEXA Car Care
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-[#111111] hover:text-gray-700">Home</Link>
          <Link href="/about" className="text-[#111111] hover:text-gray-700">About</Link>
          <Link href="/become-partner" className="text-[#111111] hover:text-gray-700">Become Partner</Link>
          <Link href="/partner-login" className="text-[#111111] hover:text-gray-700">Partner Login</Link>
        </div>
      </div>
    </nav>
  );
}