"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../redux/features/auth/authSlice";
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
        return error.errors[firstField]?.[0] || error.message || "Registration failed";
    }

    return error.message || "Registration failed";
}

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [localError, setLocalError] = useState("");

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (form.password !== form.password_confirmation) {
            setLocalError("Passwords do not match.");
            return;
        }

        const result = await dispatch(
            registerUser({
                name: form.name,
                email: form.email,
                password: form.password,
            })
        );

        if (registerUser.fulfilled.match(result)) {
            const role = getPrimaryRole(
                result.payload?.user,
                result.payload?.user?.roles
            );

            router.push(getRoleHomePath(role));
        }
    };

    const message = localError || getErrorMessage(error);

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_30px_120px_rgba(80,53,26,0.18)] backdrop-blur lg:grid-cols-[1fr_1fr]">
                <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#111827_0%,#273449_54%,#49352a_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.25),_transparent_32%)]" />
                    <div className="relative">
                        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                            Create account
                        </p>
                        <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight">
                            Start with a student workspace built for steady IELTS practice.
                        </h1>
                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
                            New accounts are created with student access and routed directly into the learning portal after registration.
                        </p>
                    </div>

                    <div className="relative grid gap-4 sm:grid-cols-3">
                        {[
                            ["Practice", "Listening, reading, writing, and speaking"],
                            ["Track", "Progress and mock test history"],
                            ["Improve", "Focused feedback and next steps"],
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
                            Register
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                            Create your account
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Use your details below to open a student account and continue to the portal.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    placeholder="Your name"
                                    required
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    placeholder="name@example.com"
                                    required
                                    onChange={(e) => updateField("email", e.target.value)}
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
                                    placeholder="Minimum 6 characters"
                                    minLength={6}
                                    required
                                    onChange={(e) => updateField("password", e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Confirm password
                                </label>
                                <input
                                    type="password"
                                    value={form.password_confirmation}
                                    placeholder="Repeat your password"
                                    minLength={6}
                                    required
                                    onChange={(e) =>
                                        updateField("password_confirmation", e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            {message ? (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {message}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-[linear-gradient(135deg,#111827,#374151)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <div className="mt-6 text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-slate-900">
                                Sign in
                            </Link>
                            .
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
