"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#FFC400] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">

          <Image
            src="/images/logo.png"
            alt="PEXA Logo"
            width={40}
            height={40}
            className="object-contain"
          />

          <span className="text-xl font-bold text-[#111111]">
            PEXA Car Care
          </span>

        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-[#111111]">

          <Link
            href="/"
            className="hover:text-gray-700 transition"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="hover:text-gray-700 transition"
          >
            About
          </Link>

          <Link
            href="/become-partner"
            className="hover:text-gray-700 transition"
          >
            Become Partner
          </Link>

          <Link
            href="/partner-login"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Partner Login
          </Link>

        </nav>

      </div>
    </header>
  );
}