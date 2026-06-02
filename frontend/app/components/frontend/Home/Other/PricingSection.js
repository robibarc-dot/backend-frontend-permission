'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    prices: { monthly: 499, yearly: 349 },
    description: 'Consistent IELTS practice with essential AI feedback and progress tracking.',
    features: [
      '5 mock tests each month',
      'AI feedback on all sections',
      'Speaking practice',
      'Progress tracking',
      'Free study resources',
    ],
    ctaText: 'Get Started',
    ctaHref: '/register',
    isFeatured: false,
  },
  {
    name: 'Pro',
    prices: { monthly: 999, yearly: 699 },
    description: 'Unlimited practice, full AI evaluation, and smarter analytics for serious learners.',
    features: [
      'Unlimited mock tests',
      'Full AI evaluation',
      'Speaking and writing analysis',
      'Band score prediction',
      'Performance analytics',
      'Priority support',
    ],
    ctaText: 'Start Free Trial',
    ctaHref: '/register',
    isFeatured: true,
  },
  {
    name: 'Premium',
    eyebrow: 'Expert',
    prices: { monthly: 1499, yearly: 1049 },
    description: 'Human mentor reviews and guided strategy for students targeting a higher band.',
    features: [
      'Everything in Pro',
      '1-on-1 mentor review',
      'Priority support',
      'Advanced band strategy',
      'Dedicated study plan',
    ],
    ctaText: 'Get Premium',
    ctaHref: '/register',
    isFeatured: false,
  },
];

const guarantees = ['Cancel anytime', 'No hidden fees', 'Instant access', '30-day money back'];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const billingLabel = billingCycle === 'yearly' ? 'Billed yearly' : 'Billed monthly';

  const pricedPlans = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        price: plan.prices[billingCycle],
      })),
    [billingCycle]
  );

  return (
    <section className="w-full bg-[#FAFAFA] py-16 sm:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-4">
          <span className="text-[11px] sm:text-xs font-bold text-[#FF007A] tracking-widest uppercase block">
            Hybrid Pricing Model
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-tight max-w-xl mx-auto">
            Choose Your IELTS Success Plan
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[15px] font-medium max-w-2xl mx-auto leading-relaxed">
            Subscription plans for daily learners, designed to help you practise consistently and improve your band score.
          </p>
        </div>

        <div className="flex justify-center mb-12 sm:mb-16" id="feature-pricing">
          <div
            className="inline-grid grid-cols-2 gap-1 rounded-lg bg-white p-1.5 shadow-sm border border-gray-200/70"
            role="group"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              aria-pressed={billingCycle === 'monthly'}
              className={`min-w-[112px] rounded-md px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-[#FF007A] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-slate-50 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              aria-pressed={billingCycle === 'yearly'}
              className={`min-w-[112px] rounded-md px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-[#FF007A] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-slate-50 hover:text-gray-800'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch max-w-6xl mx-auto mb-12">
          {pricedPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col rounded-lg bg-white p-6 sm:p-7 transition-all duration-300 ${
                plan.isFeatured
                  ? 'border-2 border-[#FF007A] shadow-[0_18px_42px_-24px_rgba(255,0,122,0.65)]'
                  : 'border border-gray-200/70 shadow-sm hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3 left-6 rounded-md bg-[#FF007A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`text-xs font-extrabold tracking-widest uppercase ${
                          plan.isFeatured ? 'text-[#FF007A]' : 'text-gray-400'
                        }`}
                      >
                        {plan.name}
                      </span>
                      {plan.eyebrow && (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {plan.eyebrow}
                        </span>
                      )}
                    </div>

                    <div className="flex items-end gap-2 text-[#0F172A]">
                      <span className="pb-2 text-xl font-black">Tk</span>
                      <span className="text-4xl sm:text-5xl font-black tracking-tight">{plan.price}</span>
                      <span className="pb-2 text-sm font-semibold text-gray-400">/month</span>
                    </div>

                    <div className="flex min-h-6 items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">{billingLabel}</span>
                      {billingCycle === 'yearly' && (
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-600">
                          Save 30%
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
                      {plan.description}
                    </p>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-600 font-medium text-[14px]">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            plan.isFeatured ? 'bg-[#FFF0F5] text-[#FF007A]' : 'bg-emerald-50 text-emerald-500'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    href={plan.ctaHref}
                    className={`inline-flex w-full items-center justify-center rounded-md px-4 py-3.5 text-[14px] font-bold tracking-wide transition-all ${
                      plan.isFeatured
                        ? 'bg-gradient-to-r from-[#FF0055] to-[#FF3377] text-white shadow-md shadow-pink-100 hover:opacity-95'
                        : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-gray-100 pt-5">
          {guarantees.map((text) => (
            <div key={text} className="flex items-center gap-2 text-slate-500 text-[13px] font-semibold">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
