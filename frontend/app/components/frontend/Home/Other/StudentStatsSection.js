'use client';

import React from 'react';

const statsData = [
  {
    value: '10,000+',
    label: 'MOCK TESTS TAKEN',
  },
  {
    value: '5,000+',
    label: 'STUDENTS PRACTICING WEEKLY',
  },
  {
    value: '95%',
    label: 'USER SATISFACTION',
  },
  {
    value: '50,000+',
    label: 'FREE QUESTIONS SOLVED',
  },
];

export default function StudentStatsSection() {
  return (
    <section className="w-full bg-white py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-tight">
            Trusted by Thousands of <br />
            IELTS Aspirants
          </h2>
          <p className="text-gray-500 text-[15px] sm:text-base font-medium max-w-md mx-auto leading-relaxed">
            Students across Bangladesh are improving their band scores with CD IELTS.
          </p>
        </div>

        {/* Stats Grid Container Box */}
        <div className="w-full border border-gray-100 rounded-2xl md:rounded-none md:border-none shadow-sm md:shadow-none bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
            divide-y divide-gray-100 sm:divide-y-0 
            md:border-t md:border-b md:border-gray-100/80
            lg:divide-x lg:border-l lg:border-r lg:border-gray-100/80"
          >
            {statsData.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`flex flex-col items-center justify-center text-center p-8 md:p-12 lg:p-14 bg-white min-h-[180px] transition-colors duration-200 hover:bg-slate-50/40 border-gray-100
                  ${index % 2 === 0 ? 'sm:border-r' : ''}
                  ${index < 2 ? 'sm:border-b' : ''}
                  lg:border-r-0 lg:border-b-0
                `}
              >
                {/* Big Pink Metric Value */}
                <span className="text-4xl sm:text-5xl font-black text-[#FF007A] tracking-tight mb-3">
                  {stat.value}
                </span>
                
                {/* Clean Muted Label Subtext */}
                <span className="text-[11px] sm:text-xs font-bold text-gray-500 tracking-widest leading-normal px-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}