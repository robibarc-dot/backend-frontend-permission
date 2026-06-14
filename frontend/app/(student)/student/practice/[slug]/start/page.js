'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileQuestion,
    Headphones,
    Image as ImageIcon,
    Loader2,
    Send,
} from 'lucide-react';
import {
    useGetPracticeTestQuery,
    useGetPracticeTestQuestionsQuery,
    useSubmitPracticeTestMutation,
} from '@/redux/features/practice-test/frontend/practiceTestApis';
import QuestionRenderer from '@/app/components/dashboard/common/QuestionRenderer';

function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

function formatLabel(value, fallback = 'General') {
    if (!value) return fallback;
    return String(value)
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function ContextPanel({ context }) {
    if (!context?.passage_text && !context?.audio && !context?.image) {
        return null;
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            {context.audio ? (
                <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Headphones size={16} className="text-rose-500" />
                        Listening Audio
                    </div>
                    <audio controls className="w-full" src={context.audio}>
                        <track kind="captions" />
                    </audio>
                </div>
            ) : null}

            {context.image ? (
                <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <ImageIcon size={16} className="text-rose-500" />
                        Reference Image
                    </div>
                    <img src={context.image} alt="Question context" className="max-h-[360px] w-full rounded-lg object-contain" />
                </div>
            ) : null}

            {context.passage_text ? (
                <div className="prose prose-sm max-w-none whitespace-pre-line leading-7 text-slate-600 dark:prose-invert dark:text-slate-300">
                    {context.passage_text}
                </div>
            ) : null}
        </div>
    );
}

function ResultView({ testDetails, resultData }) {
    const percentage = Number(resultData?.percentage || 0);

    return (
        <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
            <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/30 dark:bg-slate-900">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                            <CheckCircle2 size={15} />
                            Practice Submitted
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{testDetails.title}</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Submitted score summary and module breakdown.
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-4xl font-black text-rose-500">{percentage}%</p>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            {resultData.awarded_marks} / {resultData.total_marks} marks
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-xs font-bold uppercase text-slate-400">Questions</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{resultData.total_questions}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-xs font-bold uppercase text-slate-400">Correct</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{resultData.correct_answers}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-xs font-bold uppercase text-slate-400">Submitted</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {resultData.submitted_at ? new Date(resultData.submitted_at).toLocaleString() : 'Just now'}
                    </p>
                </div>
            </div>

            {resultData.module_scores?.length ? (
                <section className="rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Module Scores</h2>
                    <div className="space-y-3">
                        {resultData.module_scores.map((moduleScore) => (
                            <div key={moduleScore.module} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{moduleScore.module}</span>
                                    <span className="font-bold text-rose-500">{moduleScore.percentage}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.min(moduleScore.percentage, 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            <Link
                href="/student/practice"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
                <ArrowLeft size={16} />
                Back to Practice
            </Link>
        </div>
    );
}

export default function PracticeTestStartPage({ params }) {
    const { slug: identifier } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectionId = searchParams.get('section_id') || '';

    const { data: testData, isLoading: isTestLoading } = useGetPracticeTestQuery(identifier);
    const questionParams = useMemo(
        () => (sectionId ? { identifier, section_id: sectionId } : { identifier }),
        [identifier, sectionId]
    );
    const { data: questionData, isLoading: isQuestionsLoading, error } = useGetPracticeTestQuestionsQuery(questionParams);
    
    const [answers, setAnswers] = useState({});
    const [resultData, setResultData] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [submitPracticeTest, { isLoading: isSubmitting }] = useSubmitPracticeTestMutation();

    const testDetails = testData?.data;
    const assignments = useMemo(() => questionData?.data || [], [questionData]);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (testDetails?.duration_mins) {
            setTimeLeft(testDetails.duration_mins * 60);
        }
    }, [testDetails?.duration_mins]);

    const submitAnswers = useCallback(async () => {
        setSubmitError('');
        const payload = assignments.map((assignment) => ({
            question_id: assignment.question.id,
            answer: answers[assignment.question.id] ?? '',
        }));

        try {
            await submitPracticeTest({ identifier, section_id: sectionId || undefined, answers: payload }).unwrap();
            router.replace(`/student/practice/${identifier}/result`);
        } catch (requestError) {
            setSubmitError(requestError?.data?.message || 'Unable to submit this practice test. Please try again.');
        }
    }, [answers, assignments, identifier, sectionId, submitPracticeTest]);

    useEffect(() => {
        if (isQuestionsLoading || isSubmitting || assignments.length === 0 || timeLeft <= 0 || resultData) {
            return undefined;
        }
        const timer = setInterval(() => setTimeLeft((current) => current - 1), 1000);
        return () => clearInterval(timer);
    }, [assignments.length, isQuestionsLoading, isSubmitting, timeLeft, resultData]);

    useEffect(() => {
        if (timeLeft === 0 && assignments.length > 0 && !isSubmitting && !resultData) {
            submitAnswers();
        }
    }, [assignments.length, isSubmitting, submitAnswers, timeLeft, resultData]);

    if (isTestLoading || isQuestionsLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
            </div>
        );
    }

    if (resultData) {
        return <ResultView testDetails={testDetails} resultData={resultData} />;
    }

    if (error || !testDetails) {
        return (
            <div className="p-10 text-center">
                <p className="text-rose-500 font-bold">Failed to load test. Please return to the practice list.</p>
                <Link href="/student/practice" className="mt-4 inline-block text-blue-500 underline">Back</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <form
                className="mx-auto max-w-5xl space-y-5 p-4 md:p-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    submitAnswers();
                }}
            >
                <div className="sticky top-4 z-20 flex flex-col gap-3 rounded-xl border border-slate-100 bg-white/95 p-4 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900/95">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{testDetails.title}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {assignments.length} question{assignments.length === 1 ? '' : 's'} remaining
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                            <Clock size={16} />
                            {formatTime(timeLeft)}
                        </span>
                        <button
                            type="submit"
                            disabled={isSubmitting || assignments.length === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Submit Test
                        </button>
                    </div>
                </div>

                {submitError ? (
                    <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                        {submitError}
                    </div>
                ) : null}

                {assignments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                        <FileQuestion className="mx-auto mb-3 text-slate-300" size={36} />
                        <p className="font-semibold text-slate-700 dark:text-slate-200">No questions found.</p>
                    </div>
                ) : (
                    assignments.map((assignment, index) => {
                        const question = assignment.question;
                        return (
                            <section
                                key={assignment.assignment_id}
                                className="space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-rose-500">
                                            {assignment.module?.title || 'Practice'} / {formatLabel(question?.type_name || question?.type, 'Question')}
                                        </p>
                                        <h2 className="mt-2 text-base font-semibold leading-7 text-slate-800 dark:text-slate-100">
                                            <span className="mr-2 text-slate-400">{index + 1}.</span>
                                        </h2>
                                    </div>
                                    <span className="shrink-0 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {question.mark} mark{question.mark === 1 ? '' : 's'}
                                    </span>
                                </div>
                                <ContextPanel context={assignment.context} />
                                <QuestionRenderer
                                    question={question}
                                    value={answers[question.id]}
                                    disabled={isSubmitting}
                                    onChange={(answer) => {
                                        setAnswers((current) => ({
                                            ...current,
                                            [question.id]: answer,
                                        }));
                                    }}
                                />
                            </section>
                        );
                    })
                )}
            </form>
        </div>
    );
}