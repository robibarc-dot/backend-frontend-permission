import Link from "next/link";

const navItems = [
    { label: "Home", href: "#home" },
    { label: "Contact Us", href: "#contact" },
];

export default function Header() {
    return (
        <header className="px-4 pt-5 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/60 bg-white/78 px-4 py-3 shadow-[0_18px_60px_rgba(120,84,45,0.10)] backdrop-blur sm:px-6">
                <Link href="/" className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#102033,_#c38a3b)] text-sm font-bold text-white">
                        PP
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-950">Permission Project</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Role Based Platform</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:inline-flex"
                    >
                        Login
                    </Link>
                    <a
                        href="#contact"
                        className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </header>
    );
}
