"use client";

import { BarChart3, Check, Clock, FileText, Flame, Info, Lock, Zap } from "lucide-react";
import { Button, Card, PageIntro, SectionTitle } from "./shared";

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

export default function DashboardPage({ userName, onNavigate, onUpgrade }) {
    return (
        <div>
            <PageIntro title={`Welcome back, ${userName}`} subtitle="Your IELTS exam is in 23 days. You are on the Free Plan, with unlimited practice available in Pro." />

            <button type="button" onClick={onUpgrade} className="mb-5 flex w-full items-center gap-3.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-4 text-left transition hover:border-amber-300">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Zap size={18} /></span>
                <span className="min-w-0 flex-1">
                    <strong className="block text-[13px] text-amber-700">You have used 0 of 3 free mock tests</strong>
                    <span className="block text-xs text-amber-700/70">Start your first mock test now, or upgrade for unlimited tests and AI feedback.</span>
                </span>
                <span className="hidden rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white sm:inline-flex">Upgrade</span>
            </button>

            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
                <Info size={16} className="mt-0.5 shrink-0 text-red-600" />
                <p className="text-[12.5px] leading-6 text-gray-600"><strong className="text-red-600">Today's tip:</strong> Writing Task 2 carries most of your writing score. Practice daily argumentative essays for the fastest improvement.</p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="p-4">
                            <div className={`mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-[9px] ${stat.bg} ${stat.iconColor}`}><Icon size={16} /></div>
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
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><FileText size={24} /></div>
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-['Sora',sans-serif] text-base font-bold text-gray-400">-</span><span className="text-[9.5px] text-gray-400">No data</span></div>
                        </div>
                        <p className="mb-4 text-xs text-gray-400">Target: <strong className="text-amber-600">7.5</strong></p>
                        <div className="space-y-3 text-left">
                            {modules.map((module) => (
                                <div key={module.name}>
                                    <div className="mb-1 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-600"><span className={`h-2 w-2 rounded-full ${module.color}`} />{module.name}</span><span className="font-bold text-gray-400">{module.score}</span></div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200"><div className={`h-full ${module.color}`} style={{ width: module.width }} /></div>
                                </div>
                            ))}
                        </div>
                        <Button className="mt-4 w-full px-3 py-2 text-xs" onClick={() => onNavigate("mock-tests")}>Take Your First Test</Button>
                    </Card>

                    <SectionTitle>Study Streak</SectionTitle>
                    <Card>
                        <div className="mb-3 flex items-center justify-between text-xs"><span className="font-semibold text-gray-700">14 days streak</span><span className="text-gray-400">Goal: 30 days</span></div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 28 }, (_, index) => {
                                const day = index + 1;
                                const isToday = day === 26;
                                const isDone = day >= 12 && day < 26;
                                return <span key={day} className={`flex aspect-square items-center justify-center rounded-md text-[9px] ${isToday ? "bg-red-600 font-bold text-white" : isDone ? "bg-red-50 font-bold text-red-600" : "bg-gray-100 text-gray-400"}`}>{day}</span>;
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
