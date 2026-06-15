"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <div className="w-12 h-12 bg-[#FF007A] rounded-2xl flex items-center justify-center text-white font-bold text-xl tracking-tight shadow-sm">
                CD
                </div>
                <div className="flex flex-col">
                <span className="text-xl font-black text-[#0F172A] tracking-tight leading-none mb-1">
                    CD IELTS
                </span>
                <span className="text-xs text-gray-400 font-medium">
                    Your Path to IELTS Success
                </span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-8 text-[15px] font-medium text-gray-600">
                <Link href="/#feature-mock-test" className="hover:text-gray-900 transition-colors">
                    Mock Test
                </Link>
                <Link href="/practice-test" className="hover:text-gray-900 transition-colors">
                    Free Practice
                </Link>
                <Link href="/#feature-study-resources" className="hover:text-gray-900 transition-colors">
                    Study Resource
                </Link>
                <Link href="/#feature-pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
                <Link href="/blogs" className="hover:text-gray-900 transition-colors">Blog</Link>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-6">
                <Link href="/login" className="text-[15px] font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                Login
                </Link>
                <Link href="/login" className="bg-gradient-to-r from-[#FF0055] to-[#FF3377] hover:opacity-95 text-white px-6 py-3 rounded-xl font-semibold text-[15px] tracking-wide transition-all shadow-md shadow-pink-100">
                Start for Free
                </Link>
            </div>

            {/* Hamburger Menu (Mobile Only) */}
            <div className="md:hidden flex items-center">
                <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
                </button>
            </div>

            </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <Link href="/#feature-mock-test" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Mock Test</Link>
            <Link href="/#feature-section-tests" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Free Practice</Link>
            <Link href="/#feature-study-resources" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Study Resource</Link>
            <Link href="/blogs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Blog</Link>
            <Link href="/#feature-pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Pricing</Link>
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 px-3">
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-center py-2 font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
                Login
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-center bg-gradient-to-r from-[#FF0055] to-[#FF3377] text-white py-3 rounded-xl font-semibold shadow-sm">
                Start for Free
                </Link>
            </div>
            </div>
        )}
        </header>
    );
}   
