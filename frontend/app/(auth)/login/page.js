"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { loginUser } from "../../../redux/features/auth/authSlice";
import { getPrimaryRole, getRoleHomePath } from "../../../lib/auth";

function getErrorMessage(error) {
    if (!error) return "";
    if (typeof error === "string") return error;
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
        /* Restrains the outer boundary to the exact viewport height and strips generic page overflows */
        <main className="bg-gray-50 h-screen w-screen flex items-stretch overflow-hidden font-sans">
            
            {/* Left Sidebar (Marketing Panel) */}
            {/* Locked to h-full and shrink-0 to remain cleanly fixed and responsive */}
            <section className="hidden lg:flex w-1/2 h-full shrink-0 bg-gradient-to-br from-[#ff2a85] via-[#ec1c76] to-[#d0005f] text-white p-16 flex-col justify-between relative overflow-hidden select-none">
                {/* Decorative background blobs */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-1/2 -right-12 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Logo */}
                <div className="relative z-10">
                    <span className="text-2xl font-bold tracking-tight">Mocielts</span>
                </div>

                {/* Content Middle */}
                <div className="relative z-10 max-w-lg space-y-4 my-auto">
                    <div className="text-4xl">🎯</div>
                    <h1 className="text-4xl font-bold leading-tight tracking-tight">
                        Your target band score <br /> starts here.
                    </h1>
                    <p className="text-white/80 text-[15px] leading-relaxed">
                        Join 50,000+ students who've achieved their IELTS goals with expert-designed practice and AI feedback.
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-4 pt-4 text-[14px] font-medium text-white/90">
                        {[
                            "Full access to all 4 IELTS modules",
                            "AI-powered instant feedback",
                            "Track your band score progress",
                            "Expert blog & study guides",
                        ].map((text) => (
                            <li key={text} className="flex items-center gap-3">
                                <Check size={18} strokeWidth={3} className="opacity-90" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social Proof Footer */}
                <div className="relative z-10 flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="flex -space-x-2">
                        <span className="w-8 h-8 rounded-full bg-amber-400 border-2 border-[#ec1c76] flex items-center justify-center text-xs">⏳</span>
                        <span className="w-8 h-8 rounded-full bg-blue-400 border-2 border-[#ec1c76] flex items-center justify-center text-xs">👨‍🎓</span>
                        <span className="w-8 h-8 rounded-full bg-green-400 border-2 border-[#ec1c76] flex items-center justify-center text-xs">👩‍🎓</span>
                        <span className="w-8 h-8 rounded-full bg-purple-400 border-2 border-[#ec1c76] flex items-center justify-center text-xs">⌛</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-none">50,000+ students</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-white/70">
                          <span className="text-amber-300">★★★★★</span>
                          <span>4.8 average rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right Sidebar (Form View Container) */}
            {/* Added h-full, overflow-y-auto, and increased padding to cleanly manage individual panel scrolling */}
            <section className="w-full lg:w-1/2 h-full bg-white flex flex-col items-center px-6 py-24 sm:px-16 relative overflow-y-auto">
                {/* Top Back Navigation */}
                <div className="absolute top-8 left-6 sm:left-16">
                    <Link href="/" className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition">
                        <ArrowLeft size={14} />
                        Back to home
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-6 my-auto">
                    {/* Segmented State Switcher Toggle */}
                    <div className="bg-gray-100/80 p-1 rounded-xl flex items-center text-xs font-semibold text-gray-500">
                        <button className="w-1/2 py-2.5 rounded-lg text-center bg-white text-gray-900 shadow-sm border border-black/5">
                            Log In
                        </button>
                        <Link href="/register" className="w-1/2 py-2.5 rounded-lg text-center transition hover:text-gray-800">
                            Sign Up
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            Welcome back <span className="text-2xl">👋</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400">Log in to continue your IELTS preparation.</p>
                    </div>

                    {/* Social Auth Row Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" /></svg>
                            Facebook
                        </button>
                    </div>

                    {/* Section Divider Text */}
                    <div className="relative flex items-center justify-center py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <span className="relative px-3 bg-white text-[10px] uppercase font-semibold tracking-wider text-gray-400">or continue with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input Group */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                    onChange={(event) => updateField("email", event.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ec1c76] placeholder-gray-300 transition"
                                />
                            </div>
                        </div>

                        {/* Password Input Group */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Password</label>
                                <Link href="/forgot-password" title="Currently placeholder" className="text-[11px] font-semibold text-[#ec1c76] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                                    <LockKeyhole size={16} />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(event) => updateField("password", event.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ec1c76] placeholder-gray-300 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 cursor-pointer hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#ec1c76] text-white rounded-xl text-sm font-semibold shadow-md shadow-pink-500/10 hover:bg-[#d0005f] active:scale-[0.99] transition transform duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                            {loading ? "Signing in..." : "Log In to My Account"}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-400 font-medium">
                            Don't have an account? 
                            <Link href="/register" className="text-[#ec1c76] font-bold hover:underline ml-1">
                                Sign up free
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}