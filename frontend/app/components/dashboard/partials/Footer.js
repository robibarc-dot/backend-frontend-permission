export default function Footer() {
    return (
        <footer className="px-4 pb-6 pt-2 sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 rounded-[26px] border border-white/60 bg-white/60 px-5 py-4 text-sm text-slate-600 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-medium text-slate-900">
                        Permission Project Dashboard
                    </p>
                    <p className="mt-1">
                        Designed for calm oversight, quick actions, and cleaner role-based staff workflows.
                    </p>
                </div>

                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                        Secure session
                    </span>
                    <span>Build with Next.js</span>
                </div>
            </div>
        </footer>
    );
}
