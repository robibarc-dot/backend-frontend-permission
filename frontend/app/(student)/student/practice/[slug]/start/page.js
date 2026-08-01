'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock,
    FileQuestion,
    Headphones,
    Image as ImageIcon,
    List,
    Loader2,
    Send,
} from 'lucide-react';
import {
    useStartPracticeTestMutation,
    useSubmitPracticeTestMutation,
} from '@/redux/features/practice-test/frontend/practiceTestApis';
import QuestionRenderer from '@/app/components/dashboard/common/QuestionRenderer';

function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

function formatTime(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function ContextPanel({ contexts }) {
    if (!contexts?.length) return null;

    const context = contexts[0];
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
                    <img
                        src={context.image}
                        alt="Question context"
                        className="max-h-[360px] w-full rounded-lg object-contain"
                    />
                </div>
            ) : null}

            {context.passage_text ? (
                <div
                    className="prose prose-sm max-w-none leading-7 text-slate-600 dark:prose-invert dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: context.passage_text }}
                />
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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {testDetails.title}
                        </h1>
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
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {resultData.total_questions}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-xs font-bold uppercase text-slate-400">Correct</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {resultData.correct_answers}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-xs font-bold uppercase text-slate-400">Submitted</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {resultData.submitted_at
                            ? new Date(resultData.submitted_at).toLocaleString()
                            : 'Just now'}
                    </p>
                </div>
            </div>

            {resultData.module_scores?.length ? (
                <section className="rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                        Module Scores
                    </h2>
                    <div className="space-y-3">
                        {resultData.module_scores.map((moduleScore) => (
                            <div
                                key={moduleScore.module}
                                className="rounded-lg border border-slate-100 p-3 dark:border-slate-700"
                            >
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        {moduleScore.module}
                                    </span>
                                    <span className="font-bold text-rose-500">
                                        {moduleScore.percentage}%
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-rose-500"
                                        style={{
                                            width: `${Math.min(moduleScore.percentage, 100)}%`,
                                        }}
                                    />
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

/**
 * Build question list with group context for flat rendering
 */
function buildFlatQuestionList(sections) {
    const list = [];
    for (const section of sections) {
        for (const group of (section.question_groups || [])) {
            for (const question of (group.questions || [])) {
                list.push({
                    ...question,
                    _sectionId: section.id,
                    _sectionTitle: section.title || section.module?.title || '',
                    _sectionModule: section.module?.title,
                    _groupId: group.id,
                    _groupTitle: group.title,
                    _groupInstruction: group.instruction,
                    _groupQuestionType: group.question_type,
                });
            }
        }
    }
    return list;
}

export default function PracticeTestStartPage({ params }) {
    const { slug: identifier } = use(params);
    const searchParams = useSearchParams();
    const sectionId = searchParams.get('section_id') || '';

    const [startPracticeTest, { isLoading: isStarting }] =
        useStartPracticeTestMutation();
    const [submitPracticeTest, { isLoading: isSubmitting }] =
        useSubmitPracticeTestMutation();

    const [testData, setTestData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [resultData, setResultData] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [initError, setInitError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [focusedQuestionId, setFocusedQuestionId] = useState(null);

    // Initialize test on mount using the start endpoint
    useEffect(() => {
        if (!identifier) return;

        let cancelled = false;

        async function initTest() {
            try {
                const response = await startPracticeTest({
                    identifier,
                    section_id: sectionId || undefined,
                }).unwrap();

                if (cancelled) return;

                const payload = response.data;
                setTestData(payload.test);
                if (payload.attempt?.duration_mins) {
                    setTimeLeft(payload.attempt.duration_mins * 60);
                }
            } catch (err) {
                if (cancelled) return;
                setInitError(
                    err?.data?.message || 'Unable to start practice test. Please try again.'
                );
            }
        }

        initTest();

        return () => {
            cancelled = true;
        };
    }, [identifier, sectionId, startPracticeTest]);

    const sections = useMemo(() => testData?.sections || [], [testData]);
    const activeSection = sections[activeSectionIndex] || null;

    // Build flat question list from all sections
    const flatQuestions = useMemo(() => buildFlatQuestionList(sections), [sections]);

    // Build a flat list of all question IDs for answer tracking
    const allQuestionIds = useMemo(() => {
        return flatQuestions.map((q) => q.id);
    }, [flatQuestions]);

    // Total questions count
    const totalQuestions = allQuestionIds.length;

    // Helper to check if a cell is blank (needed for table completion focus handling)
    const isBlankCell = useCallback((cell) => {
        if (!cell) return true;
        if (typeof cell === 'object') {
            return cell.isBlank === true || (cell.text === null || cell.text === undefined || cell.text === '');
        }
        return false;
    }, []);

    // Helper to find global index of a question by id
    const getGlobalQuestionIndex = useCallback(
        (questionId) => allQuestionIds.indexOf(questionId),
        [allQuestionIds]
    );

    // If section_id is provided, pre-select that section
    useEffect(() => {
        if (sectionId && sections.length > 0) {
            const idx = sections.findIndex(
                (s) => String(s.id) === String(sectionId)
            );
            if (idx !== -1) {
                setActiveSectionIndex(idx);
            }
        }
    }, [sectionId, sections]);

    // Handle answer change from QuestionRenderer
    const handleAnswer = useCallback(
        (questionId, answer) => {
            setAnswers((current) => ({
                ...current,
                [questionId]: answer,
            }));
        },
        []
    );

    // Handle focus change from QuestionRenderer
    const handleFocusChange = useCallback(
        (questionIdOrBlankNumber) => {
            // Check if it's a blank number (just a number) from table completion
            const isBlankNumber = typeof questionIdOrBlankNumber === 'number';
            
            if (isBlankNumber) {
                // For table completion, find the question ID by blank number
                // The blank number corresponds to the sequential order of questions in the table
                let blankCount = 0;
                let foundQuestionId = null;
                
                sections.forEach((section) => {
                    (section.question_groups || []).forEach((group) => {
                        if (group.question_type?.slug === 'table_completion') {
                            const questions = group.questions || [];
                            // Iterate through questions in order - each question corresponds to a blank
                            questions.forEach((q, idx) => {
                                blankCount++;
                                if (blankCount === questionIdOrBlankNumber) {
                                    foundQuestionId = q.id;
                                }
                            });
                        }
                    });
                });
                
                if (foundQuestionId) {
                    setFocusedQuestionId(foundQuestionId);
                    const globalIndex = getGlobalQuestionIndex(foundQuestionId);
                    if (globalIndex !== -1) {
                        setActiveQuestionIndex(globalIndex);
                    }
                }
            } else {
                // Regular question ID
                setFocusedQuestionId(questionIdOrBlankNumber);
                const globalIndex = getGlobalQuestionIndex(questionIdOrBlankNumber);
                if (globalIndex !== -1) {
                    setActiveQuestionIndex(globalIndex);
                }
            }
        },
        [getGlobalQuestionIndex, sections]
    );

    const submitAnswers = useCallback(async () => {
        setSubmitError('');

        const payload = allQuestionIds.map((questionId) => ({
            question_id: questionId,
            answer: answers[questionId] ?? '',
        }));

        try {
            const response = await submitPracticeTest({
                identifier,
                section_id: sectionId || undefined,
                answers: payload,
            }).unwrap();
            setResultData(response.data);
        } catch (requestError) {
            setSubmitError(
                requestError?.data?.message ||
                    'Unable to submit this practice test. Please try again.'
            );
        }
    }, [answers, allQuestionIds, identifier, sectionId, submitPracticeTest]);

    // Timer effect
    useEffect(() => {
        if (isSubmitting || allQuestionIds.length === 0 || timeLeft <= 0 || resultData) {
            return undefined;
        }
        const timer = setInterval(
            () => setTimeLeft((current) => current - 1),
            1000
        );
        return () => clearInterval(timer);
    }, [allQuestionIds.length, isSubmitting, timeLeft, resultData]);

    // Auto-submit when timer reaches 0
    useEffect(() => {
        if (
            timeLeft === 0 &&
            allQuestionIds.length > 0 &&
            !isSubmitting &&
            !resultData
        ) {
            submitAnswers();
        }
    }, [allQuestionIds.length, isSubmitting, submitAnswers, timeLeft, resultData]);

    // Scroll to a question by its index using DOM element id
    const scrollToQuestion = useCallback((index) => {
        setActiveQuestionIndex(index);
        const questionId = flatQuestions[index]?.id;
        if (questionId) {
            const target = document.getElementById(`question-${questionId}`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Try to focus the first input in the question
                setTimeout(() => {
                    const firstInput = target.querySelector('input[type="text"]');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 100);
            }
        }
    }, [flatQuestions]);

    // Loading state
    if (isStarting) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-rose-500" />
                    <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Preparing your test...
                    </p>
                </div>
            </div>
        );
    }

    // Init error
    if (initError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-10 dark:bg-slate-950">
                <p className="text-lg font-bold text-rose-500">{initError}</p>
                <Link
                    href="/student/practice"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 underline"
                >
                    <ArrowLeft size={16} />
                    Back to Practice
                </Link>
            </div>
        );
    }

    // Show result after submission
    if (resultData) {
        return <ResultView testDetails={testData} resultData={resultData} />;
    }

    // No test data loaded yet
    if (!testData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
            </div>
        );
    }

    // Calculate answered count - check both individual answers and table completion data
    const answeredCount = allQuestionIds.filter((qId) => {
        const val = answers[qId];
        if (val !== undefined && val !== null && val !== '') {
            return true;
        }
        // For table completion, only the first question in the group has the table data
        // Check if this question ID has table data with answers
        const tableData = answers[qId];
        if (tableData && typeof tableData === 'object' && !Array.isArray(tableData)) {
            // This question has table data - check if any cell has an answer
            const hasAnswer = Object.values(tableData).some(cellValue => cellValue && cellValue !== '');
            return hasAnswer;
        }
        return false;
    }).length;

    return (
        <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
            {/* Sticky header with timer and controls */}
            <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {testData.title}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {answeredCount} of {totalQuestions} answered
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                                <Clock size={16} />
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Section navigation tabs */}
                    {sections.length > 1 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {sections.map((section, idx) => (
                                <button
                                    key={section.id || idx}
                                    type="button"
                                    onClick={() => setActiveSectionIndex(idx)}
                                    className={cx(
                                        'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition',
                                        idx === activeSectionIndex
                                            ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                                    )}
                                >
                                    <BookOpen size={14} />
                                    <span className="truncate max-w-[120px]">
                                        {section.title || section.module?.title || `Section ${idx + 1}`}
                                    </span>
                                    <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-800">
                                        {section.total_questions || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto pb-4">
                <div className="mx-auto max-w-6xl p-4 md:p-6">
                    {submitError ? (
                        <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                            {submitError}
                        </div>
                    ) : null}

                    {/* No questions state */}
                    {totalQuestions === 0 ? (
                        <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                            <FileQuestion
                                className="mx-auto mb-3 text-slate-300"
                                size={36}
                            />
                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                                No questions found for this test.
                            </p>
                        </div>
                    ) : null}

                    {/* Render all sections with their question groups */}
                    {sections.length > 0 && (
                        <div className="space-y-8">
                            {sections.map((section, sIdx) => {
                                if (sIdx !== activeSectionIndex && sections.length > 1) return null;

                                return (
                                    <div key={section.id || sIdx} className="space-y-6">
                                        {/* Section header */}
                                        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wide text-rose-500">
                                                        {section.module?.title || 'Practice'} Section
                                                    </p>
                                                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                                                        {section.title || section.module?.title || `Section ${sIdx + 1}`}
                                                    </h2>
                                                </div>
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    <List size={14} />
                                                    {section.total_questions} question{section.total_questions === 1 ? '' : 's'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Context panel for the section */}
                                        {(section.contexts?.length > 0) && (
                                            <ContextPanel contexts={section.contexts} />
                                        )}

                                        {/* Render each question group */}
                                        {(section.question_groups || []).map((group, gIdx) => (
                                            <div key={group.id || gIdx} id={`group-${sIdx}-${gIdx}`}>
                                                <QuestionRenderer
                                                    key={`${sIdx}-${gIdx}`}
                                                    questionGroup={group}
                                                    sectionModule={section.module?.title}
                                                    value={answers}
                                                    onChange={handleAnswer}
                                                    onFocusChange={handleFocusChange}
                                                    disabled={isSubmitting}
                                                    globalQuestionIndex={getGlobalQuestionIndex}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed bottom bar with question navigator and submit */}
            <div className="border-t border-slate-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex justify-between mx-auto max-w-6xl px-4 py-3 md:px-6">
                    {/* Question number pagination */}
                    {totalQuestions > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                            {flatQuestions.map((q, idx) => {
                                // Check if this question is answered
                                const isAnswered = (() => {
                                    const val = answers[q.id];
                                    if (val !== undefined && val !== null && val !== '') {
                                        return true;
                                    }
                                    // For table completion, check if this specific question ID has table data
                                    const tableData = answers[q.id];
                                    if (tableData && typeof tableData === 'object' && !Array.isArray(tableData)) {
                                        // This question has table data - check if any cell has an answer
                                        const hasAnswer = Object.values(tableData).some(cellValue => cellValue && cellValue !== '');
                                        return hasAnswer;
                                    }
                                    return false;
                                })();
                                
                                const isActive = idx === activeQuestionIndex;

                                return (
                                    <button
                                        key={q.id}
                                        type="button"
                                        onClick={() => scrollToQuestion(idx)}
                                        className={cx(
                                            'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all',
                                            isActive
                                                ? 'ring-2 ring-rose-500 ring-offset-1'
                                                : '',
                                            isAnswered
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                        )}
                                        title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Submit button */}
                    {totalQuestions > 0 && (
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={submitAnswers}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                                Submit Test
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}