 'use client';

import React from 'react';
import Link from 'next/link';
import { 
    CheckCircle2, 
    XCircle, 
    ArrowLeft, 
    Clock, 
    FileQuestion, 
    BarChart3, 
    Calendar,
    Target
} from 'lucide-react';

/**
 * Helper to format answers for display (handles strings and arrays)
 */
function formatAnswer(answer) {
    if (!answer) return 'No answer provided';
    if (Array.isArray(answer)) {
        return answer.length > 0 ? answer.join(', ') : 'No answer provided';
    }
    return String(answer);
}

export default function PracticeTestResult({ testDetails = {}, resultData = {} }) {
    const percentage = Number(resultData?.percentage || 0);
    const results = Array.isArray(resultData?.results) ? resultData.results : [];
    const moduleScores = Array.isArray(resultData?.module_scores) ? resultData.module_scores : [];

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
            {/* Header Summary Card */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                            <CheckCircle2 size={14} />
                            Practice Completed
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
                            {testDetails.title || 'Practice Test Result'}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={15} />
                                {resultData.submitted_at ? new Date(resultData.submitted_at).toLocaleDateString() : 'Recent'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={15} />
                                {testDetails.duration_mins} mins allotted
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                        <div className="text-center">
                            <p className="text-4xl font-black text-rose-500">{percentage}%</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Score</p>
                        </div>
                        <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
                                {resultData.awarded_marks} <span className="text-sm font-medium text-slate-400">/ {resultData.total_marks}</span>
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Marks</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Quick Stats Grid */}
                <div className="space-y-4 md:col-span-1">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-2 flex items-center gap-2 text-rose-500">
                                <FileQuestion size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Questions</span>
                            </div>
                            <p className="text-2xl font-bold dark:text-white">{resultData.total_questions}</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-2 flex items-center gap-2 text-emerald-500">
                                <Target size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Correct</span>
                            </div>
                            <p className="text-2xl font-bold dark:text-white">{resultData.correct_answers}</p>
                        </div>
                    </div>

                    {/* Module Breakdown */}
                    {moduleScores.length > 0 && (
                        <div className="rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 size={18} className="text-slate-400" />
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Module Analysis</h2>
                            </div>
                            <div className="space-y-4">
                                {moduleScores.map((ms, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-slate-600 dark:text-slate-400">{ms.module}</span>
                                            <span className="text-rose-500">{ms.percentage}%</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div 
                                                className="h-full bg-rose-500 transition-all duration-500" 
                                                style={{ width: `${Math.min(ms.percentage, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Detailed Review Table */}
                <div className="md:col-span-2">
                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Question Review</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Detailed breakdown of your performance by question.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-5 py-3">#</th>
                                        <th className="px-5 py-3">Your Answer</th>
                                        <th className="px-5 py-3">Correct Answer</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {results.map((item, index) => (
                                        <tr key={item.question_id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-5 py-4 font-bold text-slate-400">{index + 1}</td>
                                            <td className="px-5 py-4">
                                                <span className={`font-medium ${item.is_correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {formatAnswer(item.submitted_answer)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">
                                                {formatAnswer(item.correct_answer)}
                                            </td>
                                            <td className="px-5 py-4">
                                                {item.is_correct ? (
                                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                                ) : (
                                                    <XCircle size={18} className="text-rose-500" />
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right font-bold text-slate-700 dark:text-slate-200">
                                                {item.awarded_mark} / {item.mark}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex pt-4">
                <Link
                    href="/student/practice"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
