"use client";

import { BookOpen } from "lucide-react";
import { LockedOverlay, PageIntro } from "./shared";

export default function ResourcesPage({ onUpgrade }) {
    const items = [
        { title: "How to Structure IELTS Task 2 Essays", type: "Free", color: "bg-gradient-to-br from-blue-900 to-slate-900", body: "A practical four-paragraph formula for Task 2." },
        { title: "Top 10 Listening Section Tips", type: "Free", color: "bg-gradient-to-br from-violet-900 to-indigo-950", body: "Read ahead, predict answer types, and avoid distractors." },
        { title: "Band 8 Writing: Full Essays Analyzed", type: "Pro", color: "bg-gradient-to-br from-slate-800 to-blue-950", body: "Annotated Band 8 writing samples with examiner notes." },
    ];

    return (
        <div>
            <PageIntro title="Study Resources" subtitle="Guides, videos, and IELTS tips. Some resources need Pro." />
            <div className="grid gap-3 lg:grid-cols-3">
                {items.map((item) => (
                    <div key={item.title} className="relative overflow-hidden rounded-[14px] border border-black/10 bg-white">
                        <div className={`flex h-28 items-center justify-center ${item.color} text-white`}><BookOpen size={38} /></div>
                        <div className={item.type === "Pro" ? "select-none p-4 opacity-45 blur-[2px]" : "p-4"}>
                            <span className={`rounded-full border px-2 py-1 text-[10.5px] font-bold ${item.type === "Pro" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-100 bg-red-50 text-red-600"}`}>{item.type}</span>
                            <h3 className="mt-3 font-['Sora',sans-serif] text-[13.5px] font-bold text-gray-950">{item.title}</h3>
                            <p className="mt-2 text-xs leading-6 text-gray-500">{item.body}</p>
                        </div>
                        {item.type === "Pro" ? <LockedOverlay title="Pro Resource" description="Upgrade to read premium strategy guides and analyzed essays." onUpgrade={onUpgrade} /> : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
