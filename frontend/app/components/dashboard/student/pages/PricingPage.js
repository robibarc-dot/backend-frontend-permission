"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Card } from "./shared";

const pricingPlans = [
    { name: "Basic", price: "499", description: "For consistent daily practice.", features: ["5 mock tests per month", "AI feedback on all sections", "Speaking practice", "Progress tracking"] },
    { name: "Pro", price: "999", description: "For serious IELTS takers.", features: ["Unlimited mock tests", "Full AI evaluation", "Writing and speaking analysis", "Band score prediction", "Performance analytics"], featured: true },
    { name: "Premium", price: "1499", description: "For guided mentor support.", features: ["Everything in Pro", "1-on-1 mentor review", "Priority support", "Dedicated study plan"] },
];

export default function PricingPage({ onUpgrade }) {
    const [yearly, setYearly] = useState(false);

    return (
        <div>
            <div className="mb-8 text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-red-600">Hybrid Pricing Model</p>
                <h2 className="mt-3 font-['Sora',sans-serif] text-3xl font-black leading-tight text-gray-950">Choose Your IELTS Success Plan</h2>
                <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-6 text-gray-400">Subscription for daily learners. Mock packs for flexible practice.</p>
                <div className="mt-5 inline-flex rounded-full border border-black/10 bg-gray-100 p-1">
                    <button type="button" onClick={() => setYearly(false)} className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${!yearly ? "bg-red-600 text-white" : "text-gray-500"}`}>Monthly</button>
                    <button type="button" onClick={() => setYearly(true)} className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${yearly ? "bg-red-600 text-white" : "text-gray-500"}`}>Yearly Save 30%</button>
                </div>
            </div>
            <div className="mb-7 grid gap-4 lg:grid-cols-3">
                {pricingPlans.map((plan) => {
                    const price = yearly ? Math.round(Number(plan.price) * 0.7) : plan.price;
                    return (
                        <div key={plan.name} className={`relative rounded-[14px] border bg-white p-6 ${plan.featured ? "border-red-600 shadow-[0_8px_32px_rgba(220,38,38,0.14)]" : "border-black/10"}`}>
                            {plan.featured ? <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-[11px] font-black text-white">MOST POPULAR</span> : null}
                            <p className={`text-[10.5px] font-black uppercase tracking-[0.14em] ${plan.featured ? "text-red-600" : "text-gray-400"}`}>{plan.name}</p>
                            <div className="mt-3 flex items-baseline gap-1"><span className="text-sm font-bold text-gray-500">BDT</span><span className="font-['Sora',sans-serif] text-[38px] font-black text-gray-950">{price}</span><span className="text-[13px] text-gray-400">/month</span></div>
                            <p className="mt-1 text-xs leading-6 text-gray-400">{plan.description}</p>
                            <div className="my-5 space-y-2">
                                {plan.features.map((feature) => <p key={feature} className="flex items-center gap-2 text-[12.5px] text-gray-700"><CheckCircle2 size={16} className="text-emerald-600" />{feature}</p>)}
                            </div>
                            <Button variant={plan.featured ? "primary" : "outline"} className="w-full" onClick={onUpgrade}>{plan.featured ? "Start Free Trial" : "Get Started"}</Button>
                        </div>
                    );
                })}
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
                {[["Starter Pack", "3 full mock tests", "299"], ["Advanced Pack", "10 full mock tests", "799"], ["Writing Evaluation", "5 expert writing reviews", "499"]].map(([name, desc, price]) => (
                    <Card key={name}>
                        <div className="flex items-start justify-between gap-4">
                            <div><h3 className="font-['Sora',sans-serif] text-sm font-bold text-gray-950">{name}</h3><p className="mt-1 text-xs text-gray-400">{desc}</p></div>
                            <div className="text-right"><strong className="text-red-600">BDT {price}</strong><p className="text-[10.5px] text-gray-400">one-time</p></div>
                        </div>
                        <Button className="mt-4 w-full px-3 py-2 text-xs" onClick={onUpgrade}>Get Started</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
