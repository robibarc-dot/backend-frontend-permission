"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Star, Users } from "lucide-react";
import { useGetFrontendCoursesQuery } from "@/redux/features/course/frontend/courseApi";

const courseSectionData = {
    heading: "Our Courses",
    courses: [
        {
            id: 1,
            title: "IELTS Starter Course",
            slug: "ielts-starter-course",
            subtitle: "Build your English foundation",
            category: "IELTS Preparation",
            rating: 4.89,
            reviewCount: 9,
            students: 316,
            duration: "10 hours 20 minutes",
            price: "$20",
            regularPrice: "$50",
            imageUrl:
                "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=900",
        },
        {
            id: 2,
            title: "Spoken English",
            slug: "spoken-english",
            subtitle: "Speak confidently in everyday situations",
            category: "Language Learning",
            rating: 4.92,
            reviewCount: 18,
            students: 1240,
            duration: "12 hours 45 minutes",
            price: "$59",
            regularPrice: "$149",
            imageUrl:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900",
        },
        {
            id: 3,
            title: "IELTS Writing Masterclass",
            slug: "ielts-writing-masterclass",
            subtitle: "Improve task response, coherence, and grammar",
            category: "IELTS Writing",
            rating: 4.85,
            reviewCount: 14,
            students: 784,
            duration: "8 hours 30 minutes",
            price: "$35",
            regularPrice: "$80",
            imageUrl:
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=900",
        },
        {
            id: 4,
            title: "Academic Reading Skills",
            slug: "academic-reading-skills",
            subtitle: "Master skimming, scanning, and question strategy",
            category: "Reading Strategy",
            rating: 4.78,
            reviewCount: 11,
            students: 642,
            duration: "7 hours 15 minutes",
            price: "$29",
            regularPrice: "$70",
            imageUrl:
                "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=900",
        },
        {
            id: 5,
            title: "Listening Practice Lab",
            slug: "listening-practice-lab",
            subtitle: "Train your ear for accents and test patterns",
            category: "Listening Practice",
            rating: 4.81,
            reviewCount: 7,
            students: 438,
            duration: "6 hours 50 minutes",
            price: "$25",
            regularPrice: "$60",
            imageUrl:
                "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=900",
        },
        {
            id: 6,
            title: "Speaking Test Preparation",
            slug: "speaking-test-preparation",
            subtitle: "Practice answers, fluency, and pronunciation",
            category: "IELTS Speaking",
            rating: 4.9,
            reviewCount: 21,
            students: 970,
            duration: "9 hours 10 minutes",
            price: "$39",
            regularPrice: "$95",
            imageUrl:
                "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900",
        },
    ],
};

const cardsPerPage = 4;

function getPaginatedItems(response) {
    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return response?.data?.data || [];
}

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

function mapApiCourse(course) {
    return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle || "Build practical skills with guided lessons",
        category: course.category || "Course",
        rating: Number(course.reviews_avg_rating || 0) || 4.8,
        reviewCount: Number(course.reviews_count || 0),
        students: Number(course.enrollments_count || 0),
        duration: formatDuration(course),
        price: formatMoney(course.price),
        regularPrice: course.regular_price ? formatMoney(course.regular_price) : "",
        imageUrl:
            course.thumbnail_url ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900",
    };
}

function RatingStars({ rating }) {
    const roundedRating = Math.round(rating);

    return (
        <div className="flex text-amber-400" aria-label={`${rating} out of 5 rating`}>
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={14}
                    className={index < roundedRating ? "fill-current" : "text-slate-300"}
                />
            ))}
        </div>
    );
}

function CourseCard({ course }) {
    return (
        <article className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div>
                <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                />
                <div className="p-5">
                    <div className="mb-3 flex items-center gap-1 text-sm text-slate-500">
                        <RatingStars rating={course.rating} />
                        <span className="ml-1 font-semibold text-slate-700">{course.rating}</span>
                        <span>({course.reviewCount})</span>
                    </div>

                    <h3 className="mb-1 text-lg font-bold leading-snug text-slate-950">
                        {course.title}
                    </h3>
                    <p className="mb-4 text-xs font-medium text-slate-500">{course.subtitle}</p>

                    <div className="space-y-2 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-400" />
                            <span>{course.students.toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock3 size={16} className="text-slate-400" />
                            <span>{course.duration}</span>
                        </div>
                        <div className="pt-1 text-[11px] text-slate-400">
                            In <span className="font-semibold text-slate-600">{course.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 px-5 pb-5 pt-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-950">{course.price}</span>
                    <span className="text-xs text-slate-400 line-through">{course.regularPrice}</span>
                </div>
                <Link
                    href={`/courses/${course.slug}`}
                    className="rounded-md border border-pink-400 px-3 py-1.5 text-xs font-semibold text-pink-500 transition-colors hover:bg-pink-50"
                >
                    See Details
                </Link>
            </div>
        </article>
    );
}

export default function CourseSection() {
    const [page, setPage] = useState(0);
    const { data: coursesResponse } = useGetFrontendCoursesQuery({ per_page: 12 });
    const apiCourses = getPaginatedItems(coursesResponse).map(mapApiCourse);
    const courses = apiCourses.length ? apiCourses : courseSectionData.courses;
    const totalPages = Math.max(1, Math.ceil(courses.length / cardsPerPage));

    const visibleCourses = useMemo(() => {
        const start = page * cardsPerPage;
        return courses.slice(start, start + cardsPerPage);
    }, [courses, page]);

    const progressWidth = `${((page + 1) / totalPages) * 100}%`;

    function goPrevious() {
        setPage((current) => Math.max(current - 1, 0));
    }

    function goNext() {
        setPage((current) => Math.min(current + 1, totalPages - 1));
    }

    return (
        <section className="w-full bg-slate-50 px-4 py-16 md:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-7xl space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-wide text-slate-950 md:text-4xl">
                        {courseSectionData.heading}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {visibleCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="mr-8 h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-pink-500 transition-all duration-300"
                            style={{ width: progressWidth }}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={goPrevious}
                            disabled={page === 0}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-pink-400 text-pink-500 transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Previous courses"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={page === totalPages - 1}
                            className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-500 text-white shadow-sm transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Next courses"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
