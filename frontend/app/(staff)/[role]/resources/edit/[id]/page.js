"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FilePenLine, Loader2, Plus, Save, Trash2 } from "lucide-react";

import {
    useGetResourceQuery,
    useUpdateResourceMutation,
} from "@/redux/features/resource/backend/resourceApi";
import { useGetModulesQuery } from "@/redux/features/common/backend/moduleApi";
import TextEditor from "../../../../../components/dashboard/common/TextEditor";

function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;
    if (validationErrors) {
        return Object.values(validationErrors).flat().join(" ");
    }
    return requestError?.data?.message || fallback;
}

const initialSection = {
    title: "",
    text_content: "",
    image_url: "",
    status: "active",
};

export default function EditResourcePage() {
    const router = useRouter();
    const { role, id } = useParams();
    const resolvedRole = role?.toLowerCase();

    const { data: resource, isLoading: fetching } = useGetResourceQuery(id);
    const [updateResource, { isLoading: saving }] = useUpdateResourceMutation();
    
    const { data: modules = [], isLoading: loadingModules } = useGetModulesQuery();

    const [form, setForm] = useState({
        module_id: "",
        topic: "",
        status: "active",
        sections: [{ ...initialSection }],
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (resource) {
            setForm({
                module_id: resource.module_id || "",
                topic: resource.topic || "",
                status: resource.status || "active",
                sections: resource.sections?.length
                    ? resource.sections.map((s) => ({
                        title: s.title || "",
                        text_content: s.text_content || "",
                        image_url: s.image_url || "",
                        status: s.status || "active",
                    }))
                    : [{ ...initialSection }],
            });
        }
    }, [resource]);

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function updateSection(index, field, value) {
        setForm((current) => {
            const sections = [...current.sections];
            sections[index] = { ...sections[index], [field]: value };
            return { ...current, sections };
        });
    }

    function addSection() {
        setForm((current) => ({
            ...current,
            sections: [...current.sections, { ...initialSection }],
        }));
    }

    function removeSection(index) {
        setForm((current) => {
            const sections = current.sections.filter((_, i) => i !== index);
            return { ...current, sections };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!form.module_id) {
            setError("Please select a module.");
            return;
        }

        try {
            await updateResource({ id, body: form }).unwrap();
            setSuccess("Resource updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/resources`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to update resource."));
        }
    }

    if (fetching) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-medium">Retrieving resource...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/resources`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Resources
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <FilePenLine size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Resource Update ID: {id}</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit Resource</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Update the resource topic, module, status, and content sections.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Module</label>
                            <select
                                required
                                value={form.module_id}
                                onChange={(event) => updateField("module_id", event.target.value ? parseInt(event.target.value) : "")}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                disabled={loadingModules}
                            >
                                <option value="">{loadingModules ? "Loading modules..." : "Select a module"}</option>
                                {modules.map((module) => (
                                    <option key={module.id} value={module.id}>
                                        {module.title}
                                    </option>
                                ))}
                            </select>
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
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Topic</label>
                            <input
                                type="text"
                                required
                                value={form.topic}
                                onChange={(event) => updateField("topic", event.target.value)}
                                placeholder="e.g., IELTS Reading Strategies"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-700">Content Sections</h3>
                            <button
                                type="button"
                                onClick={addSection}
                                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <Plus size={16} />
                                Add Section
                            </button>
                        </div>

                        <div className="space-y-4">
                            {form.sections.map((section, index) => (
                                <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Section {index + 1}</span>
                                        {form.sections.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSection(index)}
                                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={section.title}
                                            onChange={(event) => updateSection(index, "title", event.target.value)}
                                            placeholder="Section title"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Content</label>
                                        <TextEditor
                                            value={section.text_content}
                                            onChange={(html) => updateSection(index, "text_content", html)}
                                            placeholder="Write your content here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Image URL (optional)</label>
                                        <input
                                            type="url"
                                            value={section.image_url}
                                            onChange={(event) => updateSection(index, "image_url", event.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status</label>
                                        <select
                                            value={section.status}
                                            onChange={(event) => updateSection(index, "status", event.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        >
                                            <option value="active">Active</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {error || success}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Updating..." : "Update Resource"}
                    </button>
                </div>
            </form>
        </div>
    );
}