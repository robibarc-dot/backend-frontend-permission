'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

const secondaryPosts = [
  {
    title: '10 Listening Traps Every CD IELTS Candidate Falls Into',
    excerpt: 'Learn the sneaky distractors examiners use and how to avoid losing easy marks.',
    category: 'Listening',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&h=200&q=80',
  },
  {
    title: 'Skimming vs Scanning: The Reading Strategy That Saves 15 Minutes',
    excerpt: 'Stop reading word-by-word. Here\'s the structured approach that gets you to the...',
    category: 'Reading',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&h=200&q=80',
  },
  {
    title: 'Speaking Part 2: How to Fill 2 Minutes Without Freezing',
    excerpt: 'Get a proven 4-part framework to structure your answer. Our proven template...',
    category: 'Speaking',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&h=200&q=80',
  },
];

export default function IeltsExpertBlog() {
  return (
    <section className="w-full bg-white py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs sm:text-sm font-bold text-[#1E60FF] tracking-wider uppercase block">
              Tips & Guides
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-tight">
              Learn From Our <span className="text-[#FF007A]">IELTS Expert</span> Blog
            </h2>
            <p className="text-gray-500 text-[15px] sm:text-base font-medium leading-relaxed">
              Actionable tips, strategies, and insights from band 9 scorers and IELTS examiners.
            </p>
          </div>
          
          {/* Header Action Button */}
          <div className="shrink-0">
            <Link 
              href="/blog" 
              className="inline-flex items-center justify-center gap-2 bg-[#FF007A] hover:bg-[#E0006C] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all group shadow-sm"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Asymmetric Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER: Featured Big Card Hero (7 Columns) */}
          <Link 
            href="/blog/featured-post-slug"
            className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300"
          >
            {/* Featured Thumbnail Frame */}
            <div className="relative aspect-[16/9] w-full bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&h=450&q=80" // Replace with local writing-mockup file asset if needed
                alt="How to Score Band 8 in IELTS Writing Task 2"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Featured Meta Info Block */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    May 6, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    7 min read
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug hover:text-[#FF007A] transition-colors">
                  How to Score Band 8 in IELTS Writing Task 2: A Step-by-Step Examiner's Breakdown
                </h3>
                
                <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed font-medium">
                  Most candidates lose marks without realizing it. In this guide, an ex-examiner walks you through exactly what a Band 8 essay looks like — and how to write one.
                </p>
              </div>

              {/* Author Bio Panel footer */}
              <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
                    alt="Sarah Khan" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">Sarah Khan</h4>
                  <p className="text-[11px] text-gray-400 font-semibold">IELTS Examiner, 12 yrs</p>
                </div>
              </div>
            </div>
          </Link>

          {/* RIGHT CONTAINER: Secondary Stack List Rows (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-5 w-full">
            {secondaryPosts.map((post) => (
              <Link 
                key={post.title}
                href={`/blog/${post.category.toLowerCase()}`}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 sm:gap-5 items-start hover:shadow-md transition-shadow duration-300 group cursor-pointer"
              >
                {/* Embedded Row Card Thumbnail Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300" 
                  />
                </div>

                {/* Condensed Article Information Meta Column */}
                <div className="flex-1 space-y-2">
                  <h4 className="text-[14px] sm:text-[15px] font-extrabold text-[#0F172A] leading-snug tracking-tight group-hover:text-[#FF007A] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2 hidden sm:block">
                    {post.excerpt}
                  </p>
                  
                  {/* Category Pill Labels & Metadata fields */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="bg-[#FFF0F5] text-[#FF007A] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}