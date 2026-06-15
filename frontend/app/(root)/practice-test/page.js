"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  FileText,
  Book,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useGetPracticeTestsQuery } from "../../../redux/features/practice-test/frontend/practiceTestApis";
import { useGetModulesQuery } from "../../../redux/features/common/frontend/commonApis";

const iconMap = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
  grammar: FileText,
  vocabulary: Book,
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function formatLabel(value, fallback = "General") {
  if (!value) return fallback;
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSectionKey(section, test) {
  return section?.id || `${test.id || test.slug}-${section?.module?.id || section?.title || "general"}`;
}

function getSectionHref(test, section) {
  const baseHref = `/student/practice/${test.slug || test.id}`;
  return section?.id ? `${baseHref}?section_id=${section.id}` : baseHref;
}

function normalizeSection(test) {
  const fallbackModule = test.modules?.[0] || test.question_modules?.[0] || null;
  return {
    id: null,
    title: fallbackModule?.title || formatLabel(test.category, "Practice"),
    module: fallbackModule,
    total_questions: test.practice_test_questions_count || test.total_questions || 0,
  };
}

function getTestSections(test) {
  return Array.isArray(test.sections) && test.sections.length ? test.sections : [normalizeSection(test)];
}

function buildModuleGroups(tests) {
  const groupMap = new Map();

  tests.forEach((test) => {
    getTestSections(test).forEach((section) => {
      const moduleTitle = section?.module?.title || section?.title || formatLabel(test.category, "General");
      const moduleId = section?.module?.id || moduleTitle;

      if (!groupMap.has(moduleId)) {
        groupMap.set(moduleId, {
          id: moduleId,
          title: moduleTitle,
          sections: [],
        });
      }

      groupMap.get(moduleId).sections.push({ test, section });
    });
  });

  return Array.from(groupMap.values());
}

function getPracticeTestsFromResponse(data) {
  const payload = data?.data;
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
}

// Component for displaying practice tests
const PracticeTestPage = () => {
  const [activeTab, setActiveTab] = useState("reading");

  const [filters, setFilters] = useState({
    category: "reading",
    question_type: "",
    type: "",
    search: "",
    module_id: "",
    per_page: 10,
    page: 1,
    paginate: true,
  });

  const questionTypes = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  // State for search input value (debounced)
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Fetch dynamic modules for the tabs
  const { data: modulesResponse } = useGetModulesQuery();

  const tabs = useMemo(() => {
    const modules = modulesResponse?.data || (Array.isArray(modulesResponse) ? modulesResponse : []);
    return modules.map((m) => ({
      id: m.slug || String(m.id),
      moduleId: m.id,
      label: m.title,
      icon: iconMap[m.slug?.toLowerCase()] || Book,
    }));
  }, [modulesResponse]);

  // Fetch practice tests using RTK Query
  const { data, isLoading, isError } =
    useGetPracticeTestsQuery(filters);

  const practiceTests = useMemo(() => getPracticeTestsFromResponse(data), [data]);
  const meta = data?.meta || {};

  const moduleGroups = useMemo(() => buildModuleGroups(practiceTests), [practiceTests]);

  const activeModuleId = useMemo(() => {
    return tabs.find((t) => t.id === activeTab)?.moduleId;
  }, [tabs, activeTab]);

  const filteredGroups = useMemo(() => {
    if (!activeModuleId) return moduleGroups;
    return moduleGroups.filter((group) => {
      // Filter by matching numeric module ID or fallback to matching slug/title
      const selectedTab = tabs.find((t) => t.id === activeTab);
      return String(group.id) === String(activeModuleId) || group.title === selectedTab?.label;
    });
  }, [moduleGroups, activeModuleId, activeTab, tabs]);

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
    setActiveTab(tabId);
    const selectedModule = tabs.find(t => t.id === tabId);
    setFilters((prev) => ({
      ...prev,
      category: tabId,
      module_id: selectedModule?.moduleId || "",
      page: 1,
    }));
  };

  // Handle question type change
  const handleQuestionTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      question_type: type,
      page: 1,
    }));
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

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-600 fill-emerald-600";

      case "hard":
        return "text-rose-600 fill-rose-600";

      default:
        return "text-orange-500 fill-orange-500";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty
      ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      : "Medium";
  };

  return (
    <main className="bg-[#f4f6fa] min-h-screen font-sans antialiased pb-20">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#db2777] text-white text-center pt-16 pb-36 px-4">
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full mb-4 border border-white/10">
          <span className="text-amber-300">★</span>
          Free Practice Tests —
          <span className="opacity-90">
            No Credit Card Required
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Free IELTS Practice Tests
        </h1>

        <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
          Practice with real exam-style question sets across all IELTS
          modules.
          <br className="hidden sm:inline" />
          Click any test to start — login required to view your score.
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
                placeholder="Search by title"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-4 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="relative">
                <select
                  value={filters.question_type}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className="appearance-none flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white pr-8 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Question Type</option>
                  {Object.entries(questionTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Original Filters and Sort buttons - kept for context, assuming they might be implemented later */}
              {/*
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort</span>
              </button>
              */}
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
              Question Sets
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
                  Loading practice tests...
                </p>
              </div>
            ) : isError ? (
              <div className="px-6 py-16 text-center text-rose-500 text-sm font-medium">
                Error loading practice tests. Please try again later.
              </div>
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <React.Fragment key={group.id}>
                  {filteredGroups.length > 1 && (
                    <div className="bg-slate-50/50 px-6 py-2 border-b border-slate-100">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</h3>
                    </div>
                  )}
                  <div className="divide-y divide-slate-100">
                    {group.sections.map(({ test, section }, idx) => (
                      <Link
                        href={getSectionHref(test, section)}
                        key={getSectionKey(section, test)}
                        className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-400 w-5">
                            {(filters.page - 1) * filters.per_page + idx + 1}.
                          </span>

                          <div>
                            <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {test.title}
                            </span>

                            {(section.title || test.category) && (
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                {section.title || formatLabel(test.category)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                            {test.type === "paid" ? "Pro Access" : "Free Scoring"}
                          </span>

                          <div
                            className={`flex items-center gap-1 text-xs font-semibold w-20 justify-start ${getDifficultyStyles(
                              test.difficulty
                            )}`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            {getDifficultyLabel(test.difficulty)}
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="px-6 py-16 text-center text-slate-400 text-sm italic">
                No practice tests found for "
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

export default PracticeTestPage;