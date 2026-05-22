'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const checkmarks = [
  'Personalized Learning Path',
  'Track Your Progress',
  'Expert Feedback',
  'Fast Results',
];

export default function ImproveBandScoreSection() {
  return (
    <section className="w-full bg-white py-20 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8ss">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          {/* Small Top Pill Badge */}
          <div className="inline-block bg-[#FFF0F5] border border-[#FFE0EB] text-[#FF007A] text-[11px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
            Proven Results
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#0F172A] tracking-tight leading-tight">
            Improve Your Band Score <br />
            <span className="text-[#FF007A] block mt-1">Faster & Smarter</span>
          </h2>
          <p className="text-gray-500 text-[15px] sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Join thousands of students who've achieved their target band scores with our AI-powered practice platform.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center p-3">
          {/* Left Column: Interactive Image Frame Dashboard */}
          <div className="lg:col-span-6 w-full flex relative">
            {/* Soft decorative background drop shadow glow effect */}
            <div className="absolute -inset-4 bg-slate-100/50 rounded-[40px] blur-2xl z-0 pointer-events-none" />
            
            {/* Laptop UI Screen Frame Simulation */}
            <div className="relative z-10 w-full max-w-[540px] bg-[#070B19] rounded-[32px] p-2.5 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-800">
              <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden bg-[#0A1024]">
                
                {/* Main Student Asset Representation */}
                <Image
                  src="/student-learning-headphones.png" // Replace with your image asset path
                  alt="Student achieving target IELTS band score"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  style={{ objectFit: 'cover' }}
                  priority
                />

                {/* Top-Left Glowing Progress Circle Watermark Overlay */}
                <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-md rounded-full p-4 border border-white/10 flex flex-col items-center justify-center w-24 h-24 text-center">
                  <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase leading-none mb-1">IELTS</span>
                  <span className="text-2xl font-black text-white leading-none">8.0</span>
                  {/* Faux circular progress background indicator arc */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 text-blue-500" viewBox="0 0 36 36" aria-hidden="true">
                    <path className="stroke-current" strokeWidth="2.5" strokeDasharray="75, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>

                {/* Bottom Floating White Stats Card Popup */}
                <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest block uppercase">Current Progress</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0F172A] tracking-tight">8.0</span>
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                        +1.5 <span className="text-[10px]">▲</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 block">Band Score Achieved</span>
                  </div>
                  
                  {/* Decorative Blue Ribbon Badge */}
                  <div className="w-12 h-12 bg-[#1E60FF] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200" aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Informational Text & Feature Checks */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Achieve Your Target <br />
                <span className="text-[#FF007A]">IELTS Band</span> Score
              </h3>
              <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed font-medium max-w-lg">
                Master IELTS with real exam-style practice, AI-powered feedback, and expert guidance. Join 50,000+ students who achieved their target scores.
              </p>
            </div>

            {/* Custom Styled Checkmark List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 w-full max-w-md">
              {checkmarks.map((text, idx) => (
                <li key={idx} className="flex items-center gap-3 text-[#1E293B] font-semibold text-[15px]"> {/* Using idx as key is acceptable for static lists */}
                  <CheckCircle2 className="w-5 h-5 text-[#1E60FF] shrink-0 fill-blue-50 stroke-2" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Action Call to Action Button */}
            <div className="pt-4 w-full sm:w-auto"> {/* Changed <a> to Link for internal navigation */}
              <Link
                href="/free-practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF0055] to-[#FF3377] hover:opacity-95 text-white px-8 py-4 rounded-xl font-bold text-[15px] tracking-wide transition-all shadow-lg shadow-pink-100 group"
              >
                Start Free Practice
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform stroke-[2.5]" aria-hidden="true" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}