"use client";

import { useState } from "react";
import { BookOpen, Headphones, PenLine } from "lucide-react";
import ListeningTemplate from "../listening/ListeningTemplate";
import ReadingTemplate from "../reading/ReadingTemplate";
import WritingTemplate from "../writing/WritingTemplate";
import { listeningSample, readingSample, writingSample } from "./examSamples";
import { PageIntro } from "./shared";

const modes = [
    { id: "listening", label: "Listening", icon: Headphones },
    { id: "reading", label: "Reading", icon: BookOpen },
    { id: "writing", label: "Writing", icon: PenLine },
];

export default function PracticePage() {
    const [mode, setMode] = useState("listening");
    const [answers, setAnswers] = useState({});
    const [essay, setEssay] = useState("");

    const handleAnswerChange = (id, value) => {
        setAnswers((current) => ({ ...current, [id]: value }));
    };

    return (
        <div>
            <PageIntro title="Free Practice" subtitle="Practice individual IELTS skills using the exam templates." />
            <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-black/10 bg-white p-2">
                {modes.map((item) => {
                    const Icon = item.icon;
                    const isActive = mode === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setMode(item.id)}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold transition ${isActive ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-950"}`}
                        >
                            <Icon size={15} /> {item.label}
                        </button>
                    );
                })}
            </div>

            <div className="min-h-[520px] rounded-[14px] border border-black/10 bg-white p-4">
                {mode === "listening" ? (
                    <ListeningTemplate audioUrl={listeningSample.audioUrl} questions={listeningSample.questions} answers={answers} onAnswerChange={handleAnswerChange} />
                ) : null}
                {mode === "reading" ? (
                    <ReadingTemplate passage={readingSample.passage} questions={readingSample.questions} answers={answers} onAnswerChange={handleAnswerChange} />
                ) : null}
                {mode === "writing" ? (
                    <WritingTemplate task={writingSample} value={essay} onChange={setEssay} />
                ) : null}
            </div>
        </div>
    );
}
