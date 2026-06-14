"use client";

import { Lock, Sparkles } from "lucide-react";

export function Card({ children, className = "", ...props }) {
    return (
        <div
            className={`rounded-[14px] border border-black/10 bg-white p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition hover:border-black/15 hover:bg-gray-50 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function SectionTitle({ children }) {
    return <h2 className="mb-3.5 font-['Sora',sans-serif] text-sm font-bold text-gray-950">{children}</h2>;
}

export function PageIntro({ title, subtitle }) {
    return (
        <div className="mb-6">
            <h2 className="font-['Sora',sans-serif] text-xl font-bold text-gray-950">{title}</h2>
            <p className="mt-1 text-[13px] text-gray-400">{subtitle}</p>
        </div>
    );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
    const styles = {
        primary: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-black/10 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-950",
        amber: "bg-amber-600 text-white hover:bg-amber-700",
    };

    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 rounded-[9px] px-4 py-2.5 text-[13px] font-bold transition ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function LockedOverlay({ title, description, features = [], onUpgrade }) {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[14px] bg-gray-50/85 p-6 text-center backdrop-blur-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] border border-amber-300 bg-amber-50 text-amber-600">
                <Lock size={22} />
            </div>
            <h3 className="font-['Sora',sans-serif] text-sm font-bold text-gray-950">{title}</h3>
            <p className="mt-1 max-w-[260px] text-[11.5px] leading-6 text-gray-400">{description}</p>
            {features.length ? (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {features.map((feature) => (
                        <span key={feature} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-700">
                            {feature}
                        </span>
                    ))}
                </div>
            ) : null}
            <Button variant="amber" className="mt-4 px-5 py-2" onClick={onUpgrade}>
                <Sparkles size={13} /> Unlock Pro
            </Button>
        </div>
    );
}
