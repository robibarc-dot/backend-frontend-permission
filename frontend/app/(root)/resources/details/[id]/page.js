"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Clock, Tag, Calendar } from "lucide-react";
import { useGetFrontendResourceQuery } from "../../../../../redux/features/resource/frontend/resourceApi";

// Helper function to get module icon
const getModuleIcon = (moduleTitle) => {
    const title = moduleTitle ? moduleTitle.toLowerCase() : "";
    
    if (title.includes("read")) return <BookOpen className="w-4 h-4" />;
    if (title.includes("writ")) return <BookOpen className="w-4 h-4" />;
    if (title.includes("listen")) return <BookOpen className="w-4 h-4" />;
    if (title.includes("speak")) return <BookOpen className="w-4 h-4" />;
    
    return <BookOpen className="w-4 h-4" />;
};

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Resource Detail Page Component
const ResourceDetailPage = () => {
    const params = useParams();
    const resourceId = params?.id || "";

    // Fetch single resource with sections
    const { data, isLoading, isError } = useGetFrontendResourceQuery(resourceId, {
        skip: !resourceId,
    });

    const resource = useMemo(() => {
        const payload = data?.data;
        return payload || data || null;
    }, [data]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading resource...</p>
                </div>
            </div>
        );
    }

    if (isError || !resource) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans flex items-center justify-center">
                <div className="text-center">
                    <p className="text-rose-500 text-lg font-medium">
                        {isError ? "Error loading resource" : "Resource not found"}
                    </p>
                </div>
            </div>
        );
    }

    const sections = resource.sections || [];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans">
            {/* 1. Hero Section with Gradient Image Overlay */}
            <div 
                className="relative w-full h-[400px] md:h-[480px] bg-cover bg-center"
                style={{
                    backgroundImage: resource.image 
                        ? `url(${resource.image})` 
                        : "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600')"
                }}
            >
                {/* Teal/Green Gradient Overlay matching the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-700/80 via-teal-600/80 to-emerald-600/70 mix-blend-multiply"></div>
                
                {/* Hero Content Container */}
                <div className="relative max-w-6xl mx-auto h-full px-6 flex flex-col justify-end pb-12 text-white">
                    {/* Category Badge */}
                    <span className="inline-block w-max bg-white/20 backdrop-blur-sm text-white uppercase text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">
                        {resource.module?.title || "General"}
                    </span>
                    
                    {/* Main Title */}
                    <h1 className="text-3xl md:text-5xl font-extrabold max-w-4xl leading-tight mb-8">
                        {resource.topic || "Resource Title"}
                    </h1>
                    
                    {/* Meta Information Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-teal-50/90 font-medium">
                        {resource.author && (
                            <div className="flex items-center gap-3">
                                {/* Dummy Avatar representing the author profile */}
                                <div className="w-10 h-10 rounded-full border-2 border-teal-300 bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 overflow-hidden">
                                    {resource.author.name?.charAt(0) || "A"}
                                </div>
                                <div>
                                    <p className="font-bold text-white leading-none">{resource.author.name || "Author"}</p>
                                    <p className="text-xs text-teal-200">{resource.author.experience ? `${resource.author.experience} yrs` : "Expert"}</p>
                                </div>
                            </div>
                        )}
                        {resource.author && <span className="text-teal-300 hidden sm:inline">•</span>}
                        <p className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-teal-300" />
                            {formatDate(resource.created_at)}
                        </p>
                        <span className="text-teal-300">•</span>
                        <p className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-teal-300" />
                            {sections.length} sections
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid Matrix Layout */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    
                    {/* Left Side: Main Article Elements */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Left-Bordered Pull Quote Block */}
                        {resource.description && (
                            <blockquote className="border-l-4 border-pink-500 pl-4 py-1 text-lg italic text-gray-600 font-medium leading-relaxed bg-white/50 rounded-r shadow-sm">
                                {resource.description}
                            </blockquote>
                        )}

                        {/* Sections Content */}
                        {sections.length > 0 ? (
                            sections.map((section, index) => (
                                <div key={section.id} className="pt-4">
                                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
                                        {index + 1}. {section.title}
                                    </h2>
                                    
                                    {/* Section Image */}
                                    {section.image_url && (
                                        <div className="mb-4">
                                            <img 
                                                src={section.image_url} 
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
                                No sections available for this resource.
                            </p>
                        )}
                    </div>

                    {/* Right Side: Sticky Sidebar Components */}
                    <div className="space-y-6 lg:sticky lg:top-6">
                        
                        {/* Table of Contents Container Card */}
                        {sections.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-wider mb-6">
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

                        {/* Tag List Registry Card */}
                        {resource.tags && resource.tags.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-wider mb-4">
                                    <Tag className="w-4 h-4" />
                                    Tags
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resource.tags.map((tag) => (
                                        <span 
                                            key={tag.id || tag}
                                            className="bg-pink-50 hover:bg-pink-100 text-pink-600 text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                                        >
                                            #{typeof tag === "string" ? tag : tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
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
                .prose-content a { color: #3b82f6; text-decoration: underline; }
                .prose-content blockquote { border-left: 3px solid #3b82f6; padding-left: 1rem; font-style: italic; }
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

export default ResourceDetailPage;