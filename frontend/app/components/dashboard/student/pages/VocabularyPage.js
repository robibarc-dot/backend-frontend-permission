"use client";

import { Card, LockedOverlay, PageIntro, SectionTitle } from "./shared";

const words = [
    { word: "Proliferate", phonetic: "/pruh-li-fuh-rayt/ verb", def: "To increase rapidly in number or amount.", example: "Digital learning tools have proliferated in recent years." },
    { word: "Mitigate", phonetic: "/mit-i-gayt/ verb", def: "To make something less severe or harmful.", example: "Planning can mitigate the pressure of exam day." },
    { word: "Ubiquitous", phonetic: "/yoo-bik-wi-tuhs/ adjective", def: "Appearing or being found everywhere.", example: "Smartphones are ubiquitous in modern society." },
];

export default function VocabularyPage({ onUpgrade }) {
    return (
        <div>
            <PageIntro title="Vocabulary Builder" subtitle="Free: 50 IELTS words. Pro: full 3,000 word bank with spaced repetition." />
            <SectionTitle>Today's Words - Free</SectionTitle>
            <div className="mb-7 grid gap-3 lg:grid-cols-3">
                {words.map((item) => (
                    <Card key={item.word}>
                        <h3 className="font-['Sora',sans-serif] text-[17px] font-bold text-red-600">{item.word}</h3>
                        <p className="mt-1 text-[11.5px] text-gray-400">{item.phonetic}</p>
                        <p className="mt-2 text-[12.5px] leading-6 text-gray-600">{item.def}</p>
                        <p className="mt-3 rounded-r-md border-l-2 border-red-600 bg-red-50 px-3 py-2 text-[11.5px] italic text-gray-500">{item.example}</p>
                    </Card>
                ))}
            </div>
            <div className="relative overflow-hidden rounded-[14px]">
                <div className="select-none opacity-40 blur-[3px]">
                    <SectionTitle>Full Word Bank - 3,000 Words</SectionTitle>
                    <div className="grid gap-3 lg:grid-cols-3">
                        {["Exacerbate", "Pragmatic", "Alleviate"].map((word) => <Card key={word}><h3 className="font-bold text-red-600">{word}</h3><p className="mt-2 text-xs text-gray-500">Advanced IELTS vocabulary with examples.</p></Card>)}
                    </div>
                </div>
                <LockedOverlay title="3,000 IELTS Words" description="Topic groups, collocations, usage examples, and flashcards are available in Pro." features={["Spaced Repetition", "Topic Groups", "Collocations"]} onUpgrade={onUpgrade} />
            </div>
        </div>
    );
}
