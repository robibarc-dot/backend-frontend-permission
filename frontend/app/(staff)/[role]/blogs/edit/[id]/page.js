"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FilePenLine, Image as ImageIcon, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";

import {
    useGetBlogQuery,
    useUpdateBlogMutation,
} from "@/redux/features/blog/backend/blogApi";
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
    type: "text",
    title: "",
    text_content: "",
    image_url: null,
    imageFile: null,
    status: "active",
};

export default function EditBlogPage() {
    const router = useRouter();
    const { role, id } = useParams();
    const resolvedRole = role?.toLowerCase();

    const { data: blog, isLoading: fetching } = useGetBlogQuery(id);
    const [updateBlog, { isLoading: saving }] = useUpdateBlogMutation();
    
    const { data: modules = [], isLoading: loadingModules } = useGetModulesQuery();

    const [form, setForm] = useState({
        module_id: "",
        title: "",
        short_description: "",
        status: "active",
        banner_img: null,
        bannerFile: null,
        sections: [{ ...initialSection }],
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (blog) {
            setForm({
                module_id: blog.module_id || "",
                title: blog.title || "",
                short_description: blog.short_description || "",
                status: blog.status || "active",
                banner_img: blog.banner_img || null,
                bannerFile: null,
                sections: blog.sections?.length
                    ? blog.sections.map((s) => ({
                        type: s.type || "text",
                        title: s.title || "",
                        text_content: s.text_content || "",
                        image_url: s.image_url || null,
                        imageFile: null,
                        status: s.status || "active",
                    }))
                    : [{ ...initialSection }],
            });
        }
    }, [blog]);

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

    function handleBannerImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            setForm((current) => ({
                ...current,
                bannerFile: file,
                banner_img: URL.createObjectURL(file),
            }));
        }
    }

    function handleSectionImageChange(index, event) {
        const file = event.target.files[0];
        if (file) {
            setForm((current) => {
                const sections = [...current.sections];
                sections[index] = {
                    ...sections[index],
                    imageFile: file,
                    image_url: URL.createObjectURL(file),
                };
                return { ...current, sections };
            });
        }
    }

    function removeBannerImage() {
        setForm((current) => ({
            ...current,
            bannerFile: null,
            banner_img: null,
        }));
    }

    function removeSectionImage(index) {
        setForm((current) => {
            const sections = [...current.sections];
            sections[index] = {
                ...sections[index],
                imageFile: null,
                image_url: null,
            };
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

        if (!form.title) {
            setError("Please enter a title.");
            return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("module_id", form.module_id);
        formData.append("title", form.title);
        formData.append("status", form.status);
        
        if (form.short_description) {
            formData.append("short_description", form.short_description);
        }

        if (form.bannerFile) {
            formData.append("banner_img", form.bannerFile);
        }

        // Append sections with their images
        form.sections.forEach((section, index) => {
            formData.append(`sections[${index}][type]`, section.type);
            formData.append(`sections[${index}][title]`, section.title || "");
            formData.append(`sections[${index}][text_content]`, section.text_content || "");
            formData.append(`sections[${index}][status]`, section.status);
            
            if (section.imageFile) {
                formData.append(`sections[${index}][image_url]`, section.imageFile);
            }
        });

        try {
            await updateBlog({ id, body: formData }).unwrap();
            setSuccess("Blog updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/blogs`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to update blog."));
        }
    }

    if (fetching) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-medium">Retrieving blog...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/blogs`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Blogs
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <FilePenLine size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Blog Update ID: {id}</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit Blog</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Update the blog title, module, short description, and content sections.
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
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                placeholder="e.g., IELTS Reading Strategies"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Short Description (optional)</label>
                            <textarea
                                value={form.short_description}
                                onChange={(event) => updateField("short_description", event.target.value)}
                                placeholder="Brief description of the blog post..."
                                rows={3}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Banner Image (optional)</label>
                            <div className="space-y-3">
                                {form.banner_img ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={form.banner_img.startsWith('http') ? form.banner_img : `http://127.0.0.1:8000/${form.banner_img}`}
                                            alt="Banner preview"
                                            className="h-32 w-auto rounded-lg object-cover border border-slate-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeBannerImage}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Remove image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerImageChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-2xl text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                                            <Upload size={16} />
                                            Upload Banner Image
                                        </div>
                                    </label>
                                )}
                            </div>
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
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Section Type</label>
                                        <select
                                            value={section.type}
                                            onChange={(event) => updateSection(index, "type", event.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        >
                                            <option value="text">Text</option>
                                            <option value="image">Image</option>
                                        </select>
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

                                    {section.type === "text" && (
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Content</label>
                                            <TextEditor
                                                value={section.text_content}
                                                onChange={(html) => updateSection(index, "text_content", html)}
                                                placeholder="Write your content here..."
                                            />
                                        </div>
                                    )}

                                    {section.type === "image" && (
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Section Image</label>
                                            <div className="space-y-3">
                                                {section.image_url ? (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={section.image_url.startsWith('http') ? section.image_url : `http://127.0.0.1:8000/${section.image_url}`}
                                                            alt="Section preview"
                                                            className="h-24 w-auto rounded-lg object-cover border border-slate-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSectionImage(index)}
                                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                            title="Remove image"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(event) => handleSectionImageChange(index, event)}
                                                            className="hidden"
                                                        />
                                                        <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                                            <ImageIcon size={16} />
                                                            Upload Section Image
                                                        </div>
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status</label>
                                        <select
                                            value={section.status}
                                            onChange={(event) => updateSection(index, "status", event.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
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
                        {saving ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
}