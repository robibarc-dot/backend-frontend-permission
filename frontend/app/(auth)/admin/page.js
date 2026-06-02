"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../redux/features/auth/authSlice";
import { getPrimaryRole, getRoleHomePath } from "../../../lib/auth";

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginUser(form));

        if (loginUser.fulfilled.match(result)) {
            const role = getPrimaryRole(
                result.payload?.user,
                result.payload?.user?.roles
            );

            router.push(getRoleHomePath(role));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_30px_120px_rgba(80,53,26,0.18)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#111827_0%,#1e293b_52%,#3b2f2f_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.25),_transparent_32%)]" />
                    <div className="relative">
                        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                            Permission project
                        </p>
                        <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight">
                            Separate portals for admin, teacher, and student workflows.
                        </h1>
                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
                            Staff users land in a shared role-based workspace, while students keep their own dedicated experience.
                        </p>
                    </div>

                    <div className="relative grid gap-4 sm:grid-cols-3">
                        {[
                            ["Admin", "Operations and permissions"],
                            ["Teacher", "Classes and reporting"],
                            ["Student", "Learning-focused portal"],
                        ].map(([title, desc]) => (
                            <div
                                key={title}
                                className="rounded-[24px] border border-white/10 bg-white/8 p-4"
                            >
                                <p className="text-lg font-semibold">{title}</p>
                                <p className="mt-2 text-sm text-slate-300">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="p-6 sm:p-10">
                    <div className="mx-auto max-w-md">
                        <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
                            Sign in
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                            Welcome back
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Use your account to continue to the correct portal for your role.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    placeholder="name@example.com"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    placeholder="Enter your password"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            {error ? (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-[linear-gradient(135deg,#111827,#374151)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? "Signing in..." : "Continue to portal"}
                            </button>
                        </form>


                        <div className="mt-6 text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/register" className="font-medium text-slate-900">
                                Sign up
                            </Link>
                            .
                        </div>
                        <div className="mt-8 rounded-[24px] border border-amber-100 bg-amber-50/70 p-4 text-sm text-slate-700">
                            Student access stays separate after login. Staff users are routed to role-based portals automatically.
                        </div>

                        <div className="mt-6 text-sm text-slate-500">
                            Need a public landing page first? Visit{" "}
                            <Link href="/" className="font-medium text-slate-900">
                                the homepage
                            </Link>
                            .
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
