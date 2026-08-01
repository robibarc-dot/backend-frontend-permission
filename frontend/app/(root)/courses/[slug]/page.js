"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Clock3,
    FileText,
    Layers3,
    Play,
    Star,
    Users,
    Video,
} from "lucide-react";
import { useGetFrontendCourseQuery } from "@/redux/features/course/frontend/courseApi";

const courseCatalog = {
    "spoken-english": {
        title: "Spoken English",
        subtitle: "Speak English with confidence through guided practice, live feedback, and real-world conversation tasks.",
        description:
            "Build practical English speaking skills from the ground up. This course helps learners improve vocabulary, sentence formation, pronunciation, listening, and fluency with structured lessons and regular evaluation.",
        category: "Language Learning",
        rating: 4.8,
        students: "12,000+",
        price: "$59",
        regularPrice: "$149",
        discountLabel: "60% OFF",
        duration: "12 months",
        levels: "3 levels",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900",
        bannerImage:
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
        tabs: ["Course Structure", "Course Details"],
        freeClass: {
            title: "Start your spoken English practice today",
            label: "Free Class",
            description:
                "Join a preview session before enrollment and see how the course builds confidence through speaking tasks, feedback, and simple daily practice routines.",
            action: "Start Now",
        },
        structures: [
            {
                title: "Foundation Level",
                badge: "Beginner",
                icon: BookOpen,
                accent: "bg-violet-600",
                description:
                    "Start with essential vocabulary, simple sentence patterns, daily expressions, and pronunciation basics so you can speak with more confidence.",
            },
            {
                title: "Skill Development",
                badge: "Intermediate",
                icon: Layers3,
                accent: "bg-rose-500",
                description:
                    "Practice real-life conversations, improve grammar usage while speaking, and develop better listening responses for everyday situations.",
            },
            {
                title: "Fluency Building",
                badge: "Advanced",
                icon: Users,
                accent: "bg-amber-500",
                description:
                    "Build spontaneous speaking ability through discussions, presentations, storytelling, and professional communication activities.",
            },
            {
                title: "Practice and Evaluation",
                badge: "Assessment",
                icon: FileText,
                accent: "bg-cyan-500",
                description:
                    "Track progress with speaking tasks, quizzes, mock sessions, mentor feedback, and regular performance reviews.",
            },
        ],
        curriculum: [
            {
                title: "Level 1: Foundation",
                summary: "Core speaking basics for beginners",
                items: [
                    "Basic vocabulary and daily words",
                    "Simple sentence structure",
                    "Everyday conversation practice",
                    "Pronunciation fundamentals",
                    "Listening skill development",
                    "Common mistake correction",
                ],
            },
            {
                title: "Level 2: Skill Development",
                summary: "Interactive practice for real conversations",
                items: [
                    "Question and answer fluency drills",
                    "Role-play for common situations",
                    "Grammar usage in spoken English",
                    "Clear pronunciation and intonation",
                    "Conversation confidence building",
                ],
            },
            {
                title: "Level 3: Fluency and Evaluation",
                summary: "Advanced speaking, presentation, and feedback",
                items: [
                    "Group discussion practice",
                    "Presentation and storytelling sessions",
                    "Interview communication practice",
                    "Mock speaking tests",
                    "Personalized feedback and progress review",
                ],
            },
        ],
        includes: [
            "Online live classes",
            "24 classes in each level",
            "Speaking practice sessions",
            "Three structured levels",
            "Twelve months of access",
            "Two one-to-one sessions each month",
            "Language club access",
            "Midterm and final evaluation",
        ],
    },
};

const fallbackCourse = courseCatalog["spoken-english"];

const structureIcons = [BookOpen, Layers3, Users, FileText];
const structureAccents = ["bg-violet-600", "bg-rose-500", "bg-amber-500", "bg-cyan-500"];

function formatMoney(value) {
    const amount = Number(value || 0);

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
}

function formatDuration(course) {
    const hours = Number(course.duration_hours || 0);
    const minutes = Number(course.duration_minutes || 0);

    if (!hours && !minutes) {
        return "Self-paced";
    }

    return `${hours ? `${hours} hours` : ""}${hours && minutes ? " " : ""}${minutes ? `${minutes} minutes` : ""}`;
}

function calculateDiscount(course) {
    const price = Number(course.price || 0);
    const regularPrice = Number(course.regular_price || 0);

    if (!regularPrice || regularPrice <= price) {
        return "Featured";
    }

    return `${Math.round(((regularPrice - price) / regularPrice) * 100)}% OFF`;
}

function mapApiCourse(course) {
    const structures = course.structures?.length
        ? course.structures.map((item, index) => ({
            title: item.title,
            badge: item.badge_icon || `Part ${index + 1}`,
            icon: structureIcons[index % structureIcons.length],
            accent: structureAccents[index % structureAccents.length],
            description: item.description,
        }))
        : fallbackCourse.structures;

    const curriculum = course.levels?.length
        ? course.levels.map((level) => ({
            title: level.level_title,
            summary: level.sub_title || "Structured lessons and guided practice",
            items: level.curriculum_items?.length
                ? level.curriculum_items.map((item) => item.item_name)
                : ["Guided lesson", "Practice activity", "Progress review"],
        }))
        : fallbackCourse.curriculum;

    const includes = course.features?.length
        ? course.features.map((feature) => feature.feature_text)
        : fallbackCourse.includes;

    return {
        title: course.title,
        subtitle: course.subtitle || fallbackCourse.subtitle,
        description: course.description || fallbackCourse.description,
        category: course.category || "Course",
        rating: Number(course.reviews_avg_rating || 0) || fallbackCourse.rating,
        students: Number(course.enrollments_count || 0) ? `${course.enrollments_count}+` : fallbackCourse.students,
        price: formatMoney(course.price),
        regularPrice: course.regular_price ? formatMoney(course.regular_price) : "",
        discountLabel: calculateDiscount(course),
        duration: formatDuration(course),
        levels: `${course.levels?.length || curriculum.length} levels`,
        thumbnailUrl: course.thumbnail_url || fallbackCourse.thumbnailUrl,
        bannerImage: course.thumbnail_url || fallbackCourse.bannerImage,
        promoVideoUrl: course.promo_video_url || "",
        tabs: fallbackCourse.tabs,
        freeClass: {
            ...fallbackCourse.freeClass,
            title: `Start your ${course.title} practice today`,
        },
        structures,
        curriculum,
        includes,
    };
}

export default function CourseDetailsPage() {
    const { slug } = useParams();
    const { data: apiCourse, isLoading, isError } = useGetFrontendCourseQuery(slug);
    const course = apiCourse ? mapApiCourse(apiCourse) : (courseCatalog[slug] || fallbackCourse);
    const [activeTab, setActiveTab] = useState(course.tabs[0]);
    const [activeCurriculum, setActiveCurriculum] = useState(0);

    const activeCurriculumData = useMemo(
        () => course.curriculum[activeCurriculum],
        [course.curriculum, activeCurriculum]
    );

    if (isLoading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 text-slate-600">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-500" />
            </main>
        );
    }

    if (isError && !courseCatalog[slug]) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 text-center">
                <div className="max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-black text-slate-900">Course not found</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        The course you are looking for is not available right now.
                    </p>
                    <Link href="/" className="mt-6 inline-flex rounded-xl bg-pink-500 px-5 py-3 text-sm font-bold text-white">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <section className="bg-[linear-gradient(120deg,_#030712,_#312e81_52%,_#be185d)] px-6 py-12 text-white md:px-12 lg:px-24">
                <div className="mx-auto max-w-7xl lg:pr-[390px]">
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-pink-100">
                        <span>{course.category}</span>
                        <span className="h-1 w-1 rounded-full bg-pink-200" />
                        <span className="flex items-center gap-1">
                            <Star size={14} className="fill-amber-300 text-amber-300" />
                            {course.rating}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-pink-200" />
                        <span>{course.students} students</span>
                    </div>
                    <h1 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">{course.title}</h1>
                    <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                        {course.subtitle}
                    </p>
                </div>
            </section>

            <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-16">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <section className="w-full space-y-10 lg:w-[68%]">
                        <div className="flex gap-6 overflow-x-auto border-b border-slate-200 text-sm font-bold md:text-base">
                            {course.tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap border-b-2 pb-3 transition ${
                                        activeTab === tab
                                            ? "border-pink-500 text-pink-600"
                                            : "border-transparent text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(135deg,_#020617,_#111827_55%,_#3b0764)] p-6 text-white shadow-xl md:p-8">
                            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
                                <div className="flex-1 space-y-4">
                                    <span className="inline-flex rounded-md bg-amber-400/10 px-3 py-1 text-2xl font-black text-amber-300 md:text-3xl">
                                        {course.freeClass.label}
                                    </span>
                                    <h2 className="text-xl font-bold text-slate-100 md:text-2xl">
                                        {course.freeClass.title}
                                    </h2>
                                    <p className="max-w-md text-sm leading-6 text-slate-400">
                                        {course.freeClass.description}
                                    </p>
                                    <button className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-pink-600">
                                        {course.freeClass.action}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                                <div className="w-full max-w-[300px] flex-1">
                                    <img
                                        src={course.bannerImage}
                                        alt={`${course.title} class preview`}
                                        className="aspect-[4/3] w-full rounded-xl border border-slate-700 object-cover shadow-2xl"
                                    />
                                </div>
                            </div>
                        </section>

                        {activeTab === "Course Structure" ? (
                            <>
                                <section className="space-y-4">
                                    <h2 className="text-xl font-black text-slate-900">How the course is structured</h2>
                                    <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-300 md:grid-cols-2 md:p-8">
                                        {course.structures.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <article key={item.title} className="space-y-3">
                                                    <div className="flex items-center gap-3 text-white">
                                                        <span className={`rounded-lg ${item.accent} p-2`}>
                                                            <Icon size={16} />
                                                        </span>
                                                        <div>
                                                            <h3 className="font-bold">{item.title}</h3>
                                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                                {item.badge}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="pl-11 text-sm leading-6 text-slate-400">
                                                        {item.description}
                                                    </p>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-black text-slate-900">Course curriculum</h2>
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                        {course.curriculum.map((section, index) => {
                                            const isActive = activeCurriculum === index;
                                            return (
                                                <div key={section.title} className="border-b border-slate-100 last:border-b-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveCurriculum(index)}
                                                        className={`flex w-full items-center justify-between p-5 text-left font-bold transition ${
                                                            isActive ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <span>{section.title}</span>
                                                        <ChevronDown
                                                            size={20}
                                                            className={`text-slate-400 transition ${isActive ? "rotate-180" : ""}`}
                                                        />
                                                    </button>
                                                    {isActive && (
                                                        <div className="space-y-4 border-t border-slate-100 bg-white p-6 text-sm text-slate-600">
                                                            <p className="font-bold text-slate-900">{activeCurriculumData.summary}</p>
                                                            <ul className="space-y-3">
                                                                {activeCurriculumData.items.map((item) => (
                                                                    <li key={item} className="flex items-start gap-3 font-medium">
                                                                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                <h2 className="mb-4 text-xl font-black text-slate-900">About this course</h2>
                                <p className="leading-7 text-slate-600">{course.description}</p>
                            </section>
                        )}
                    </section>

                    <aside className="w-full lg:absolute lg:right-4 lg:top-[-8rem] lg:z-30 lg:w-[32%]">
                        <div className="sticky top-6 space-y-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                            <div className="group relative aspect-video overflow-hidden rounded-xl bg-emerald-900 shadow-md">
                                <img
                                    src={course.thumbnailUrl}
                                    alt={`${course.title} thumbnail`}
                                    className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-pink-500 shadow-xl transition hover:scale-110 hover:bg-white">
                                        <Play size={26} className="ml-1 fill-current" />
                                    </button>
                                </div>
                                <span className="absolute right-3 top-3 rounded-md bg-yellow-400 px-2 py-1 text-xs font-black text-slate-950 shadow-sm">
                                    {course.discountLabel}
                                </span>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-black text-slate-950">{course.price}</span>
                                    <span className="pb-1 text-sm font-bold text-slate-400 line-through">
                                        {course.regularPrice}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Link
                                    href="/register"
                                    className="block w-full rounded-xl bg-pink-500 py-3 text-center text-base font-bold text-white shadow-md transition-colors hover:bg-pink-600"
                                >
                                    Enroll Now
                                </Link>
                                <button className="w-full rounded-xl border border-pink-300 py-3 text-sm font-bold text-pink-600 transition-colors hover:bg-pink-50">
                                    Book a Free Class
                                </button>
                            </div>

                            <div className="space-y-3 pt-2">
                                <h3 className="text-sm font-black text-slate-900">What is included</h3>
                                <ul className="space-y-3 text-sm font-medium text-slate-600">
                                    <li className="flex items-center gap-2.5">
                                        <Video size={16} className="text-slate-400" />
                                        <span>{course.includes[0]}</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FileText size={16} className="text-slate-400" />
                                        <span>{course.includes[1]}</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Clock3 size={16} className="text-slate-400" />
                                        <span>{course.duration}</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Layers3 size={16} className="text-slate-400" />
                                        <span>{course.levels}</span>
                                    </li>
                                    {course.includes.slice(2).map((item) => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
