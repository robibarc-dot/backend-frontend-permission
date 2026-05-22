'use client';

import React from 'react';

const mockPacks = [
  {
    title: 'Starter Pack',
    subtitle: '3 Full Mock Tests — try & decide',
    price: 299,
    btnText: 'Buy Starter Pack',
    isFeatured: false,
  },
  {
    title: 'Advanced Pack',
    subtitle: '10 Full Mock Tests — great value',
    price: 799,
    btnText: 'Buy Advanced Pack',
    isFeatured: true,
  },
  {
    title: 'Writing Evaluation',
    subtitle: '5 Expert Writing Reviews',
    price: 499,
    btnText: 'Buy Writing Evaluation',
    isFeatured: false,
  },
];

export default function MockTestPacksSection() {
  return (
    <section className="w-full bg-[#F8FAFC] py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] sm:text-xs font-bold text-[#FF007A] tracking-widest uppercase block">
            — Need Flexible Practice? —
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0F172A] tracking-tight leading-tight">
            Buy Only What You Need — Mock Test Packs
          </h2>
          <p className="text-gray-500 text-sm sm:text-[15px] font-medium max-w-xl mx-auto leading-relaxed">
            Low-entry purchase for students who want specific tests without a subscription.
          </p>
        </div>

        {/* Packs Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {mockPacks.map((pack) => (
            <div
              key={pack.title}
              className={`bg-white rounded-[24px] p-8 transition-all duration-300 relative flex flex-col justify-between min-h-[210px]
                ${pack.isFeatured 
                  ? 'border-2 border-[#FF007A] shadow-[0_15px_35px_-10px_rgba(255,0,122,0.06)]' 
                  : 'border border-gray-200/60 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Card Meta Content */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                    {pack.title}
                  </h3>
                  <p className="text-gray-400 text-[13px] font-medium leading-normal">
                    {pack.subtitle}
                  </p>
                </div>

                {/* Price Label Block */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end text-[#FF007A] font-black text-3xl tracking-tight">
                    <span className="text-2xl font-bold mr-0.5">৳</span>
                    <span>{pack.price}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-bold tracking-wide block uppercase mt-0.5">
                    one-time
                  </span>
                </div>
              </div>

              {/* Action Button Container */}
              <div className="pt-6">
                <button 
                  className={`w-full py-3.5 rounded-xl font-bold text-[14px] tracking-wide transition-all duration-200
                    ${pack.isFeatured
                      ? 'bg-[#FF007A] text-white hover:bg-[#e6006e] shadow-md shadow-pink-100'
                      : 'bg-[#FFF0F5] hover:bg-[#FFE4EE] text-[#FF007A]'
                    }
                  `}
                >
                  {pack.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}