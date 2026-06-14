"use client";

import { Mic } from "lucide-react";
import { Card, LockedOverlay, PageIntro } from "./shared";

export default function SpeakingPage({ onUpgrade }) {
    return (
        <div>
            <PageIntro title="Speaking Lab" subtitle="AI-powered speaking practice with instant feedback." />
            <div className="relative min-h-[430px] overflow-hidden rounded-[14px]">
                <div className="select-none opacity-40 blur-[4px]">
                    <div className="mb-5 grid gap-3 md:grid-cols-3">
                        {["Part 1 - familiar topics", "Part 2 - long turn", "Part 3 - abstract topics"].map((item) => (
                            <Card key={item} className="text-center"><Mic className="mx-auto mb-2 text-red-600" /> <strong className="text-sm">{item}</strong></Card>
                        ))}
                    </div>
                    <Card className="py-10 text-center">
                        <div className="mx-auto mb-5 flex h-14 items-end justify-center gap-1">
                            {[20, 40, 70, 35, 80, 55, 30, 65, 45, 25].map((height, index) => <span key={index} className="w-1 rounded bg-red-600/50" style={{ height: `${height}%` }} />)}
                        </div>
                        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-600 bg-red-50 text-red-600"><Mic /></span>
                    </Card>
                </div>
                <LockedOverlay title="AI Speaking Lab" description="Record your speaking responses and get feedback on fluency, pronunciation, vocabulary, grammar, and band score." features={["Fluency", "Pronunciation", "Vocabulary", "Grammar", "Band Score"]} onUpgrade={onUpgrade} />
            </div>
        </div>
    );
}
