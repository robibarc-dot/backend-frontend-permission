'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock,
    FileQuestion,
    Headphones,
    Loader2,
    PenLine,
} from 'lucide-react';
import {
    useGetPracticeTestQuery,
    useStartPracticeTestMutation,
} from '@/redux/features/practice-test/frontend/practiceTestApis';

function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

function formatLabel(value, fallback = 'General') {
    if (!value) return fallback;
    return String(value)
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function PracticeTestDetailPage() {
    const { slug: identifier } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectionId = searchParams.get('section_id') || '';
    const [startError, setStartError] = useState('');

    const { data, isLoading, error } = useGetPracticeTestQuery(identifier, {
        skip: !identifier,
    });
    const [startPracticeTest, { isLoading: isStarting }] = useStartPracticeTestMutation();

    const testDetails = data?.data;
    const sectionCount = testDetails?.sections?.length || 0;
    const selectedSection = useMemo(() => {
        if (!testDetails?.sections?.length) return null;

        return testDetails.sections.find((section) => String(section.id) === String(sectionId)) || null;
    }, [sectionId, testDetails?.sections]);
    const startLabel = selectedSection ? `Start ${selectedSection.title || selectedSection.module?.title || 'Section'}` : 'Start Practice Test';

    async function handleStartTest() {
        setStartError('');

        try {
            await startPracticeTest({ identifier, section_id: sectionId || undefined }).unwrap();
            
            const startUrl = `/student/practice/${identifier}/start${sectionId ? `?section_id=${sectionId}` : ''}`;
            router.push(startUrl);
        } catch (requestError) {
            setStartError(requestError?.data?.message || 'Unable to start this practice test. Please try again.');
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[360px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            </div>
        );
    }

    if (error || !testDetails) {
        return (
            <div className="mx-auto max-w-5xl rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                Practice test not found.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl p-4 md:p-6">
            <div className="space-y-5">
                <Link
                    href="/student/practice"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                >
                    <ArrowLeft size={16} />
                    Back to Practice
                </Link>

                <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase text-rose-500 dark:bg-rose-900/20">
                        <PenLine size={14} />
                        Practice Test
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{testDetails.title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Start when you are ready. Your answers will be scored immediately after submission.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                            <Clock className="mb-2 text-rose-500" size={20} />
                            <p className="text-xs font-bold uppercase text-slate-400">Duration</p>
                            <p className="font-bold text-slate-800 dark:text-white">{testDetails.duration_mins} minutes</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                            <FileQuestion className="mb-2 text-rose-500" size={20} />
                            <p className="text-xs font-bold uppercase text-slate-400">Questions</p>
                            <p className="font-bold text-slate-800 dark:text-white">{testDetails.total_questions}</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                            <BookOpen className="mb-2 text-rose-500" size={20} />
                            <p className="text-xs font-bold uppercase text-slate-400">Sections</p>
                            <p className="font-bold text-slate-800 dark:text-white">{sectionCount || formatLabel(testDetails.category)}</p>
                        </div>
                    </div>

                    {testDetails.sections?.length ? (
                        <div className="mt-6 rounded-xl border border-slate-100 p-4 dark:border-slate-700">
                            <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Start Section Wise</p>
                            <div className="grid gap-3 md:grid-cols-2">
                                {testDetails.sections.map((section) => (
                                    <Link
                                        key={section.module?.id || section.module?.title}
                                        href={`/student/practice/${testDetails.slug || testDetails.id}?section_id=${section.id}`}
                                        className={cx(
                                            'rounded-lg border p-3 transition hover:border-rose-200 hover:bg-rose-50 dark:hover:border-rose-900/40 dark:hover:bg-rose-900/20',
                                            String(section.id) === String(sectionId)
                                                ? 'border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/20'
                                                : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                                        )}
                                    >
                                        <p className="font-bold text-slate-800 dark:text-white">{section.title || section.module?.title || 'Practice'}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            {section.module?.title || 'General'} / {section.total_questions || section.questions?.length || 0} questions
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {startError ? (
                        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                            {startError}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleStartTest}
                        disabled={isStarting || testDetails.total_questions === 0}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                    >
                        {isStarting ? <Loader2 size={17} className="animate-spin" /> : <PenLine size={17} />}
                        {isStarting ? 'Starting...' : startLabel}
                    </button>
                </section>
            </div>
        </div>
    );
}
