"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BookOpen, FileText, Layers, Loader2, Clock, ArrowRight } from "lucide-react";
import { useGetFrontendBlogsQuery } from "../../../redux/features/blog/frontend/blogApi";
import { useGetModulesQuery } from "../../../redux/features/common/frontend/commonApis";

const iconMap = {
    listening: BookOpen,
    reading: BookOpen,
    writing: FileText,
    speaking: BookOpen,
};

// Category -> badge color + tag chip color, keyed by slugified module name.
// Falls back to a neutral gray for anything unrecognized ("General", etc).
const CATEGORY_STYLES = {
    listening: { badge: "bg-amber-400 text-gray-900", dot: "bg-amber-400" },
    reading: { badge: "bg-emerald-500 text-white", dot: "bg-emerald-500" },
    writing: { badge: "bg-[#ff40a4] text-white", dot: "bg-[#ff40a4]" },
    speaking: { badge: "bg-violet-500 text-white", dot: "bg-violet-500" },
    general: { badge: "bg-gray-400 text-white", dot: "bg-gray-400" },
};

function normalize(value) {
    return String(value || "").toLowerCase();
}

function slugify(value) {
    return normalize(value)
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function formatLabel(value, fallback = "General") {
    if (!value) return fallback;
    return String(value)
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getCategoryStyle(label) {
    const key = slugify(label);
    return CATEGORY_STYLES[key] || CATEGORY_STYLES.general;
}

function getInitials(name) {
    if (!name) return "IE";
    const parts = String(name).trim().split(/\s+/);
    return parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

function getBlogsFromResponse(data) {
    const payload = data?.data;
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    return [];
}

function getModulesFromResponse(data) {
    const payload = data?.data;
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    if (Array.isArray(data)) {
        return data;
    }
    return [];
}

// Small reusable author row: avatar (image or initials), name, role.
function AuthorTag({ author, size = "sm" }) {
    const name = author?.name || "IELTS Expert";
    const role = author?.role || author?.designation || "IELTS Contributor";
    const avatarSrc = author?.avatar || author?.image;

    const avatarClasses =
        size === "lg"
            ? "w-9 h-9 text-sm"
            : "w-7 h-7 text-[11px]";

    return (
        <div className="flex items-center gap-2 min-w-0">
            {avatarSrc ? (
                <img
                    src={avatarSrc}
                    alt={name}
                    className={`${avatarClasses} rounded-full object-cover flex-shrink-0 border border-gray-100`}
                />
            ) : (
                <div
                    className={`${avatarClasses} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#ff40a4] to-[#ff8fc8]`}
                >
                    {getInitials(name)}
                </div>
            )}
            <div className="min-w-0 leading-tight">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{name}</p>
                {size === "lg" && (
                    <p className="text-[11px] sm:text-xs text-gray-400 truncate">{role}</p>
                )}
            </div>
        </div>
    );
}

// Component for displaying blogs
const BlogPage = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Fetch dynamic modules for the tabs
    const { data: modulesResponse } = useGetModulesQuery();

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Build filters
    const filters = useMemo(() => ({
        module_id: activeTab === "all" ? undefined : activeTab,
        search: debouncedSearch || undefined,
    }), [activeTab, debouncedSearch]);

    // Fetch blogs using RTK Query
    const { data, isLoading, isError } = useGetFrontendBlogsQuery(filters);

    const blogs = useMemo(() => getBlogsFromResponse(data), [data]);
    const modules = useMemo(() => getModulesFromResponse(modulesResponse), [modulesResponse]);

    // Build tabs from modules
    const tabs = useMemo(() => {
        const allTab = { id: "all", label: "All", icon: BookOpen };
        const moduleTabs = modules.map((m) => ({
            id: String(m.id),
            label: m.title || m.name || "Module",
            icon: iconMap[slugify(m.slug || m.title || m.name)] || BookOpen,
        }));
        return [allTab, ...moduleTabs, { id: "general", label: "General", icon: Layers }];
    }, [modules]);

    const featured = blogs[0];
    const restBlogs = blogs.slice(1);

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-16">
            {/* 1. HEADER HERO SECTION */}
            <header
                className="relative z-10 overflow-hidden text-white text-center py-20 px-6 sm:px-8"
                style={{
                    background: "linear-gradient(135deg, #FF0080 0%, #FF1984 7.14%, #FF2689 14.29%, #FF308D 21.43%, #FF3992 28.57%, #FF4096 35.71%, #FF479B 42.86%, #FF4D9F 50%, #FF56A3 57.14%, #FF5DA7 64.29%, #FF65AB 71.43%, #FF6CAF 78.57%, #FF73B4 85.71%, #FF7AB8 92.86%, #FF80BC 100%)"
                }}
            >

                {/* Ambient Background Lights for Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.05),transparent_50%)] pointer-events-none" />

                {/* Content Container */}
                <div className="relative max-w-3xl mx-auto flex flex-col items-center justify-center">

                    {/* Heading with drop-shadow for premium readability */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] select-none">
                        Tips, Strategies & Guides
                    </h1>

                    {/* Subtitle with high legibility */}
                    <p className="text-white/95 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        Actionable insights from Band 9 scorers and IELTS examiners to get you to your target score faster.
                    </p>

                    {/* Decorative Minimalist Sparkle Icon */}
                    <div className="absolute right-[-40px] bottom-[-20px] hidden md:block opacity-40 animate-pulse">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                        </svg>
                    </div>

                </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-10">
                {/* 2. */}
                <div className="flex flex-wrap gap-2 justify-start sm:justify-center mb-12">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={isActive ? { backgroundColor: "#ff40a4", color: "white" } : {}}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <p className="text-sm font-medium">Loading blogs...</p>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="px-6 py-16 text-center text-rose-500 text-sm font-medium">
                        Error loading blogs. Please try again later.
                    </div>
                )}

                {/* Blog Grid */}
                {!isLoading && !isError && (
                    <>
                        {/* 3. FEATURED ARTICLE SECTION - Show first blog as featured */}
                        {featured && (() => {
                            const moduleLabel = featured.module?.title || "General";
                            const style = getCategoryStyle(moduleLabel);
                            const tags = [
                                moduleLabel,
                                ...(Array.isArray(featured.tags) ? featured.tags : []),
                            ]
                                .filter(Boolean)
                                .slice(0, 5);
                            const readMinutes = featured.sections?.length || featured.read_time || 5;

                            return (
                                <section className="mb-16">
                                    <div className="relative flex items-center justify-center my-6">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative bg-gray-50 px-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Featured Article</span>
                                        </div>
                                    </div>

                                    {/* Featured Card Container */}
                                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0">
                                        {/* Image Area */}
                                        <div className="relative lg:col-span-6 h-64 sm:h-80 lg:h-full min-h-[340px]">
                                            {featured.banner_img ? (
                                                <img
                                                    src={featured.banner_img.startsWith("http")
                                                        ? featured.banner_img
                                                        : `http://127.0.0.1:8000/${featured.banner_img}`}
                                                    alt={featured.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                                                    alt="Student studying"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}
                                            <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${style.badge}`}>
                                                {formatLabel(moduleLabel)}
                                            </span>
                                        </div>

                                        {/* Content Area */}
                                        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                                            <div>
                                                {/* Article Tags */}
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {tags.map((tag, idx) => (
                                                        <span
                                                            key={`${tag}-${idx}`}
                                                            className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200"
                                                        >
                                                            #{formatLabel(tag)}
                                                        </span>
                                                    ))}
                                                </div>

                                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-4 hover:text-[#ff40a4] cursor-pointer transition-colors">
                                                    {featured.title}
                                                </h2>
                                                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                                                    {featured.short_description || "No description available."}
                                                </p>
                                            </div>

                                            {/* Author + Meta + Action Row */}
                                            <div>
                                                <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
                                                    <AuthorTag author={featured.author} size="lg" />
                                                    <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                                                        <Clock size={14} />
                                                        <span>{readMinutes} min read</span>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/blogs/details/${featured.id}`}
                                                    className="inline-flex items-center text-sm font-bold text-[#ff40a4] hover:text-[#e03090] transition-colors group"
                                                >
                                                    Read Full Article
                                                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })()}

                        {/* 4. ALL ARTICLES GRID */}
                        <section>
                            <div className="relative flex items-center justify-center my-6 mb-8">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative bg-gray-50 px-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        All Articles · {blogs.length} Posts
                                    </span>
                                </div>
                            </div>

                            {/* Responsive Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {restBlogs.map((blog) => {
                                    const moduleLabel = blog.module?.title || "General";
                                    const style = getCategoryStyle(moduleLabel);
                                    const readMinutes = blog.sections?.length || blog.read_time || 5;

                                    return (
                                        <article
                                            key={blog.id}
                                            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                                        >
                                            <div>
                                                <div className="relative h-48 sm:h-52 w-full">
                                                    {blog.banner_img ? (
                                                        <img
                                                            src={blog.banner_img.startsWith("http")
                                                                ? blog.banner_img
                                                                : `http://127.0.0.1:8000/${blog.banner_img}`}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80"
                                                            alt="Blog"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                    <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${style.badge}`}>
                                                        {formatLabel(moduleLabel)}
                                                    </span>
                                                </div>
                                                <div className="p-5 sm:p-6">
                                                    <div className="flex items-center text-xs text-gray-400 gap-1.5 mb-3">
                                                        <span>{new Date(blog.created_at).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        })}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {readMinutes} min read
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-[#ff40a4] transition-colors line-clamp-2">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                                        {blog.short_description || "No description available."}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Footer: Author on the left, arrow action on the right */}
                                            <div className="flex items-center justify-between px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
                                                <AuthorTag author={blog.author} size="sm" />
                                                <Link
                                                    href={`/blogs/details/${blog.id}`}
                                                    aria-label="Read more"
                                                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 group-hover:bg-[#ff40a4] group-hover:text-white transition-colors"
                                                >
                                                    <ArrowRight size={15} />
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default BlogPage;