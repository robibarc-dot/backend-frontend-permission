"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Layers, Loader2, Save } from "lucide-react";
import { useGetModuleQuery, useUpdateModuleMutation } from "@/redux/features/common/backend/moduleApi";

export default function EditModulePage() {
    const router = useRouter();
    const { role, id } = useParams();
    const resolvedRole = role?.toLowerCase();
    
    const { data: moduleData, isLoading: fetching } = useGetModuleQuery(id);
    const [updateModule, { isLoading: saving }] = useUpdateModuleMutation();

    const [form, setForm] = useState({
        title: "",
        status: "active",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (moduleData) {
            setForm({
                title: moduleData.title || "",
                status: moduleData.status || "active",
            });
        }
    }, [moduleData]);

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updateModule({ id, body: form }).unwrap();
            setSuccess("Module updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/modules`), 1500);
        } catch (requestError) {
            setError(requestError?.data?.message || "Unable to update module.");
        }
    }

    if (fetching) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/modules`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Modules
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <Layers size={20} className="text-blue-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Module Management</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit Module</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Update existing module information.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                            <select
                                required
                                value={form.status}
                                onChange={(event) => updateField("status", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {error || success}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Updating..." : "Update Module"}
                    </button>
                </div>
            </form>
        </div>
    );
}
