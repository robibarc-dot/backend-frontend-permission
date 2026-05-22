'use client';

import React from 'react';
  import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CtaBannerSection() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Container with Pink Gradient Background */}
        <div className="relative w-full rounded-[32px] bg-gradient-to-r from-[#E61B6B] via-[#E92275] to-[#EE358D] overflow-hidden min-h-[380px] lg:min-h-[420px] flex flex-col justify-center shadow-lg shadow-pink-100">
          
          {/* Decorative Background Circular Graphic */}
          <div className="absolute right-0 bottom-0 top-0 w-full lg:w-[50%] opacity-20 lg:opacity-100 pointer-events-none z-0">
            <div className="absolute right-[-10%] bottom-[-20%] w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] rounded-full bg-[#FA4299]/40 mix-blend-screen filter blur-sm" />
          </div>

          {/* Inner Grid Structure separating textual assets from the image vector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full relative z-10 px-6 sm:px-12 lg:px-16 py-12 lg:py-0 items-center gap-8">
            
            {/* Left Content Column (7 Grid Units on Desktop) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-tight">
                Practice Smart. <br className="hidden sm:inline" /> Score Better.
              </h2>
              <p className="text-pink-50 text-[14px] sm:text-base font-medium leading-relaxed opacity-95">
                Use real exam simulations and performance insights to improve faster and reach your desired band score.
              </p>
              
              <div className="pt-3 flex justify-center lg:justify-start">
                <Link 
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-[#0F172A] font-bold px-7 py-4 rounded-full text-sm sm:text-[15px] tracking-wide shadow-md transition-all duration-200 group"
                >
                  Start Practicing
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </Link>
              </div>
            </div>

            {/* Right Graphic Column (5 Grid Units on Desktop) */}
            <div className="lg:col-span-5 relative w-full h-[240px] sm:h-[320px] lg:h-full min-h-[300px] lg:min-h-[460px] mt-4 lg:mt-0 flex items-end justify-center">
              <div className="absolute bottom-0 w-[290px] sm:w-[380px] lg:w-[450px] aspect-[1.12] lg:right-[-20px] xl:right-0">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80" // Placeholder mapping representing collaborative study group teams
                  alt="IELTS Students"
                  fill
                  sizes="(max-width: 1024px) 380px, 450px"
                  className="object-contain object-bottom select-none pointer-events-none"
                  priority
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}