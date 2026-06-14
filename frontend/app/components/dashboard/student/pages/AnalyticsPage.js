"use client";

import { Card, LockedOverlay, PageIntro, SectionTitle } from "./shared";

export default function AnalyticsPage({ onUpgrade }) {
    return (
        <div>
            <PageIntro title="My Analytics" subtitle="Track progress over time. Detailed analytics are available with Pro." />
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[["Latest Band", "-"], ["Tests Taken", "0"], ["Total Study", "38h"], ["Day Streak", "14"]].map(([label, value]) => (
                    <Card key={label}><div className="font-['Sora',sans-serif] text-2xl font-bold text-red-600">{value}</div><p className="text-xs text-gray-400">{label}</p></Card>
                ))}
            </div>
            <div className="relative overflow-hidden rounded-[14px]">
                <Card className="select-none opacity-40 blur-[3px]">
                    <SectionTitle>Score Trend - Last 6 Months</SectionTitle>
                    <div className="flex h-24 items-end gap-2">
                        {[45, 52, 58, 64, 70, 78].map((height, index) => <span key={index} className="flex-1 rounded-t bg-red-600/70" style={{ height: `${height}%` }} />)}
                    </div>
                </Card>
                <LockedOverlay title="Advanced Analytics" description="Score trends, weak topic identification, predictions, and PDF reports." features={["Trends", "Weak Topics", "Predictions", "PDF Reports"]} onUpgrade={onUpgrade} />
            </div>
        </div>
    );
}
