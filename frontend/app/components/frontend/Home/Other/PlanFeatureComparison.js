'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';

const featuresData = [
  { name: 'Mock Tests / Month', basic: '5', pro: 'Unlimited', premium: 'Unlimited', isHighlighted: true },
  { name: 'AI Feedback', basic: true, pro: true, premium: true },
  { name: 'Speaking Practice', basic: true, pro: true, premium: true },
  { name: 'Writing Analysis', basic: false, pro: true, premium: true },
  { name: 'Band Prediction', basic: false, pro: true, premium: true },
  { name: 'Performance Analytics', basic: false, pro: true, premium: true },
  { name: '1-on-1 Mentor Review', basic: false, pro: false, premium: true },
  { name: 'Advanced Band Strategy', basic: false, pro: false, premium: true },
  { name: 'Priority Support', basic: false, pro: true, premium: true },
];

export default function PlanFeatureComparison() {
  const renderValue = (val, isPro = false) => {
    if (typeof val === 'string') {
      return (
        <span className={`font-bold text-[15px] ${isPro ? 'text-[#FF007A]' : 'text-slate-700'}`}>
          {val}
        </span>
      );
    }
    return val ? (
      <Check className="w-5 h-5 text-emerald-500 mx-auto stroke-[2.5]" aria-hidden="true" />
    ) : (
      <Minus className="w-4 h-4 text-slate-200 mx-auto stroke-[2]" aria-hidden="true" />
    );
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Plan Feature Comparison
          </h2>
        </div>

        {/* --- DESKTOP TABLE VIEW (Visible on md screens and larger) --- */}
        <div className="hidden md:block w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-left p-2">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-6 px-8 text-xs font-bold text-slate-400 tracking-wider uppercase w-[40%]">
                  Feature
                </th>
                <th className="py-6 px-6 text-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Basic
                </th>
                <th className="py-6 px-6 text-center text-xs font-bold text-[#FF007A] tracking-wider uppercase">
                  <div className="flex items-center justify-center gap-1">
                    Pro <span className="text-xs" aria-hidden="true">⭐</span>
                  </div>
                </th>
                <th className="py-6 px-6 text-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {featuresData.map((feature) => (
                <tr key={feature.name} className="hover:bg-slate-50/40 transition-colors">
                  {/* Feature Name */}
                  <td className="py-3 px-8 text-[14px] font-semibold text-slate-600">
                    {feature.name}
                  </td>
                  {/* Basic Value */}
                  <td className="py-3 px-6 text-center">
                    {renderValue(feature.basic)}
                  </td>
                  {/* Pro Value (Highlighted column target matching image) */}
                  <td className="py-3 px-6 text-center bg-slate-50/30">
                    {renderValue(feature.pro, true)}
                  </td>
                  {/* Premium Value */}
                  <td className="py-3 px-6 text-center">
                    {renderValue(feature.premium)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE ACCORDION/CARD VIEW (Visible on screens smaller than md) --- */}
        <div className="block md:hidden space-y-1">
          {['Basic', 'Pro', 'Premium'].map((tier) => {
            const isPro = tier === 'Pro';
            return (
              <div 
                key={tier} 
                className={`bg-white rounded-2xl p-6 border transition-all ${
                  isPro 
                    ? 'border-[#FF007A] shadow-[0_10px_30px_-10px_rgba(255,0,122,0.06)]' 
                    : 'border-slate-100 shadow-sm'
                }`}
              >
                {/* Mobile Tier Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className={`text-lg font-black tracking-tight ${isPro ? 'text-[#FF007A]' : 'text-slate-800'}`}>
                    {tier} Plan {isPro && <span aria-hidden="true">⭐</span>}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md">
                    Included Perks
                  </span>
                </div>

                {/* Mobile Feature List Wrapper */}
                <ul className="space-y-1">
                  {featuresData.map((feature) => {
                    const value = tier === 'Basic' ? feature.basic : tier === 'Pro' ? feature.pro : feature.premium;
                    const isAvailable = value !== false;

                    return (
                      <li 
                        key={feature.name} 
                        className={`flex items-center justify-between text-sm ${
                          isAvailable ? 'text-slate-700 font-medium' : 'text-slate-300 line-through font-normal'
                        }`}
                      >
                        <span className="text-slate-500 text-[13px]">{feature.name}</span>
                        <div className="flex items-center shrink-0">
                          {typeof value === 'string' ? (
                            <span className={`font-bold text-sm ${isPro && feature.isHighlighted ? 'text-[#FF007A]' : 'text-slate-700'}`}>
                              {value}
                            </span>
                          ) : value ? (
                            <Check className="w-4 h-4 text-emerald-500 stroke-[3]" aria-hidden="true" />
                          ) : (
                            <Minus className="w-3 h-3 text-slate-200 stroke-[2]" aria-hidden="true" />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}