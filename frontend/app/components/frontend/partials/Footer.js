import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-black/5 bg-[#fffaf2] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
                <div>
                    <p className="text-lg font-semibold text-slate-950">Permission Project</p>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                        A role-based platform experience for administrators, teachers, and students with cleaner navigation,
                        structured access, and room to scale.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Navigation</p>
                        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                            <a href="#home" className="transition hover:text-slate-950">
                                Home
                            </a>
                            <a href="#contact" className="transition hover:text-slate-950">
                                Contact Us
                            </a>
                            <Link href="/login" className="transition hover:text-slate-950">
                                Login
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-900">Contact</p>
                        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                            <a href="mailto:support@permissionproject.test" className="transition hover:text-slate-950">
                                support@permissionproject.test
                            </a>
                            <a href="tel:+8801000000000" className="transition hover:text-slate-950">
                                +880 1000-000000
                            </a>
                            <span>Dhaka, Bangladesh</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-6xl border-t border-black/5 pt-5 text-sm text-slate-500">
                Copyright {new Date().getFullYear()} Permission Project. All rights reserved.
            </div>
        </footer>
    );
}
