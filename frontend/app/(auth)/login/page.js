"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpenCheck, Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { loginUser } from "../../../redux/features/auth/authSlice";
import { getPrimaryRole, getRoleHomePath } from "../../../lib/auth";

function getErrorMessage(error) {
    if (!error) {
        return "";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error?.errors) {
        const firstField = Object.keys(error.errors)[0];
        return error.errors[firstField]?.[0] || error.message || "Login failed";
    }

    return error.message || "Login failed";
}

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const updateField = (field, value) => {
        setLocalError("");
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLocalError("");

        if (!form.email.trim() || !form.password) {
            setLocalError("Enter your email and password to continue.");
            return;
        }

        const result = await dispatch(
            loginUser({
                email: form.email.trim(),
                password: form.password,
            })
        );

        if (loginUser.fulfilled.match(result)) {
            const role = getPrimaryRole(
                result.payload?.user,
                result.payload?.user?.roles
            );

            router.push(getRoleHomePath(role));
        }
    };

    const message = localError || getErrorMessage(error);

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(80,53,26,0.16)] backdrop-blur lg:grid-cols-[1.02fr_0.98fr]">
                <section className="relative hidden min-h-[660px] overflow-hidden bg-[#101827] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(245,158,11,0.26),transparent_30%),linear-gradient(145deg,rgba(15,23,42,0),rgba(80,44,28,0.72))]" />

                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-900/30">
                            <BookOpenCheck size={24} />
                        </div>
                        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.34em] text-amber-200/90">
                            Student portal
                        </p>
                        <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-tight">
                            Continue your IELTS practice from the dashboard.
                        </h1>
                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
                            Sign in to open your learning workspace, review progress, and jump back into mock tests or section practice.
                        </p>
                    </div>

                    <div className="relative grid gap-3 sm:grid-cols-3">
                        {[
                            ["Mock tests", "Full exam practice"],
                            ["Progress", "Track your band goals"],
                            ["Practice", "Train each module"],
                        ].map(([title, description]) => (
                            <div
                                key={title}
                                className="rounded-[18px] border border-white/10 bg-white/8 p-4"
                            >
                                <p className="text-sm font-semibold text-white">{title}</p>
                                <p className="mt-2 text-xs leading-5 text-slate-300">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="flex items-center p-6 sm:p-10">
                    <div className="mx-auto w-full max-w-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-700">
                            Sign in
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                            Welcome back
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Log in with your student account to reach your dashboard.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        onChange={(event) =>
                                            updateField("email", event.target.value)
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        onChange={(event) =>
                                            updateField("password", event.target.value)
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {message ? (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {message}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Signing in
                                    </>
                                ) : (
                                    <>
                                        Continue to dashboard
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-sm text-slate-500">
                            New student?{" "}
                            <Link href="/register" className="font-medium text-slate-950">
                                Create an account
                            </Link>
                            .
                        </div>

                        <div className="mt-8 rounded-[20px] border border-amber-100 bg-amber-50/80 p-4 text-sm leading-6 text-slate-700">
                            After login, student accounts open the learner dashboard at{" "}
                            <span className="font-semibold text-slate-950">/student</span>.
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
