"use client"
import Image from 'next/image';
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen h-[100dvh] min-h-[600px] flex items-center bg-white overflow-hidden sm:overflow-visible">
      
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/hero_bg.webp"
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-right"
        />
        {/* Subtle overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-white/20 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/60 lg:to-transparent z-[1]" />
      </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-12 gap-12 items-center">
            
            {/* Left Text Content Column */}
            <div className="col-span-12 lg:col-span-8 flex flex-col items-start text-left space-y-6">
                
                {/* Top Pill Tag */}
                <div className="inline-flex items-center bg-[#FFF0F5] border border-[#FFE0EB] text-[#FF007A] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                <span className="w-1.5 h-1.5 bg-[#FF007A] rounded-full mr-2 animate-pulse" />
                Your Dreams Score Awaits
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
                Prepare for <span className="text-[#FF007A]">IELTS.</span> <br className="hidden sm:inline" />
                Achieve Your Dreams.
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
                Expert guidance, quality materials and smart strategies to help you achieve your desired band score.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
                <a href="/mock-test" className="w-full sm:w-auto text-center bg-gradient-to-r from-[#FF0055] to-[#FF3377] hover:opacity-95 text-white px-8 py-4 rounded-xl font-bold text-[15px] tracking-wide transition-all shadow-md shadow-pink-100 flex items-center justify-center gap-2 group">
                    Try Free Mock Test
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
                <a href="/dashboard" className="w-full sm:w-auto text-center border-2 border-gray-300 hover:border-gray-900 text-[#0F172A] hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-[15px] tracking-wide transition-all">
                    Go to Dashboard
                </a>
                </div>
            </div>

            </div>
        </div>

        {/* Floating Features Strip Card */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
                
                {/* Feature 1 */}
                <div className="flex items-center gap-4 lg:px-4 pb-4 sm:pb-0">
                    <div className="w-12 h-12 shrink-0 bg-[#FFF0F5] rounded-xl flex items-center justify-center text-[#FF007A]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    </div>
                    <div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-[15px]">Mock Test Simulation</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Real IELTS exam environment</p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-4 lg:px-6 pt-4 sm:pt-0 pb-4 sm:pb-0">
                    <div className="w-12 h-12 shrink-0 bg-[#FFF0F5] rounded-xl flex items-center justify-center text-[#FF007A]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    </div>
                    <div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-[15px]">Free Practice Questions</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Daily practice materials</p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-4 lg:px-6 pt-4 sm:pt-0 pb-4 lg:pb-0">
                    <div className="w-12 h-12 shrink-0 bg-[#FFF0F5] rounded-xl flex items-center justify-center text-[#FF007A]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    </div>
                    <div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-[15px]">Free Study Resources</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Notes, tips, vocabulary</p>
                    </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-center gap-4 lg:px-6 pt-4 lg:pt-0">
                    <div className="w-12 h-12 shrink-0 bg-[#FFF0F5] rounded-xl flex items-center justify-center text-[#FF007A]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    </div>
                    <div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-[15px]">Performance Analytics</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Score tracking/report</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </section>
  );
}