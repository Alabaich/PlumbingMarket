"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="bg-gradient-to-b from-black to-transparent text-white"
      style={{
        padding: "1rem 2rem 2rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <nav className="flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/">Plumbing Market</Link>
        </div>

        {/* Hamburger Icon (Visible on small screens) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-2xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Full Menu for larger screens */}
        <ul className="hidden md:flex gap-[25px] font-light text-base list-none">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        {/* Search Bar for larger screens */}
        <div className="hidden md:flex flex-grow mx-6">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full p-2 text-black rounded-full focus:outline-none border border-white"
          />
        </div>

        {/* Icons for larger screens */}
        <div className="hidden md:flex items-center gap-[25px]">
          <Link href="/account">
            <div className="text-2xl cursor-pointer" title="Account">
              👤
            </div>
          </Link>
          <Link href="/cart">
            <div className="text-2xl cursor-pointer" title="Cart">
              🛒
            </div>
          </Link>
        </div>
      </nav>

      {/* Dropdown Menu for small screens */}
      {menuOpen && (
        <div className="mt-4 md:hidden">
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/products" onClick={() => setMenuOpen(false)}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent w-full p-2 text-black rounded-full focus:outline-none border border-white"
            />
          </div>

          {/* Icons */}
          <div className="mt-4 flex justify-around">
            <Link href="/account" onClick={() => setMenuOpen(false)}>
              <div className="text-2xl cursor-pointer" title="Account">
                👤
              </div>
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              <div className="text-2xl cursor-pointer" title="Cart">
                🛒
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
