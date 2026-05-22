'use client';

import React from 'react';
import { Star } from 'lucide-react';

const row1Testimonials = [
  {
    name: 'Dazzle Healer',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: "I've used other kits, but this one is the best. The attention to detail and usability are truly amazing for all designers. I highly recommend it for any type of project.",
  },
  {
    name: 'Crystal Maiden',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'This UI Kit is incredibly helpful for my daily tasks. The components and illustrations are clean, modern, and super easy to customize. It is perfect for beginners and professionals alike.',
  },
  {
    name: 'Lina Ray',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'The mock tests helped me understand my weak areas quickly. The practice flow is simple, focused, and easy to follow even during a busy study schedule.',
  },
];

const row2Testimonials = [
  {
    name: 'Mirana Marci',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: "This UI Kit saved me hours of work. It's intuitive, high-quality, and totally worth the price for all design needs. My projects look more professional and appealing now.",
  },
  {
    name: 'Bimosaurus',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'Amazing work! The color schemes are vibrant, and the icons fit perfectly with all my projects, especially modern UI designs. It makes everything look polished and user-friendly instantly.',
  },
  {
    name: 'Aisha Karim',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'I liked how clearly the progress and feedback were shown. It made IELTS preparation feel organized instead of overwhelming.',
  },
];

export default function StudentFeedbackSection() {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 sm:py-20 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-[13px] sm:text-sm font-bold text-[#1E60FF] tracking-wider uppercase block">
            Students Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-tight">
            What Our Students Say
          </h2>
        </div>
      </div>

      <div className="relative space-y-5 sm:space-y-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent sm:w-28" />

        <FeedbackMarquee testimonials={row1Testimonials} direction="left" />
        <FeedbackMarquee testimonials={row2Testimonials} direction="right" />
      </div>

      <style jsx global>{`
        @keyframes feedback-slide-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes feedback-slide-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        .feedback-track-left {
          animation: feedback-slide-left 28s linear infinite;
        }

        .feedback-track-right {
          animation: feedback-slide-right 30s linear infinite;
        }

        .feedback-marquee:hover .feedback-track-left,
        .feedback-marquee:hover .feedback-track-right {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .feedback-track-left,
          .feedback-track-right {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

function FeedbackMarquee({ testimonials, direction }) {
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];
  const trackClass = direction === 'right' ? 'feedback-track-right' : 'feedback-track-left';

  return (
    <div className="feedback-marquee overflow-hidden">
      <div className={`flex w-max gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 ${trackClass}`}>
        {duplicatedTestimonials.map((item, index) => (
          <TestimonialCard key={`${direction}-${item.name}-${index}`} card={item} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ card }) {
  return (
    <article className="w-[300px] sm:w-[380px] lg:w-[520px] shrink-0 bg-white rounded-lg p-5 sm:p-6 lg:p-7 shadow-[0_12px_34px_-24px_rgba(15,23,42,0.45)] border border-gray-100 transition-colors duration-300 hover:border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <img
            src={card.avatar}
            alt={card.name}
            className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm"
            loading="lazy"
          />
          <div className="min-w-0">
            <h4 className="truncate font-bold text-[#1E293B] text-[14px] sm:text-[15px] tracking-tight">
              {card.name}
            </h4>
            <p className="text-xs text-gray-400 font-semibold">{card.role}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 text-[#FF9E0B]" aria-label={`${card.rating} out of 5 stars`}>
          {Array.from({ length: card.rating }).map((_, index) => (
            <Star key={index} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current stroke-[1.5]" aria-hidden="true" />
          ))}
        </div>
      </div>

      <p className="mt-4 text-gray-500 text-[13px] sm:text-[14px] leading-relaxed font-medium">
        {card.text}
      </p>
    </article>
  );
}
