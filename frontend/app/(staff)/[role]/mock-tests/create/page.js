"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, FilePlus2, Loader2, Save, Settings2 } from "lucide-react";
import { useCreateMockTestMutation } from "@/redux/features/mock/backend/mockTestApi";

const initialForm = {
    title: "",
    slug: "",
    duration_mins: 60,
    category: "academic",
    type: "free",
};

function makeSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;

    if (validationErrors) {
        return Object.values(validationErrors).flat().join(" ");
    }

    return requestError?.data?.message || fallback;
}

export default function CreateMockTestPage() {
    const router = useRouter();
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const [createTest, { isLoading: saving }] = useCreateMockTestMutation();

    const [form, setForm] = useState(initialForm);
    const [slugEdited, setSlugEdited] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: field === "duration_mins" ? Number(value) : value,
        }));
    }

    function updateTitle(value) {
        setForm((current) => ({
            ...current,
            title: value,
            slug: slugEdited ? current.slug : makeSlug(value),
        }));
    }

    function updateSlug(value) {
        setSlugEdited(true);
        updateField("slug", makeSlug(value));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await createTest({
                ...form,
                slug: form.slug || makeSlug(form.title),
            }).unwrap();
            setSuccess("Mock test created successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/mock-tests`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to create mock test."));
        }
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/mock-tests`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Mock Tests
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <FilePlus2 size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Mock Assessment Management</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Create Mock Test</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Configure the mock exam identity, duration, category, and access type.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Mock Test Title</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(event) => updateTitle(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                            <input
                                type="text"
                                required
                                value={form.slug}
                                onChange={(event) => updateSlug(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Duration</label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={form.duration_mins}
                                    onChange={(event) => updateField("duration_mins", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-6">Choose Category</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                { value: "academic", label: "Academic", description: "Focused mock exams for structured preparation." },
                                { value: "general", label: "General", description: "Broad mock tests for open practice." },
                            ].map((category) => {
                                const isSelected = form.category === category.value;
                                return (
                                    <label key={category.value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${isSelected ? "border-amber-200 bg-amber-50/50" : "border-slate-100 bg-white"}`}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={isSelected}
                                            onChange={() => updateField("category", category.value)}
                                            className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{category.label}</p>
                                            <p className="text-[11px] text-slate-500">{category.description}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings2 size={16} className="text-slate-400" />
                            <h3 className="text-sm font-semibold text-slate-700">Mock Test Configuration</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Duration: {form.duration_mins || 0} minutes</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Category: {form.category}</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Access: {form.type}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-6">Access Type</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                { value: "free", label: "Free", description: "Available without payment." },
                                { value: "paid", label: "Paid", description: "Requires paid access." },
                            ].map((type) => {
                                const isSelected = form.type === type.value;
                                return (
                                    <label key={type.value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${isSelected ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-white"}`}>
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={isSelected}
                                            onChange={() => updateField("type", type.value)}
                                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{type.label}</p>
                                            <p className="text-[11px] text-slate-500">{type.description}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {error || success}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Creating..." : "Save Mock Test"}
                    </button>
                </div>
            </form>
        </div>
    );
}
