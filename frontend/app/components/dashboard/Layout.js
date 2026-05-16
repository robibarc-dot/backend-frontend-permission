"use client";

import { useEffect, useState } from "react";
import Footer from "./partials/Footer";
import Header from "./partials/Header";
import Leftsidebar from "./partials/Leftsidebar";

export default function Layout({
    children,
    role = "admin",
    title = "Control center",
    subtitle = "Track team activity, permissions, and delivery health from one place.",
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,184,140,0.25),_transparent_30%),linear-gradient(135deg,_#f8f2ea_0%,_#f1e4d3_45%,_#e3d4c4_100%)] text-slate-900">
            <div className="relative min-h-screen overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.45),transparent_35%,rgba(77,47,24,0.08)_100%)]" />
                <div className="relative flex min-h-screen">
                    <Leftsidebar
                        role={role}
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-80">
                        <Header
                            role={role}
                            title={title}
                            subtitle={subtitle}
                            onMenuClick={() => setSidebarOpen(true)}
                        />

                        <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-10">
                            <div className="mx-auto w-full max-w-7xl">
                                <section className="rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-[0_18px_60px_rgba(95,62,30,0.12)] backdrop-blur xl:p-6">
                                    {children || (
                                        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
                                            <div className="rounded-[24px] bg-[linear-gradient(145deg,_#1f2937,_#111827)] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
                                                    Performance pulse
                                                </p>
                                                <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight">
                                                    Build a cleaner admin experience for permissions, teams, and daily operations.
                                                </h2>
                                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                                                    This layout is ready for your dashboard pages. Drop cards, tables, and charts
                                                    into the content area and keep the navigation shell consistent across the app.
                                                </p>

                                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                                    {[
                                                        {
                                                            label: "Active users",
                                                            value: "1,284",
                                                            detail: "+12% this week",
                                                        },
                                                        {
                                                            label: "Role updates",
                                                            value: "48",
                                                            detail: "6 pending review",
                                                        },
                                                        {
                                                            label: "System health",
                                                            value: "99.9%",
                                                            detail: "Stable across services",
                                                        },
                                                    ].map((item) => (
                                                        <div
                                                            key={item.label}
                                                            className="rounded-2xl border border-white/10 bg-white/8 p-4"
                                                        >
                                                            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                                                                {item.label}
                                                            </p>
                                                            <p className="mt-3 text-2xl font-semibold">
                                                                {item.value}
                                                            </p>
                                                            <p className="mt-1 text-sm text-emerald-300">
                                                                {item.detail}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid gap-5">
                                                <div className="rounded-[24px] border border-amber-200/70 bg-white/85 p-5 shadow-[0_10px_40px_rgba(120,84,44,0.08)]">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
                                                                Team rhythm
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-semibold text-slate-900">
                                                                Weekly alignment
                                                            </h3>
                                                        </div>
                                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                            On track
                                                        </span>
                                                    </div>

                                                    <div className="mt-5 space-y-4">
                                                        {[
                                                            ["Design refresh", "84%"],
                                                            ["Permission audit", "67%"],
                                                            ["Dashboard migration", "91%"],
                                                        ].map(([label, value]) => (
                                                            <div key={label}>
                                                                <div className="mb-2 flex items-center justify-between text-sm">
                                                                    <span className="text-slate-600">{label}</span>
                                                                    <span className="font-medium text-slate-900">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                                <div className="h-2 rounded-full bg-amber-100">
                                                                    <div
                                                                        className="h-2 rounded-full bg-[linear-gradient(90deg,#a16207,#f59e0b)]"
                                                                        style={{ width: value }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="rounded-[24px] border border-slate-200/80 bg-slate-950 p-5 text-slate-50 shadow-[0_12px_45px_rgba(15,23,42,0.3)]">
                                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                                        Next step
                                                    </p>
                                                    <h3 className="mt-2 text-xl font-semibold">
                                                        Connect your real dashboard pages here
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-7 text-slate-300">
                                                        Wrap protected screens with this layout and replace the placeholder
                                                        cards with data tables, charts, and role management panels.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </main>

                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
