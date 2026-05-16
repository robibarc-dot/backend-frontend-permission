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
        <header className="sticky md:hidden top-0 z-30 px-4 pt-4 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-7xl rounded-[30px] border border-white/60 bg-white/72 px-4 py-4 shadow-[0_20px_60px_rgba(116,82,43,0.14)] backdrop-blur sm:px-6">
                <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <button
                                type="button"
                                onClick={onMenuClick}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 shadow-sm transition hover:-translate-y-0.5 lg:hidden"
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
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
