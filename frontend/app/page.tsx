import Link from "next/link";

const portalCards = [
    {
        title: "Admin",
        href: "/admin",
        description: "Control permissions, monitor activity, and keep the platform aligned across teams.",
    },
    {
        title: "Teacher",
        href: "/teacher",
        description: "Manage classes, shape learning flows, and keep student performance visible at a glance.",
    },
    {
        title: "Student",
        href: "/student",
        description: "Give learners a focused space for lessons, tasks, milestones, and progress tracking.",
    },
];

export default function Home() {
    return (
        <main>
            <section id="home" className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <div className="rounded-[36px] bg-[linear-gradient(145deg,_#102033_0%,_#17314a_52%,_#254764_100%)] p-8 text-white shadow-[0_32px_120px_rgba(16,32,51,0.28)] sm:p-12">
                        <p className="text-xs uppercase tracking-[0.38em] text-amber-200/85">
                            Permission Project
                        </p>
                        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                            One platform for structured access, smoother teaching, and clearer student journeys.
                        </h1>
                        <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-200 sm:text-base">
                            Bring admin, teacher, and student experiences into one polished system with role-aware navigation,
                            better organization, and interfaces designed for real daily use.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-full bg-[#f6d7a7] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f2c987]"
                            >
                                Sign In
                            </Link>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(120,84,45,0.12)] backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.28em] text-amber-700">Platform Focus</p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                                Built for permission-based workflows without feeling heavy.
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600">
                                The experience is organized around access, clarity, and responsibility so every user sees only what
                                matters to their work.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[28px] bg-[#f8efe1] p-5 shadow-[0_16px_50px_rgba(120,84,45,0.08)]">
                                <p className="text-sm font-semibold text-slate-900">Role-aware access</p>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Keep admin, teacher, and student spaces clearly separated.
                                </p>
                            </div>
                            <div className="rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(120,84,45,0.08)]">
                                <p className="text-sm font-semibold text-slate-900">Cleaner operations</p>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Make common actions faster with a layout that supports daily tasks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.32em] text-amber-700">Portals</p>
                            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                Three experiences, one connected system
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-7 text-slate-600">
                            Each area is designed around the needs of its audience, while the platform stays consistent underneath.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {portalCards.map((portal) => (
                            <article
                                key={portal.title}
                                className="rounded-[30px] border border-white/70 bg-white/85 p-7 shadow-[0_24px_70px_rgba(120,84,45,0.10)] backdrop-blur"
                            >
                                <p className="text-xs uppercase tracking-[0.28em] text-amber-700">{portal.title} Portal</p>
                                <h3 className="mt-3 text-2xl font-semibold text-slate-950">{portal.title}</h3>
                                <p className="mt-4 text-sm leading-7 text-slate-600">{portal.description}</p>
                                <Link
                                    href={portal.href}
                                    className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                                >
                                    Open {portal.title}
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl rounded-[34px] bg-[linear-gradient(145deg,_#fff9ef_0%,_#f3e3c7_100%)] p-8 shadow-[0_24px_80px_rgba(120,84,45,0.10)] sm:p-10">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <p className="text-xs uppercase tracking-[0.32em] text-amber-700">Contact Us</p>
                            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                                Need help setting up access or exploring the platform?
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                                Reach out to the team for onboarding support, product questions, or help coordinating role-based
                                access across your organization.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                            <a
                                href="mailto:support@permissionproject.test"
                                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                            >
                                support@permissionproject.test
                            </a>
                            <a
                                href="tel:+8801000000000"
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white/70"
                            >
                                +880 1000-000000
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
