"use client";

import { Button, Card, LockedOverlay, PageIntro } from "./shared";

export default function MockTestsPage({ onUpgrade }) {
    const tests = [
        { title: "Full Mock Test #13", meta: "Academic, latest pattern", free: true },
        { title: "Full Mock Test #14", meta: "Academic, balanced sections" },
        { title: "Full Mock Test #15", meta: "General Training format" },
    ];

    return (
        <div>
            <PageIntro title="Mock Tests" subtitle="You have 3 free tests remaining this month. Pro members get unlimited tests." />
            <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-950">Monthly Test Slots</h3>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="h-1.5 w-40 overflow-hidden rounded-full bg-gray-200"><span className="block h-full w-0 bg-red-600" /></span>
                        <span className="text-xs text-gray-400">0 / 3 used</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">Resets June 1. 3 slots remaining.</p>
                </div>
                <Button variant="amber" className="px-3 py-2 text-xs" onClick={onUpgrade}>Unlock Unlimited</Button>
            </Card>
            <div className="mb-6 grid gap-3 lg:grid-cols-3">
                {tests.map((test) => (
                    <div key={test.title} className="relative overflow-hidden rounded-[14px] border border-black/10 bg-white">
                        <div className={`h-1 ${test.free ? "bg-red-600" : "bg-gradient-to-r from-amber-500 to-violet-600"}`} />
                        <div className={`p-[18px] ${test.free ? "" : "select-none opacity-40 blur-[2px]"}`}>
                            <div className="mb-3 flex items-center justify-between">
                                <span className={`rounded-full border px-2 py-1 text-[10.5px] font-bold ${test.free ? "border-red-100 bg-red-50 text-red-600" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                                    {test.free ? "Free" : "Pro"}
                                </span>
                                <span className="text-[11px] text-gray-400">May 2026</span>
                            </div>
                            <h3 className="font-['Sora',sans-serif] text-[15px] font-bold text-gray-950">{test.title}</h3>
                            <p className="mt-1 text-xs text-gray-400">{test.meta}</p>
                            <div className="my-4 space-y-1.5 text-xs text-gray-600">
                                {["Listening 30 min", "Reading 60 min", "Writing 60 min", "Speaking 13 min"].map((line) => <p key={line}>{line}</p>)}
                            </div>
                            <Button className="w-full px-3 py-2 text-xs">Start Test</Button>
                        </div>
                        {!test.free ? <LockedOverlay title="Pro Test" description="Upgrade to access unlimited Academic and General Training tests." onUpgrade={onUpgrade} /> : null}
                    </div>
                ))}
            </div>
            <Card className="border-dashed border-amber-200 bg-amber-50/30 text-center">
                <h3 className="font-['Sora',sans-serif] text-[15px] font-bold text-gray-950">50+ more mock tests</h3>
                <p className="mx-auto mt-1 max-w-md text-[12.5px] leading-6 text-gray-400">Academic and General Training tests added monthly, covering all difficulty levels.</p>
                <Button variant="amber" className="mt-4" onClick={onUpgrade}>Unlock All Tests</Button>
            </Card>
        </div>
    );
}
