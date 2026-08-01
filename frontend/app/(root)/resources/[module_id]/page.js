"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  SlidersHorizontal,
  ArrowUpDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useGetFrontendResourcesQuery } from "../../../../redux/features/resource/frontend/resourceApi";
import { useGetModulesQuery } from "../../../../redux/features/common/frontend/commonApis";

const iconMap = {
  listening: BookOpen,
  reading: BookOpen,
  writing: FileText,
  speaking: BookOpen,
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

function getResourcesFromResponse(data) {
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

function getMetaFromResponse(data) {
  const payload = data?.data;
  return payload && !Array.isArray(payload) ? payload : {};
}

// Component for displaying resources
const ResourcePage = () => {
  const params = useParams();
  const router = useRouter();
  const routeModuleId = decodeURIComponent(params?.module_id || "");
  const [activeTab, setActiveTab] = useState(routeModuleId);

const [filters, setFilters] = useState({
    module_id: routeModuleId,
    search: "",
    per_page: 10,
    page: 1,
  });

  // State for search input value (debounced)
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Fetch dynamic modules for the tabs
  const { data: modulesResponse } = useGetModulesQuery();

  const tabs = useMemo(() => {
    const modules = getModulesFromResponse(modulesResponse);
    return modules.map((m) => ({
      id: String(m.id),
      moduleId: m.id,
      slug: m.slug || slugify(m.title),
      label: m.title || m.name || "Module",
      href: `/resources/${m.id}`,
      icon: iconMap[slugify(m.slug || m.title || m.name)] || BookOpen,
    }));
  }, [modulesResponse]);

  const selectedTab = useMemo(() => {
    if (!tabs.length) return null;

    return (
      tabs.find((tab) => String(tab.moduleId) === String(routeModuleId)) ||
      tabs.find((tab) => tab.slug === slugify(routeModuleId)) ||
      tabs[0]
    );
  }, [tabs, routeModuleId]);

useEffect(() => {
    if (!selectedTab) return;

    setActiveTab(selectedTab.id);
    setFilters((prev) => ({
      ...prev,
      module_id: selectedTab.moduleId,
      page: String(prev.module_id) === String(selectedTab.moduleId) ? prev.page : 1,
    }));
  }, [selectedTab]);

  // Fetch resources using RTK Query
  const { data, isLoading, isError } = useGetFrontendResourcesQuery(filters);

  const resources = useMemo(() => getResourcesFromResponse(data), [data]);
  const meta = useMemo(() => getMetaFromResponse(data), [data]);

  const activeModuleId = useMemo(() => {
    return tabs.find((t) => t.id === activeTab)?.moduleId;
  }, [tabs, activeTab]);

  const filteredResources = useMemo(() => {
    if (!activeModuleId) return resources;
    return resources.filter((resource) => {
      const selectedTab = tabs.find((t) => t.id === activeTab);
      return resource.module?.title === selectedTab?.label;
    });
  }, [resources, activeModuleId, activeTab, tabs]);

  // Effect to debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

// Handle tab change
  const handleTabChange = (tabId) => {
    const selectedModule = tabs.find((t) => t.id === tabId);
    if (!selectedModule) return;

    setActiveTab(selectedModule.id);
    setFilters((prev) => ({
      ...prev,
      module_id: selectedModule.moduleId,
      page: 1,
    }));
    router.push(selectedModule.href);
  };

  // Handle search input change (updates local searchTerm state)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (meta.last_page || 1)) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  return (
    <main className="bg-[#f4f6fa] min-h-screen font-sans antialiased pb-20">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#db2777] text-white text-center pt-16 pb-36 px-4">
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full mb-4 border border-white/10">
          <span className="text-amber-300">★</span>
          Learning Resources —
          <span className="opacity-90">
            Free Study Materials
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          IELTS Learning Resources
        </h1>

        <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
          Access comprehensive study materials and strategy guides for all IELTS
          modules.
          <br className="hidden sm:inline" />
          Click any resource to view detailed content and sections.
        </p>
      </div>

      {/* Card Container */}
      <div className="max-w-5xl mx-auto px-4 -mt-24">
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/40 border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex flex-wrap items-center border-b border-slate-100 bg-white px-4 pt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm transition-all duration-200 ${
                    isActive
                      ? "font-semibold border-b-2 border-[#b91c1c] text-[#b91c1c]"
                      : "font-medium text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Controls */}
          <div className="p-5 flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-50 bg-white">
            <div className="w-full sm:max-w-md relative">
              <input
                type="text"
                placeholder="Search by topic"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-4 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>

              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort</span>
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="px-6 py-3 bg-white flex justify-between items-center border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resources
            </span>

            <span className="text-xs text-slate-400 font-medium">
              {meta.total
                ? `Showing ${meta.from || 0}-${meta.to || 0} of ${
                    meta.total
                  } results`
                : "No results"}
            </span>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2
                  className="animate-spin text-indigo-600"
                  size={32}
                />
                <p className="text-sm font-medium">
                  Loading resources...
                </p>
              </div>
            ) : isError ? (
              <div className="px-6 py-16 text-center text-rose-500 text-sm font-medium">
                Error loading resources. Please try again later.
              </div>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((resource, idx) => (
                <Link
                  href={`/resources/details/${resource.id}`}
                  key={resource.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 w-5">
                      {(filters.page - 1) * filters.per_page + idx + 1}.
                    </span>

                    <div>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {resource.topic}
                      </span>

                      {resource.module?.title && (
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          {resource.module.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      resource.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-50 text-slate-600"
                    }`}>
                      {resource.status === "active" ? "Active" : "Draft"}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <FileText className="w-3.5 h-3.5" />
                      {resource.sections?.length || 0} sections
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-16 text-center text-slate-400 text-sm italic">
                No resources found for "
                {tabs.find((t) => t.id === activeTab)?.label}".
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="py-6 border-t border-slate-100 flex justify-center items-center bg-white">
              <nav className="inline-flex items-center -space-x-px gap-1">
                <button
                  onClick={() =>
                    handlePageChange(filters.page - 1)
                  }
                  disabled={filters.page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(meta.last_page)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                      filters.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(filters.page + 1)
                  }
                  disabled={filters.page === meta.last_page}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ResourcePage;