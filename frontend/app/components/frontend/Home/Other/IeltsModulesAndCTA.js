'use client';

import React from 'react';
import Link from 'next/link';
import { Headphones, BookOpen, PenTool, Mic } from 'lucide-react';

const modulesData = [
  {
    title: 'Listening',
    icon: Headphones,
    description: '40 questions, 4 sections. Audio designed to match IELTS test-day quality with CD playback controls.',
  },
  {
    title: 'Reading',
    icon: BookOpen,
    description: 'Academic & General Training passages. On-screen highlighting and note tools just like the real CD exam.',
  },
  {
    title: 'Writing',
    icon: PenTool,
    description: 'Task 1 & Task 2 with word count, AI scoring, and band-specific improvement suggestions.',
  },
  {
    title: 'Speaking',
    icon: Mic,
    description: '3-part speaking simulation with AI pronunciation analysis and fluency scoring in real time.',
  },
];

export default function IeltsModulesAndCTA() {
  return (
    <section className="w-full bg-[#F8FAFC] py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15] sm:leading-[1.2]">
            Master All Four <br />
            <span className="text-[#FF007A] inline-block sm:inline">IELTS</span> Modules
            </h2>
            <p className="text-gray-500 text-[15px] sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
                Complete preparation for every skill — structured, adaptive, and exam-accurate.
            </p>
        </div>

        {/* Four Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modulesData.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <div 
                key={module.title} 
                className="bg-[#1a3278] text-white rounded-[32px] p-8 flex flex-col items-start space-y-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                {/* Icon Wrapper */}
                <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white/15 transition-colors">
                  <IconComponent className="w-7 h-7 text-white stroke-[1.75]" />
                </div>
                
                {/* Text Content */}
                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold tracking-tight">{module.title}</h3>
                  <p className="text-slate-300 text-[14px] leading-relaxed font-normal">
                    {module.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call To Action Banner */}
        <div className="w-full bg-[#1a3278] rounded-[40px] p-8 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle Decorative Background Layer */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF007A]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* CTA Heading text */}
            <div className="text-center lg:text-left space-y-4 max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Ready to Start Your IELTS Journey?
              </h3>
              <p className="text-slate-400 text-base sm:text-lg font-medium">
                Join <span className="text-white font-bold">50,000+</span> students already on their way to their target band score.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto shrink-0">
              <Link 
                href="/login" 
                className="w-full sm:w-auto text-center bg-gradient-to-r from-[#FF0055] to-[#FF3377] hover:scale-105 active:scale-95 text-white px-10 py-4 rounded-2xl font-bold text-[15px] tracking-wide transition-all shadow-xl shadow-pink-500/20"
              >
                Get Free Access
              </Link>
              <Link 
                href="/mock-test" 
                className="w-full sm:w-auto text-center border-2 border-white/20 hover:border-white/60 text-white hover:bg-white/5 px-10 py-4 rounded-2xl font-bold text-[15px] tracking-wide transition-all"
              >
                View Full Tests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}