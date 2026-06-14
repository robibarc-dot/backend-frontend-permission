'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    ArrowUpDown,
    BookOpen,
    ChevronDown,
    Clock,
    FileText,
    Headphones,
    Mic,
    Loader2,
    PenLine,
    PlayCircle,
    Search,
    Users,
    Zap,
} from 'lucide-react';
import { useGetPracticeTestsQuery } from '@/redux/features/practice-test/frontend/practiceTestApis';

const practiceTabs = [
    {
        key: 'listening',
        label: 'Listening',
        Icon: Headphones,
        keywords: ['listening'],
    },
    {
        key: 'reading',
        label: 'Reading',
        Icon: BookOpen,
        keywords: ['reading'],
    },
    {
        key: 'writing',
        label: 'Writing',
        Icon: PenLine,
        keywords: ['writing'],
    },
    {
        key: 'speaking',
        label: 'Speaking',
        Icon: Mic,
        keywords: ['speaking'],
    },
];

function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

function normalize(value) {
    return String(value || '').toLowerCase();
}

function collectSearchText(value) {
    if (!value) return '';

    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(collectSearchText).join(' ');
    }

    if (typeof value === 'object') {
        return Object.entries(value)
            .filter(([key]) => !['created_at', 'updated_at'].includes(key))
            .map(([, item]) => collectSearchText(item))
            .join(' ');
    }

    return '';
}

function getPracticeTests(data) {
    const payload = data?.data;

    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return [];
}

function matchesTab(test, tab) {
    const searchable = normalize(collectSearchText(test));
    return tab.keywords.some((keyword) => searchable.includes(keyword));
}

function formatLabel(value, fallback = 'General') {
    if (!value) return fallback;
    return String(value)
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDifficulty(test) {
    const text = normalize(collectSearchText(test));

    if (text.includes('hard') || text.includes('advanced')) return 'Hard';
    if (text.includes('easy') || text.includes('beginner')) return 'Easy';

    return 'Medium';
}

function getSectionKey(section, test) {
    return section?.id || `${test.id || test.slug}-${section?.module?.id || section?.title || 'general'}`;
}

function getSectionHref(test, section) {
    const baseHref = `/student/practice/${test.slug || test.id}`;

    return section?.id ? `${baseHref}?section_id=${section.id}` : baseHref;
}

function normalizeSection(test) {
    const fallbackModule = test.modules?.[0] || test.question_modules?.[0] || null;

    return {
        id: null,
        title: fallbackModule?.title || formatLabel(test.category, 'Practice'),
        module: fallbackModule,
        total_questions: test.practice_test_questions_count || test.total_questions || 0,
    };
}

function getTestSections(test) {
    return Array.isArray(test.sections) && test.sections.length ? test.sections : [normalizeSection(test)];
}

function buildModuleGroups(tests) {
    const groupMap = new Map();

    tests.forEach((test) => {
        getTestSections(test).forEach((section) => {
            const moduleTitle = section?.module?.title || section?.title || formatLabel(test.category, 'General');
            const moduleId = section?.module?.id || moduleTitle;

            if (!groupMap.has(moduleId)) {
                groupMap.set(moduleId, {
                    id: moduleId,
                    title: moduleTitle,
                    sections: [],
                });
            }

            groupMap.get(moduleId).sections.push({ test, section });
        });
    });

    return Array.from(groupMap.values());
}

function SectionRow({ test, section, index }) {
    const duration = test.duration_mins || test.duration;
    const questionCount = section.total_questions || test.practice_test_questions_count || test.total_questions;
    const accessLabel = test.type === 'paid' ? 'Pro Access' : 'Free Scoring';
    const accessClass = test.type === 'paid'
        ? 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400'
        : 'border-blue-100 bg-blue-50 text-blue-500 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400';

    return (
        <Link
            href={getSectionHref(test, section)}
            className="group flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-md lg:flex-row lg:items-center lg:justify-between dark:border-slate-700 dark:bg-slate-800 dark:hover:border-rose-900/50"
        >
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm font-semibold text-slate-400 dark:bg-slate-700 dark:text-slate-200">
                    {index + 1}
                </span>
                <div className="min-w-0">
                    <span className="block truncate text-base font-medium text-slate-800 dark:text-white group-hover:text-rose-500">
                        {test.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {section.title || section.module?.title || 'Practice Section'}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[15px] text-slate-500 lg:justify-end dark:text-slate-400">
                <span className={cx('rounded-md border px-2.5 py-1 text-xs font-medium', accessClass)}>
                    {accessLabel}
                </span>

                <span className="hidden h-6 w-px bg-slate-100 lg:block dark:bg-slate-700" />

                <span className="flex items-center gap-1">
                    <Zap size={16} className="text-slate-400 dark:text-slate-500" />
                    <span>{getDifficulty(test)}</span>
                </span>

                <span className="hidden h-6 w-px bg-slate-100 lg:block dark:bg-slate-700" />

                <span className="flex items-center gap-1">
                    <Users size={16} className="text-slate-400 dark:text-slate-500" />
                    <span>{questionCount ? `${questionCount} questions` : formatLabel(test.category)}</span>
                </span>

                <span className="hidden h-6 w-px bg-slate-100 lg:block dark:bg-slate-700" />

                <span className="flex items-center gap-1">
                    <Clock size={16} className="text-slate-400 dark:text-slate-500" />
                    <span>{duration ? `${duration} min` : 'Practice'}</span>
                </span>

                <span
                    role="button"
                    tabIndex={-1}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg p-1 text-sm font-bold text-rose-500 transition-colors group-hover:text-rose-600 lg:ml-0"
                    onClick={(event) => event.preventDefault()}
                >
                    <PlayCircle size={18} />
                    Start
                </span>
            </div>
        </Link>
    );
}

export default function PracticeTestsPage() {
    const [activeTab, setActiveTab] = useState(practiceTabs[0].key);
    const [searchTerm, setSearchTerm] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const { data, error, isLoading } = useGetPracticeTestsQuery();

    const practiceTests = useMemo(() => getPracticeTests(data), [data]);

    // console.log('Fetched practice tests:', practiceTests);
    const questionTypeOptions = useMemo(() => {
        const optionMap = new Map();

        practiceTests.forEach((test) => {
            (test.question_types || []).forEach((type) => {
                if (type?.slug && !optionMap.has(type.slug)) {
                    optionMap.set(type.slug, type.name || formatLabel(type.slug));
                }
            });
        });

        return Array.from(optionMap, ([value, label]) => ({ value, label }));
    }, [practiceTests]);
    const activeTabConfig = practiceTabs.find((tab) => tab.key === activeTab) || practiceTabs[0];
    const ActiveIcon = activeTabConfig.Icon;
    const hasSkillMatches = practiceTests.some((test) => practiceTabs.some((tab) => matchesTab(test, tab)));

    const visibleTests = practiceTests
        .filter((test) => {
            const tabMatches = hasSkillMatches ? matchesTab(test, activeTabConfig) : true;
            const searchable = normalize(collectSearchText(test));
            const searchMatches = searchable.includes(normalize(searchTerm));
            const typeMatches = questionType ? searchable.includes(questionType) : true;

            return tabMatches && searchMatches && typeMatches;
        })
        .sort((left, right) => {
            if (sortOrder === 'title') {
                return String(left.title || '').localeCompare(String(right.title || ''));
            }

            if (sortOrder === 'duration') {
                return (left.duration_mins || left.duration || 0) - (right.duration_mins || right.duration || 0);
            }

            return 0;
        });
    const moduleGroups = buildModuleGroups(visibleTests);

    if (isLoading) {
        return (
            <div className="flex h-[360px] flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                <p className="text-sm font-semibold">Loading practice tests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
                Error loading practice tests: {error.message || 'Unknown error'}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl bg-white p-4 text-slate-700 antialiased md:p-6 dark:bg-slate-900 dark:text-slate-200">
            <div className="overflow-x-auto border-b border-slate-100 pb-px [scrollbar-width:none] dark:border-slate-800">
                <div className="flex min-w-max items-center gap-8">
                    {practiceTabs.map((tab) => {
                        const Icon = tab.Icon;
                        const isActive = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={cx(
                                    'flex items-center gap-2 border-b-2 px-1 pb-4 text-lg transition-colors',
                                    isActive
                                        ? 'border-rose-500 font-semibold text-rose-500'
                                        : 'border-transparent font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                )}
                            >
                                <Icon size={20} className={isActive ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={20} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by title"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[15px] text-slate-600 outline-none transition-all placeholder:text-slate-400 focus:border-rose-300 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-rose-500 dark:focus:bg-slate-900"
                    />
                </div>

                <div className="relative min-w-[200px]">
                    <select
                        value={questionType}
                        onChange={(event) => setQuestionType(event.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-[15px] font-medium text-slate-500 outline-none transition-all focus:border-rose-300 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:focus:border-rose-500 dark:focus:bg-slate-900"
                    >
                        <option value="">Question Type</option>
                        {(questionTypeOptions.length
                            ? questionTypeOptions
                            : [
                                  { value: 'multiple', label: 'Multiple Choice' },
                                  { value: 'true', label: 'True / False' },
                                  { value: 'fill', label: 'Fill in Blank' },
                                  { value: 'essay', label: 'Essay' },
                              ]
                        ).map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="relative min-w-[120px]">
                    <select
                        aria-label="Sort practice tests"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-[15px] font-medium text-slate-500 outline-none transition-all hover:bg-slate-100 focus:border-rose-300 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:focus:border-rose-500 dark:focus:bg-slate-900"
                    >
                        <option value="latest">Sort</option>
                        <option value="title">Title</option>
                        <option value="duration">Duration</option>
                    </select>
                    <ArrowUpDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                </div>
            </div> */}

            {moduleGroups.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900 mt-4">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-900/20">
                        <ActiveIcon size={22} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No question sets found</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                        There are no {activeTabConfig.label.toLowerCase()} practice sets matching your filters right now.
                    </p>
                </div>
            ) : (
                <div className="space-y-7 mt-4">
                    {moduleGroups.map((group) => (
                        <section key={group.id} className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{group.title}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {group.sections.length} section{group.sections.length === 1 ? '' : 's'} available
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {group.sections.map(({ test, section }, index) => (
                                    <SectionRow
                                        key={getSectionKey(section, test)}
                                        test={test}
                                        section={section}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
