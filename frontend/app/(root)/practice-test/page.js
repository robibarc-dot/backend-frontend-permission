'use client';

import React, { useState, useMemo } from 'react';
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
    ChevronRight 
} from 'lucide-react';

const tabs = [
    { id: 'listening', label: 'Listening', icon: Headphones },
    { id: 'reading', label: 'Reading', icon: BookOpen },
    { id: 'writing', label: 'Writing', icon: PenTool },
    { id: 'speaking', label: 'Speaking', icon: Mic },
    { id: 'grammar', label: 'Grammar', icon: FileText },
    { id: 'vocabulary', label: 'Vocabulary', icon: Book },
];

const practiceTestsData = [
    { id: 1, title: 'Ecological Role of Predatory Birds', category: 'reading', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 2, title: 'Importance of Handwriting Skills', category: 'reading', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 3, title: 'Football History from 1870', category: 'reading', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 4, title: "Planning a Cousins' Family Trip", category: 'listening', type: 'Free Scoring', difficulty: 'Easy' },
    { id: 5, title: 'Designing for All Users', category: 'writing', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 6, title: 'History of Theatre Programmes', category: 'reading', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 7, title: 'Excavating an Ancient Village', category: 'reading', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 8, title: 'Guide to Renting Furniture', category: 'listening', type: 'Free Scoring', difficulty: 'Easy' },
    { id: 9, title: 'The Influence of Food Trends', category: 'speaking', type: 'Free Scoring', difficulty: 'Medium' },
    { id: 10, title: 'Urban Wildlife Conservation', category: 'reading', type: 'Free Scoring', difficulty: 'Hard' },
];

export default function PracticeTestPage() {
    const [activeTab, setActiveTab] = useState('reading');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTests = useMemo(() => {
        return practiceTestsData.filter(test => {
            const matchesTab = test.category === activeTab;
            const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm]);

    const getDifficultyStyles = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-emerald-600 fill-emerald-600';
            case 'hard': return 'text-rose-600 fill-rose-600';
            default: return 'text-orange-500 fill-orange-500';
        }
    };

    return (
        <main className="bg-[#f4f6fa] min-h-screen font-sans antialiased pb-20">
            {/* Header Section */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#db2777] text-white text-center pt-16 pb-36 px-4">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full mb-4 border border-white/10">
                    <span className="text-amber-300">★</span> Free Practice Tests — <span className="opacity-90">No Credit Card Required</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                    Free IELTS Practice Tests
                </h1>
                <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Practice with real exam-style question sets across all IELTS modules.<br className="hidden sm:inline" />
                    Click any test to start — login required to view your score.
                </p>
            </div>

            {/* Overlapping Card Container */}
            <div className="max-w-5xl mx-auto px-4 -mt-24">
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/40 border border-slate-100 overflow-hidden">
                    
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap items-center border-b border-slate-100 bg-white px-4 pt-2">
                          {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button 
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                                    className={`flex items-center gap-2 px-5 py-3.5 text-sm transition-all duration-200 ${
                                        isActive 
                                            ? 'font-semibold border-b-2 border-[#b91c1c] text-[#b91c1c]' 
                                            : 'font-medium text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Controls & Search */}
                    <div className="p-5 flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-50 bg-white">
                        <div className="w-full sm:max-w-md relative">
                            <input 
                                type="text" 
                                placeholder="Search by title" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                                <span>Question Type</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
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

                    {/* List Header */}
                    <div className="px-6 py-3 bg-white flex justify-between items-center border-b border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Question Sets</span>
                        <span className="text-xs text-slate-400 font-medium">
                            {filteredTests.length > 0 ? `Showing ${filteredTests.length} results` : 'No results'}
                        </span>
                    </div>

                    {/* Practice Tests List */}
                    <div className="divide-y divide-slate-100 bg-white">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                                <Loader2 className="animate-spin text-indigo-600" size={32} />
                                <p className="text-sm font-medium">Loading practice tests...</p>
                            </div>
                        ) : isError ? (
                            <div className="px-6 py-16 text-center text-rose-500 text-sm font-medium">
                                Error loading practice tests. Please try again later.
                            </div>
                        ) : filteredTests.length > 0 ? filteredTests.map((test, index) => (
                            <Link 
                                href={`/student/practice/${test.slug}`} 
                                key={test.id} 
                                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-slate-400 w-5">{(currentPage - 1) * 10 + index + 1}.</span>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                            {test.title}
                                        </span>
                                        {test.category && <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{test.category}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                                        {test.type === 'paid' ? 'Pro Access' : 'Free Scoring'}
                                    </span>
                                    <div className={`flex items-center gap-1 text-xs font-semibold w-20 justify-start ${getDifficultyStyles(test.question_type)}`}>
                                        <Zap className="w-3.5 h-3.5" />
                                        {getDifficultyLabel(test.question_type)}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Link>
                        )) : (
                            <div className="px-6 py-16 text-center text-slate-400 text-sm italic">
                                No practice tests found for "{tabs.find(t => t.id === activeTab).label}".
                            </div>
                        )}
                    </div>

                    {/* Pagination Section */}
                    <div className="py-6 border-t border-slate-100 flex justify-center items-center bg-white">
                        <nav className="inline-flex items-center -space-x-px gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            <button className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-blue-600 text-white">
                                1
                            </button>
                            
                            <button className="w-8 h-8 flex items-center justify-center rounded text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                                2
                            </button>
                            
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
    );
}