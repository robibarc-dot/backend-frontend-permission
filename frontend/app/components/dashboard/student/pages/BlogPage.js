"use client";

import { Button, Card, PageIntro } from "./shared";

export default function BlogPage({ onUpgrade }) {
    const posts = [
        ["5 Common Writing Mistakes to Avoid", "Free", "From off-topic responses to repetitive vocabulary."],
        ["How I Got Band 8 in Reading", "Free", "An 8-week reading strategy from a successful student."],
        ["Examiner Secrets: What Gets Band 9", "Pro", "Exclusive insights from former IELTS examiners."],
    ];

    return (
        <div>
            <PageIntro title="Expert Blog" subtitle="Tips, strategies, and IELTS success stories from tutors." />
            <div className="grid gap-3 lg:grid-cols-3">
                {posts.map(([title, type, body]) => (
                    <Card key={title} className={type === "Pro" ? "relative overflow-hidden" : ""}>
                        <span className={`rounded-full border px-2 py-1 text-[10.5px] font-bold ${type === "Pro" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-100 bg-red-50 text-red-600"}`}>{type}</span>
                        <h3 className="mt-3 font-['Sora',sans-serif] text-[13.5px] font-bold text-gray-950">{title}</h3>
                        <p className="mt-2 text-xs leading-6 text-gray-500">{body}</p>
                        {type === "Pro" ? <Button variant="amber" className="mt-4 px-3 py-2 text-xs" onClick={onUpgrade}>Unlock to Read</Button> : null}
                    </Card>
                ))}
            </div>
        </div>
    );
}
