"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Clock, Calendar, ArrowLeft, ChevronRight } from "lucide-react";
import { useGetFrontendBlogQuery } from "../../../redux/features/blog/frontend/blogApi";

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Helper to get full image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000/${imagePath}`;
};

function getInitials(name) {
    if (!name) return "IE";
    const parts = String(name).trim().split(/\s+/);
    return parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

// Blog Detail Page Component
const BlogDetailPage = () => {
    const params = useParams();
    const blogId = params?.id || "";

    // Fetch single blog with sections
    const { data, isLoading, isError } = useGetFrontendBlogQuery(blogId, {
        skip: !blogId,
    });

    const blog = useMemo(() => {
        const payload = data?.data;
        return payload || data || null;
    }, [data]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog...</p>
                </div>
            </div>
        );
    }

    if (isError || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans flex items-center justify-center">
                <div className="text-center">
                    <p className="text-rose-500 text-lg font-medium">
                        {isError ? "Error loading blog" : "Blog not found"}
                    </p>
                </div>
            </div>
        );
    }

    const sections = blog.sections || [];
    const author = blog.author || {};

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans">
            {/* 1. Hero Section with Pink Gradient + Image Overlay */}
            <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
                {/* Pink Gradient Background */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(135deg, #FF0080 0%, #FF1984 7.14%, #FF2689 14.29%, #FF308D 21.43%, #FF3992 28.57%, #FF4096 35.71%, #FF479B 42.86%, #FF4D9F 50%, #FF56A3 57.14%, #FF5DA7 64.29%, #FF65AB 71.43%, #FF6CAF 78.57%, #FF73B4 85.71%, #FF7AB8 92.86%, #FF80BC 100%)"
                    }}
                />
                
                {/* Background Image with blend */}
                {blog.banner_img && (
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url(${getImageUrl(blog.banner_img)})` }}
                    />
                )}

                {/* Ambient Background Lights */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.05),transparent_50%)] pointer-events-none" />

                {/* Back Navigation */}
                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8">
                    <Link 
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blogs
                    </Link>
                </div>

                {/* Hero Content Container */}
                <div className="relative z-10 max-w-6xl mx-auto h-full px-6 flex flex-col justify-end pb-12 text-white">
                    {/* Category Badge */}
                    <span 
                        className="inline-block w-max text-white uppercase text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wider"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
                    >
                        {blog.module?.title || "General"}
                    </span>

                    {/* Main Title */}
                    <h1 className="text-3xl md:text-5xl font-extrabold max-w-4xl leading-tight mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                        {blog.title || "Blog Title"}
                    </h1>

                    {/* Meta Information Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/90 font-medium">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                                style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                            >
                                {getInitials(author.name || author.author_name)}
                            </div>
                            <span>{author.name || author.author_name || "IELTS Expert"}</span>
                        </div>
                        <span className="text-white/50">•</span>
                        <p className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(blog.created_at)}
                        </p>
                        <span className="text-white/50">•</span>
                        <p className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {sections.length > 0 ? `${sections.length} sections` : `${blog.read_time || 5} min read`}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid Layout */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Left Side: Main Article Elements */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-sm text-gray-400">
                            <Link href="/blogs" className="hover:text-pink-500 transition-colors">Blogs</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-gray-600 truncate">{blog.title}</span>
                        </nav>

                        {/* Left-Bordered Pull Quote Block */}
                        {blog.short_description && (
                            <blockquote 
                                className="border-l-4 pl-4 py-1 text-lg italic text-gray-600 font-medium leading-relaxed bg-white/50 rounded-r shadow-sm"
                                style={{ borderColor: "#ff40a4" }}
                            >
                                {blog.short_description}
                            </blockquote>
                        )}

                        {/* Sections Content */}
                        {sections.length > 0 ? (
                            sections.map((section, index) => (
                                <div key={section.id} className="pt-4">
                                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4" style={{ borderColor: "#f0f0f0" }}>
                                        {index + 1}. {section.title}
                                    </h2>

                                    {/* Section Image */}
                                    {section.image_url && (
                                        <div className="mb-4">
                                            <img 
                                                src={getImageUrl(section.image_url)} 
                                                alt={section.title}
                                                className="w-full h-auto rounded-lg shadow-md max-h-96 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Section Text Content */}
                                    <div 
                                        className="prose-content text-gray-600 leading-relaxed text-base"
                                        dangerouslySetInnerHTML={{ __html: section.text_content || "Content coming soon..." }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 leading-relaxed text-base">
                                No sections available for this blog.
                            </p>
                        )}
                    </div>

                    {/* Right Side: Sticky Sidebar Components */}
                    <div className="space-y-6 lg:sticky lg:top-6">

                        {/* Table of Contents Container Card */}
                        {sections.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-6" style={{ color: "#ff40a4" }}>
                                    <BookOpen className="w-4 h-4" />
                                    Table of Contents
                                </div>

                                <ul className="space-y-4 text-xs font-semibold text-gray-600">
                                    {sections.map((section, index) => (
                                        <li 
                                            key={section.id}
                                            className="flex gap-2 items-start hover:text-pink-500 transition-colors cursor-pointer"
                                        >
                                            <span className="text-gray-300 font-mono text-[10px] mt-0.5">
                                                {String(index + 1).padStart(2, "0")}.
                                            </span>
                                            <span>{section.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Author Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #ff40a4, #ff8fc8)" }}
                                >
                                    {getInitials(author.name || author.author_name)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{author.name || author.author_name || "IELTS Expert"}</p>
                                    <p className="text-xs text-gray-400">{author.role || author.designation || "IELTS Contributor"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prose Styles for Text Content */}
            <style jsx>{`
                .prose-content h1 { font-size: 1.5rem; font-weight: 700; margin: 0.75rem 0; }
                .prose-content h2 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0; }
                .prose-content h3 { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; }
                .prose-content p { margin: 0.5rem 0; line-height: 1.6; }
                .prose-content ul, .prose-content ol { padding-left: 1.5rem; margin: 0.5rem 0; }
                .prose-content li { margin: 0.25rem 0; }
                .prose-content a { color: #ff40a4; text-decoration: underline; }
                .prose-content blockquote { border-left: 3px solid #ff40a4; padding-left: 1rem; font-style: italic; }
                .prose-content pre { background: #1e293b; color: #e2e8f0; padding: 12px 16px; border-radius: 8px; overflow-x: auto; }
                .prose-content code { background: #f1f5f9; color: #dc2626; padding: 2px 6px; border-radius: 4px; }
                .prose-content pre code { background: none; color: inherit; }
                .prose-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 0.5rem 0; }
                .prose-content table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; }
                .prose-content td, .prose-content th { border: 1px solid #e2e8f0; padding: 8px 12px; }
                .prose-content th { background: #f8fafc; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default BlogDetailPage;