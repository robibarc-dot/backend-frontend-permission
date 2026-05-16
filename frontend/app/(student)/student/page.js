"use client";

import { useSelector } from "react-redux";

export default function StudentPage() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(135deg,_#eff6ff_0%,_#dbeafe_52%,_#bfdbfe_100%)] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/72 shadow-[0_30px_100px_rgba(37,99,235,0.16)] backdrop-blur">
                    <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
                        <section className="rounded-[28px] bg-[linear-gradient(160deg,#0f172a_0%,#1d4ed8_100%)] p-6 text-white">
                            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">
                                Student portal
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold leading-tight">
                                A separate learning experience for students
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-100">
                                This area stays independent from the staff dashboard so the student interface can focus on courses, assignments, and progress.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                {[
                                    ["Courses", "06"],
                                    ["Assignments", "14"],
                                    ["Attendance", "95%"],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.22em] text-sky-100/80">
                                            {label}
                                        </p>
                                        <p className="mt-3 text-2xl font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-5">
                            <div className="rounded-[24px] border border-sky-100 bg-white/92 p-5">
                                <p className="text-xs uppercase tracking-[0.28em] text-sky-700">
                                    Student profile
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                    {user?.name || "Student user"}
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    {user?.email || "No email returned from API"}
                                </p>
                            </div>

                            <div className="rounded-[24px] border border-slate-200 bg-white/92 p-5">
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                    Learning focus
                                </p>
                                <div className="mt-4 space-y-3">
                                    {[
                                        "Continue course modules",
                                        "Check assignment deadlines",
                                        "Review feedback from teachers",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
