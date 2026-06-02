'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

const featuresData = [
  {
    id: 'mock-test',
    title: 'Mock Test',
    heading: '100+ Full Mock Tests in Real Exam Format',
    description: 'Experience the actual IELTS interface with timed sections, audio playback, and instant scoring — exactly like exam day.',
    bullets: [
      'Questions from past 10 years',
      'Real exam simulation mode',
      'Detailed results per section',
      'Practice from any device'
    ],
    btnText: 'Explore Tests',
    btnHref: '/mock-test',
    imageSrc: '/images/home/mock_test.webp',
    bgColor: 'from-[#FF0055] to-[#FF3377]',
    accentText: 'text-[#FF007A]',
    accentBg: 'bg-[#FF007A]'
  },
  {
    id: 'section-tests',
    title: 'Section Tests',
    heading: 'Target Your Weak Section with Focused Practice',
    description: 'Isolate modules to lift your band score. Practice individual segments for Listening, Reading, Writing, or Speaking with specialized question banks.',
    bullets: [
      'In-depth sectional question banks',
      'Custom timers for rapid pacing',
      'Instant interactive playback controls',
      'AI-driven pronunciation check'
    ],
    btnText: 'Practice Sections',
    btnHref: '/free-practice',
    imageSrc: '/images/home/practice.webp',
    bgColor: 'from-[#1E60FF] to-[#4A85FF]',
    accentText: 'text-[#1E60FF]',
    accentBg: 'bg-[#1E60FF]'
  },
  {
    id: 'study-resources',
    title: 'Study Resources',
    heading: 'Curated Vault of Materials & Cheat Sheets',
    description: 'Unlock expert-vetted grammar blueprints, high-scoring vocabulary sheets, and real band-9 essay answers compiled by native evaluators.',
    bullets: [
      'Band-9 vocabulary compilation',
      'Interactive cue card builders',
      'Grammar structures for writing layout',
      'Weekly downloadable PDF notes'
    ],
    btnText: 'Access Resources',
    btnHref: '/resources',
    imageSrc: '/images/home/study_resource.webp',
    bgColor: 'from-[#FF0055] to-[#FF3377]',
    accentText: 'text-[#FF007A]',
    accentBg: 'bg-[#FF007A]'
  },
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    heading: 'Analytics to Measure Performance & Growth',
    description: 'Visualize predictive band scoring trends through machine learning data patterns mapped over your weekly practice timeline.',
    bullets: [
      'Visual predictive band milestones',
      'Weak spot performance flags',
      'Historical exam timeline analytics',
      'Target score disparity tracker'
    ],
    btnText: 'View Dashboard',
    btnHref: '/dashboard',
    imageSrc: '/images/home/progress_tracking.webp',
    bgColor: 'from-[#1E60FF] to-[#4A85FF]',
    accentText: 'text-[#1E60FF]',
    accentBg: 'bg-[#1E60FF]'
  }
];

export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState('mock-test');
  const isManualScrolling = useRef(false);
  const timeoutRef = useRef(null);

  // Smooth scroll handler when clicking sidebar tabs
  const handleTabClick = (id) => {
    setActiveTab(id);
    isManualScrolling.current = true;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const element = document.getElementById(`feature-${id}`);
    if (element) {
      const yOffset = -120; // Offsets sticky header heights if applicable
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Release scroll block after smooth scroll completes
    timeoutRef.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  };

  // Sync active sidebar tab while user scrolls through content sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // More balanced margin for better detection
      threshold: 0
    };

    const observerCallback = (entries) => {
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('feature-', '');
          setActiveTab(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    featuresData.forEach((item) => {
      const el = document.getElementById(`feature-${item.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="w-full bg-white py-12 md:py-24 font-sans bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        {/* Title / Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222938] tracking-tight">
            Why Students Choose <br />
            <span className="text-[#FF007A] block mt-1">CD IELTS</span>
          </h2>
          <p className="text-gray-500 text-[15px] sm:text-base font-medium">
            Everything you need to go from practice to your target band score.
          </p>
        </div>

        {/* Dynamic Structural Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Sticky Sidebar */}
          <div className="lg:col-span-3 w-full sticky top-20 md:top-28 z-30 bg-white/80 backdrop-blur-md py-4 lg:py-0">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto max-h-none lg:max-h-[500px] gap-3 pb-2 lg:pb-0 scrollbar-none snap-x">
              {featuresData.map((item) => {
                const isActive = item.id === activeTab;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`whitespace-nowrap lg:whitespace-normal text-left px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 snap-center flex items-center gap-3 w-auto lg:w-full shrink-0
                      ${isActive
                        ? `${item.accentText} bg-slate-50 font-bold shadow-sm border border-gray-100` 
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {/* Dynamic Bullet Indicator dot */}
                    <span className={`w-2 h-2 rounded-full transition-all duration-200 ${isActive ? `${item.accentBg} scale-125` : 'bg-transparent'}`} />
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Stacked Feed (All contents rendering together) */}
          <div className="lg:col-span-9 w-full space-y-8 md:space-y-8">
            {featuresData.map((item, index) => (
              <div 
                key={item.id}
                id={`feature-${item.id}`}
                className="w-full pr-6 md:pb-10 lg:pb-14 transition-all duration-500 scroll-mt-32 group/card"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Content Left Column */}
                  <div className={`lg:col-span-6 space-y-6 ${index % 2 !== 0 ? 'lg:order-last' : ''}`}>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight leading-snug">
                      {item.heading}
                    </h3>
                    <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                      {item.description}
                    </p>
                    
                    {/* Checked Bullet Lists */}
                    <ul className="space-y-3.5 text-[15px] text-[#334155] font-semibold">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <svg className="w-4 h-4 text-gray-700 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Primary Action Button */}
                    <div className="pt-2">
                      <Link 
                        href={item.btnHref} 
                        className={`inline-block text-center bg-gradient-to-r ${item.bgColor} text-white px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:opacity-95 transition-opacity`}
                      >
                        {item.btnText}
                      </Link>
                    </div>
                  </div>

                  {/* Content Right Screenshot Wrapper */}
                  <div className={`lg:col-span-6 flex justify-center w-full relative group-hover/card:scale-[1.02] transition-transform duration-700 ${index % 2 !== 0 ? 'lg:order-first' : ''}`}>
                    <div className="bg-white p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/80 w-full max-w-md lg:max-w-none">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center border border-gray-100">
                        <Image
                          src={item.imageSrc}
                          alt={item.heading}
                          fill
                          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px"
                          className="object-contain object-center"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}