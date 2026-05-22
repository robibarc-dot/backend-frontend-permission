'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const faqItems = [
  {
    question: 'When will I get my mock test results?',
    answer: 'For reading and listening sections, your results and a detailed band score breakdown are generated instantly. For AI-evaluated writing and speaking components, comprehensive feedback is compiled within 5 to 10 minutes.',
  },
  {
    question: 'Can I change my test center after registration?',
    answer: 'Since our platform simulates the computer-delivered (CD) IELTS format directly inside your web browser, you can practice from any location worldwide at any time without needing to visit a physical center.',
  },
  {
    question: 'Do you provide solutions for the mock tests?',
    answer: 'Yes, full explanations, vocabulary keys, and audio transcripts are provided for every single question. Writing and speaking sections also include high-scoring sample answers for direct comparison.',
  },
  {
    question: 'Are these mock tests based on the latest exam patterns?',
    answer: 'Absolutely. All testing resources are strictly curated to mirror the structure, timing, and difficulty parameters of official IELTS papers, ensuring you are fully prepared for the current exam environment.',
  },
];

export default function FaqAccordionSection() {
  // Track open index; initialized to null so all accordions start closed
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Heading and Tagline Block (5 Columns) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-10">
            <span className="text-xs sm:text-sm font-bold text-emerald-700 tracking-widest uppercase block">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#0F172A] tracking-tight leading-tight max-w-md">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Right Column: Dynamic Expandable Accordion Rows (7 Columns) */}
          <div className="lg:col-span-7 space-y-4 w-full">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div
                  key={item.question}
                  className="bg-[#F8FAFC]/60 rounded-2xl border border-slate-100/50 overflow-hidden transition-all duration-300"
                >
                  {/* Accordion Trigger Button */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    className="w-full py-5 px-6 sm:px-8 flex items-center justify-between gap-4 text-left select-none hover:bg-[#F1F5F9]/40 transition-colors group"
                  >
                    <span className="font-bold text-slate-800 text-[15px] sm:text-base tracking-tight leading-snug group-hover:text-slate-900 transition-colors">
                      {item.question}
                    </span>
                    <div className="shrink-0 p-1">
                      <Plus 
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 stroke-[2.5]
                          ${isOpen ? 'rotate-45 text-[#FF007A]' : 'group-hover:text-slate-800'}
                        `} 
                      />
                    </div>
                  </button>

                  {/* Accordion Smooth Height Expanding Container */}
                  <div
                    className={`transition-all duration-300 ease-in-out border-slate-100/40
                      ${isOpen ? 'max-h-[300px] border-t' : 'max-h-0 pointer-events-none'}
                    `}
                  >
                    <div className="p-6 sm:p-8 pt-4 sm:pt-4 text-gray-500 text-sm sm:text-[15px] font-medium leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}