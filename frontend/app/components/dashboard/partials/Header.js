"use client";

const quickStats = [
    { label: "Revenue pulse", value: "$24.8k", tone: "text-emerald-600" },
    { label: "Open approvals", value: "18", tone: "text-amber-700" },
    { label: "Live sessions", value: "342", tone: "text-sky-700" },
];

export default function Header({
    role = "admin",
    title,
    subtitle,
    onMenuClick,
}) {
    const roleLabel = role
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    return (
        <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-7xl rounded-[30px] border border-white/60 bg-white/72 px-4 py-4 shadow-[0_20px_60px_rgba(116,82,43,0.14)] backdrop-blur sm:px-6">
                <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <button
                                type="button"
                                onClick={onMenuClick}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 lg:hidden"
                                aria-label="Open navigation"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 7h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 17h16" />
                                </svg>
                            </button>

                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
                                    {roleLabel} workspace
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                                    {title}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="hidden items-center gap-3 sm:flex">
                            <button
                                type="button"
                                className="rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                            >
                                Export summary
                            </button>
                            <button
                                type="button"
                                className="rounded-full bg-[linear-gradient(135deg,#0f172a,#334155)] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
                            >
                                Create report
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1.3fr_0.9fr]">
                        <div className="flex items-center gap-3 rounded-[24px] border border-amber-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(252,243,228,0.92))] px-4 py-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 12h18" />
                                    <path d="M12 3v18" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900">
                                    Permission project {role}
                                </p>
                                <p className="truncate text-sm text-slate-600">
                                    Curated overview for {role} workflows, access control, and daily updates.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {quickStats.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[22px] border border-white/70 bg-white/90 px-3 py-3 text-center"
                                >
                                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                                        {item.label}
                                    </p>
                                    <p className={`mt-2 text-lg font-semibold ${item.tone}`}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
