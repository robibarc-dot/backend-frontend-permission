"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import WritingTemplate from "../writing/WritingTemplate";
import { writingSample } from "./examSamples";
import { Button, Card, LockedOverlay, PageIntro, SectionTitle } from "./shared";

export default function WritingPage({ onUpgrade }) {
    const [essay, setEssay] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

    return (
        <div>
            <PageIntro title="Writing Lab" subtitle="Free: submit essays for basic feedback. Pro: full AI band scores and detailed comments." />
            <div className="grid gap-[18px] xl:grid-cols-[1fr_320px]">
                <div>
                    <WritingTemplate
                        task={writingSample}
                        value={essay}
                        onChange={(value) => {
                            setEssay(value);
                            setShowFeedback(false);
                        }}
                        onSubmit={() => setShowFeedback(true)}
                    />
                    {showFeedback ? (
                        <div className="mt-4 space-y-3">
                            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                <h3 className="text-[13px] font-bold text-red-600">Basic check complete</h3>
                                <p className="mt-1 text-[12.5px] leading-6 text-gray-600">Your essay has a clear prompt response. Keep improving paragraph transitions and example quality.</p>
                            </div>
                            <div className="relative overflow-hidden rounded-xl">
                                <Card className="select-none opacity-40 blur-[3px]">
                                    <h3 className="mb-3 text-sm font-bold">AI Band Score Analysis</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Task 6.0", "Coherence 5.5", "Grammar 5.0"].map((item) => <div key={item} className="rounded-lg bg-gray-100 p-3 text-center text-xs font-bold">{item}</div>)}
                                    </div>
                                </Card>
                                <LockedOverlay title="AI Scoring" description="Get band scores for all 4 criteria with improvement suggestions." onUpgrade={onUpgrade} />
                            </div>
                        </div>
                    ) : null}
                </div>
                <div>
                    <SectionTitle>Writing Tips</SectionTitle>
                    <Card className="mb-3.5">
                        <h3 className="mb-3 text-[13px] font-bold text-red-600">Task 2 Structure</h3>
                        {["Introduction - paraphrase and position", "Body 1 - first view with evidence", "Body 2 - second view or counterpoint", "Conclusion - restate your opinion"].map((tip, index) => (
                            <p key={tip} className="mb-2 flex gap-3 text-[12.5px] text-gray-600"><span className="font-bold text-red-600">P{index + 1}</span>{tip}</p>
                        ))}
                    </Card>
                    <div className="relative overflow-hidden rounded-[14px]">
                        <Card className="select-none opacity-40 blur-[2px]">
                            <h3 className="text-sm font-bold">AI Writing Coach</h3>
                            <p className="mt-2 text-xs leading-6 text-gray-500">Real-time vocabulary suggestions, repetition detection, and examiner-style comments.</p>
                        </Card>
                        <LockedOverlay title="AI Writing Coach" description="Real-time corrections and vocabulary suggestions are available in Pro." onUpgrade={onUpgrade} />
                    </div>
                    <Button className="mt-4 w-full" onClick={() => setShowFeedback(true)}>
                        <Send size={14} /> Submit for Basic Check
                    </Button>
                </div>
            </div>
        </div>
    );
}
