import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,90,0.18),_transparent_28%),linear-gradient(135deg,_#faf6ef_0%,_#efe1cf_45%,_#dfd0bf_100%)] px-4 py-10 sm:px-6">
            <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[34px] bg-[linear-gradient(150deg,#111827_0%,#1f2937_55%,#4b5563_100%)] p-8 text-white shadow-[0_30px_120px_rgba(17,24,39,0.35)] sm:p-12">
                    <p className="text-xs uppercase tracking-[0.38em] text-amber-200/80">
                        Permission project
                    </p>
                    <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                        Role-based portals for admin, teacher, and student journeys.
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                        Staff users share a flexible dashboard architecture, while students get a separate interface designed around learning rather than administration.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/login"
                            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                        >
                            Go to login
                        </Link>
                        <Link
                            href="/student"
                            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            View student portal
                        </Link>
                    </div>
                </section>

                <section className="grid gap-4">
                    {[
                        ["Admin", "/admin", "Permissions, users, reports, and governance workflows."],
                        ["Teacher", "/teacher", "Class management, student progress, and academic reporting."],
                        ["Student", "/student", "A separate UI focused on courses, tasks, and progress."],
                    ].map(([title, href, desc]) => (
                        <div
                            key={title}
                            className="rounded-[28px] border border-white/60 bg-white/72 p-6 shadow-[0_20px_70px_rgba(99,66,33,0.12)] backdrop-blur"
                        >
                            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                                {title} portal
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
                            <Link
                                href={href}
                                className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Open route
                            </Link>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
