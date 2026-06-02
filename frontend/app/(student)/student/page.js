"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
    BarChart3,
    BookOpen,
    Check,
    CheckCircle2,
    Clock,
    FileText,
    Flame,
    Headphones,
    Info,
    Lock,
    Mic,
    PenLine,
    Send,
    Sparkles,
    Target,
    Zap,
} from "lucide-react";
import { useStudentShell } from "../../components/dashboard/student/StudentShellContext";

const stats = [
    { label: "Current Band Score", value: "-", hint: "Take a test to see score", color: "text-gray-400", icon: BarChart3, bg: "bg-red-50", iconColor: "text-red-600" },
    { label: "Tests Completed", value: "0", hint: "3 free slots available", color: "text-amber-600", icon: FileText, bg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Study Time", value: "38h", hint: "+4h this week", color: "text-blue-600", icon: Clock, bg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Day Streak", value: "14", hint: "Personal best", color: "text-red-600", icon: Flame, bg: "bg-red-50", iconColor: "text-red-600" },
];

const modules = [
    { name: "Listening", score: "-", width: "0%", color: "bg-blue-500" },
    { name: "Reading", score: "-", width: "0%", color: "bg-emerald-500" },
    { name: "Writing", score: "-", width: "0%", color: "bg-amber-500" },
    { name: "Speaking", score: "-", width: "0%", color: "bg-red-500" },
];

const practiceCards = [
    { title: "Listening Practice", subtitle: "Mini exercises, no time limit", icon: Headphones, color: "blue", body: "Practice with individual audio clips and focus on note-taking, dates, names, and distractors." },
    { title: "Reading Practice", subtitle: "Individual passages", icon: BookOpen, color: "emerald", body: "Short reading passages with True/False/Not Given and multiple choice questions." },
    { title: "Writing Practice", subtitle: "Task 1 and Task 2 prompts", icon: PenLine, color: "amber", body: "Practice with IELTS-style prompts. Basic checks are free; AI scoring is available with Pro.", page: "writing" },
    { title: "Grammar Drills", subtitle: "25 exercises free", icon: Target, color: "violet", body: "Target common IELTS grammar issues and sentence patterns with compact drills." },
];

const words = [
    { word: "Proliferate", phonetic: "/pruh-li-fuh-rayt/ verb", def: "To increase rapidly in number or amount.", example: "Digital learning tools have proliferated in recent years." },
    { word: "Mitigate", phonetic: "/mit-i-gayt/ verb", def: "To make something less severe or harmful.", example: "Planning can mitigate the pressure of exam day." },
    { word: "Ubiquitous", phonetic: "/yoo-bik-wi-tuhs/ adjective", def: "Appearing or being found everywhere.", example: "Smartphones are ubiquitous in modern society." },
];

const pricingPlans = [
    { name: "Basic", price: "499", description: "For consistent daily practice.", features: ["5 mock tests per month", "AI feedback on all sections", "Speaking practice", "Progress tracking"] },
    { name: "Pro", price: "999", description: "For serious IELTS takers.", features: ["Unlimited mock tests", "Full AI evaluation", "Writing and speaking analysis", "Band score prediction", "Performance analytics"], featured: true },
    { name: "Premium", price: "1499", description: "For guided mentor support.", features: ["Everything in Pro", "1-on-1 mentor review", "Priority support", "Dedicated study plan"] },
];

function Card({ children, className = "", ...props }) {
    return (
        <div
            className={`rounded-[14px] border border-black/10 bg-white p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition hover:border-black/15 hover:bg-gray-50 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

function SectionTitle({ children }) {
    return <h2 className="mb-3.5 font-['Sora',sans-serif] text-sm font-bold text-gray-950">{children}</h2>;
}

function PageIntro({ title, subtitle }) {
    return (
        <div className="mb-6">
            <h2 className="font-['Sora',sans-serif] text-xl font-bold text-gray-950">{title}</h2>
            <p className="mt-1 text-[13px] text-gray-400">{subtitle}</p>
        </div>
    );
}

function Button({ children, variant = "primary", className = "", ...props }) {
    const styles = {
        primary: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-black/10 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-950",
        amber: "bg-amber-600 text-white hover:bg-amber-700",
    };

    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 rounded-[9px] px-4 py-2.5 text-[13px] font-bold transition ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

function LockedOverlay({ title, description, features = [], onUpgrade }) {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[14px] bg-gray-50/85 p-6 text-center backdrop-blur-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] border border-amber-300 bg-amber-50 text-amber-600">
                <Lock size={22} />
            </div>
            <h3 className="font-['Sora',sans-serif] text-sm font-bold text-gray-950">{title}</h3>
            <p className="mt-1 max-w-[260px] text-[11.5px] leading-6 text-gray-400">{description}</p>
            {features.length ? (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {features.map((feature) => (
                        <span key={feature} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-700">
                            {feature}
                        </span>
                    ))}
                </div>
            ) : null}
            <Button variant="amber" className="mt-4 px-5 py-2" onClick={onUpgrade}>
                <Sparkles size={13} /> Unlock Pro
            </Button>
        </div>
    );
}

function DashboardPage({ userName, onNavigate, onUpgrade }) {
    return (
        <div>
            <PageIntro
                title={`Welcome back, ${userName}`}
                subtitle="Your IELTS exam is in 23 days. You are on the Free Plan, with unlimited practice available in Pro."
            />

            <button
                type="button"
                onClick={onUpgrade}
                className="mb-5 flex w-full items-center gap-3.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-4 text-left transition hover:border-amber-300"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Zap size={18} />
                </span>
                <span className="min-w-0 flex-1">
                    <strong className="block text-[13px] text-amber-700">You have used 0 of 3 free mock tests</strong>
                    <span className="block text-xs text-amber-700/70">Start your first mock test now, or upgrade for unlimited tests and AI feedback.</span>
                </span>
                <span className="hidden rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white sm:inline-flex">Upgrade</span>
            </button>

            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
                <Info size={16} className="mt-0.5 shrink-0 text-red-600" />
                <p className="text-[12.5px] leading-6 text-gray-600">
                    <strong className="text-red-600">Today's tip:</strong> Writing Task 2 carries most of your writing score. Practice daily argumentative essays for the fastest improvement.
                </p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="p-4">
                            <div className={`mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-[9px] ${stat.bg} ${stat.iconColor}`}>
                                <Icon size={16} />
                            </div>
                            <div className={`font-['Sora',sans-serif] text-2xl font-bold leading-tight ${stat.color}`}>{stat.value}</div>
                            <p className="mt-1 text-[11.5px] text-gray-400">{stat.label}</p>
                            <p className="mt-1 text-[11px] text-gray-400">{stat.hint}</p>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-[18px] xl:grid-cols-[1fr_320px]">
                <div>
                    <SectionTitle>Recent Activity</SectionTitle>
                    <Card className="mb-[18px] text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <ClipboardIcon />
                        </div>
                        <h3 className="text-sm font-bold text-gray-950">No activity yet</h3>
                        <p className="mx-auto mt-1 max-w-sm text-xs leading-6 text-gray-400">Complete your first mock test or writing practice to see your activity here.</p>
                        <Button className="mt-4 px-3 py-2 text-xs" onClick={() => onNavigate("mock-tests")}>Start Mock Test</Button>
                    </Card>

                    <SectionTitle>Your Access Overview</SectionTitle>
                    <div className="grid gap-3 md:grid-cols-2">
                        <Card className="border-red-100">
                            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.12em] text-red-600">Free Access</p>
                            {["3 mock tests per month", "Basic writing practice", "50 vocabulary words", "Limited expert blog", "Basic score history"].map((item) => (
                                <p key={item} className="mb-2 flex items-center gap-2 text-xs text-gray-700"><Check size={14} className="text-red-600" /> {item}</p>
                            ))}
                        </Card>
                        <Card className="border-amber-100 bg-amber-50/40">
                            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.12em] text-amber-700">Pro Only</p>
                            {["Unlimited mock tests", "AI writing feedback", "AI speaking lab", "Advanced analytics", "Full vocabulary bank"].map((item) => (
                                <p key={item} className="mb-2 flex items-center gap-2 text-xs text-gray-500"><Lock size={13} className="text-amber-600" /> {item}</p>
                            ))}
                        </Card>
                    </div>
                </div>

                <div>
                    <SectionTitle>Band Score Tracker</SectionTitle>
                    <Card className="mb-[18px] text-center">
                        <div className="relative mx-auto mb-3 h-[100px] w-[100px]">
                            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" strokeDasharray="0 263" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-['Sora',sans-serif] text-base font-bold text-gray-400">-</span>
                                <span className="text-[9.5px] text-gray-400">No data</span>
                            </div>
                        </div>
                        <p className="mb-4 text-xs text-gray-400">Target: <strong className="text-amber-600">7.5</strong></p>
                        <div className="space-y-3 text-left">
                            {modules.map((module) => (
                                <div key={module.name}>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2 text-gray-600"><span className={`h-2 w-2 rounded-full ${module.color}`} />{module.name}</span>
                                        <span className="font-bold text-gray-400">{module.score}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200"><div className={`h-full ${module.color}`} style={{ width: module.width }} /></div>
                                </div>
                            ))}
                        </div>
                        <Button className="mt-4 w-full px-3 py-2 text-xs" onClick={() => onNavigate("mock-tests")}>Take Your First Test</Button>
                    </Card>

                    <SectionTitle>Study Streak</SectionTitle>
                    <Card>
                        <div className="mb-3 flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-700">14 days streak</span>
                            <span className="text-gray-400">Goal: 30 days</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 28 }, (_, index) => {
                                const day = index + 1;
                                const isToday = day === 26;
                                const isDone = day >= 12 && day < 26;
                                return (
                                    <span key={day} className={`flex aspect-square items-center justify-center rounded-md text-[9px] ${isToday ? "bg-red-600 font-bold text-white" : isDone ? "bg-red-50 font-bold text-red-600" : "bg-gray-100 text-gray-400"}`}>
                                        {day}
                                    </span>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ClipboardIcon() {
    return <FileText size={24} />;
}

function MockTestsPage({ onUpgrade }) {
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

function WritingPage({ onUpgrade }) {
    const [essay, setEssay] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const wordsCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

    return (
        <div>
            <PageIntro title="Writing Lab" subtitle="Free: submit essays for basic feedback. Pro: full AI band scores and detailed comments." />
            <div className="grid gap-[18px] xl:grid-cols-[1fr_320px]">
                <div>
                    <SectionTitle>Practice Prompt - Task 2</SectionTitle>
                    <div className="mb-3.5 rounded-xl border border-black/10 bg-gray-100 p-[18px]">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">Argumentative essay</p>
                        <p className="text-[13px] leading-7 text-gray-600">Some people believe that social media has a negative impact on society. Others think it has made the world better. Discuss both views and give your own opinion.</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {["250+ words", "40 minutes", "Both sides"].map((tag) => <span key={tag} className="rounded-md bg-gray-200 px-2 py-1 text-[11px] text-gray-500">{tag}</span>)}
                        </div>
                    </div>
                    <textarea
                        value={essay}
                        onChange={(event) => setEssay(event.target.value)}
                        placeholder="Start writing your essay here..."
                        className="min-h-40 w-full resize-y rounded-[10px] border border-black/10 bg-gray-100 p-3.5 text-[13.5px] leading-7 text-gray-900 outline-none transition focus:border-red-500"
                    />
                    <div className="mb-3.5 mt-2 flex items-center justify-between">
                        <span className={`text-xs ${wordsCount >= 250 ? "text-emerald-600" : wordsCount > 150 ? "text-amber-600" : "text-gray-400"}`}>Words: {wordsCount} / 250 minimum{wordsCount >= 250 ? " complete" : ""}</span>
                        <Button variant="outline" className="px-3 py-1.5 text-xs">New Prompt</Button>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setShowFeedback(wordsCount >= 10)}>
                        <Send size={14} /> Submit for Basic Check
                    </Button>
                    {wordsCount < 10 ? <p className="mt-2 text-[11px] text-gray-400">Write at least a few sentences before submitting.</p> : null}
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
                </div>
            </div>
        </div>
    );
}

function PracticePage({ onNavigate }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <div>
            <PageIntro title="Free Practice" subtitle="Practice individual skills without time pressure." />
            <div className="grid gap-3 md:grid-cols-2">
                {practiceCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="cursor-pointer" onClick={() => card.page && onNavigate(card.page)}>
                            <div className="mb-3 flex items-center gap-3">
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[card.color]}`}>
                                    <Icon size={18} />
                                </span>
                                <span>
                                    <h3 className="font-['Sora',sans-serif] text-[13.5px] font-bold text-gray-950">{card.title}</h3>
                                    <p className="text-[11.5px] text-gray-400">{card.subtitle}</p>
                                </span>
                            </div>
                            <p className="mb-3 text-[12.5px] leading-6 text-gray-600">{card.body}</p>
                            <Button variant="outline" className="w-full px-3 py-2 text-xs">Start Practice</Button>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

function SpeakingPage({ onUpgrade }) {
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
                <LockedOverlay
                    title="AI Speaking Lab"
                    description="Record your speaking responses and get feedback on fluency, pronunciation, vocabulary, grammar, and band score."
                    features={["Fluency", "Pronunciation", "Vocabulary", "Grammar", "Band Score"]}
                    onUpgrade={onUpgrade}
                />
            </div>
        </div>
    );
}

function ResourcesPage({ onUpgrade }) {
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

function VocabularyPage({ onUpgrade }) {
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

function AnalyticsPage({ onUpgrade }) {
    return (
        <div>
            <PageIntro title="My Analytics" subtitle="Track progress over time. Detailed analytics are available with Pro." />
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ["Latest Band", "-"], ["Tests Taken", "0"], ["Total Study", "38h"], ["Day Streak", "14"],
                ].map(([label, value]) => <Card key={label}><div className="font-['Sora',sans-serif] text-2xl font-bold text-red-600">{value}</div><p className="text-xs text-gray-400">{label}</p></Card>)}
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

function BlogPage({ onUpgrade }) {
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

function PricingPage({ onUpgrade }) {
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
                {[
                    ["Starter Pack", "3 full mock tests", "299"],
                    ["Advanced Pack", "10 full mock tests", "799"],
                    ["Writing Evaluation", "5 expert writing reviews", "499"],
                ].map(([name, desc, price]) => (
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

function ResultsPage({ onNavigate, onUpgrade }) {
    return (
        <div>
            <PageIntro title="My Results" subtitle="Your test history will appear here after you complete a mock test." />
            <Card className="py-14 text-center">
                <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] bg-red-50 text-red-600"><FileText size={28} /></span>
                <h3 className="font-['Sora',sans-serif] text-base font-bold text-gray-950">No tests completed yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-gray-400">Take your first free mock test to see band scores, section breakdown, and detailed review here.</p>
                <Button className="mt-5" onClick={() => onNavigate("mock-tests")}>Start a Mock Test</Button>
                <p className="mt-4 text-xs text-gray-400">You have 3 free tests remaining this month.</p>
            </Card>
            <Card className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="text-[13px] font-bold">Download Score Report</h3><p className="text-xs text-gray-400">PDF report for universities and applications. Pro feature.</p></div>
                <Button variant="amber" className="px-3 py-2 text-xs" onClick={onUpgrade}><Lock size={13} /> Unlock PDF</Button>
            </Card>
        </div>
    );
}

function SettingsPage() {
    return (
        <div>
            <PageIntro title="Settings" subtitle="Manage your account preferences." />
            <Card className="max-w-xl">
                <p className="mb-3 text-[10.5px] font-black uppercase tracking-[0.14em] text-gray-400">Notifications</p>
                {["Daily practice reminder", "New test available", "Exam countdown alerts"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between border-b border-black/10 py-3 last:border-b-0">
                        <div><h3 className="text-[13px] font-bold text-gray-950">{item}</h3><p className="text-[11.5px] text-gray-400">{index === 0 ? "Reminded at 8:00 PM every day" : "Keep me updated"}</p></div>
                        <span className={`relative h-[22px] w-10 rounded-full ${index < 2 ? "bg-red-600" : "bg-gray-200"}`}><span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition ${index < 2 ? "left-[21px]" : "left-[3px]"}`} /></span>
                    </div>
                ))}
            </Card>
        </div>
    );
}

export default function StudentPage() {
    const { user } = useSelector((state) => state.auth);
    const { activePage, navigate, openUpgrade } = useStudentShell();

    const userName = user?.name || "Rahim Hossain";
    const props = { onUpgrade: openUpgrade, onNavigate: navigate };

    switch (activePage) {
        case "mock-tests":
            return <MockTestsPage {...props} />;
        case "practice":
            return <PracticePage onNavigate={navigate} />;
        case "speaking":
            return <SpeakingPage onUpgrade={openUpgrade} />;
        case "writing":
            return <WritingPage onUpgrade={openUpgrade} />;
        case "resources":
            return <ResourcesPage onUpgrade={openUpgrade} />;
        case "vocabulary":
            return <VocabularyPage onUpgrade={openUpgrade} />;
        case "blog":
            return <BlogPage onUpgrade={openUpgrade} />;
        case "analytics":
            return <AnalyticsPage onUpgrade={openUpgrade} />;
        case "pricing":
            return <PricingPage onUpgrade={openUpgrade} />;
        case "results":
            return <ResultsPage {...props} />;
        case "settings":
            return <SettingsPage />;
        default:
            return <DashboardPage userName={userName} {...props} />;
    }
}
