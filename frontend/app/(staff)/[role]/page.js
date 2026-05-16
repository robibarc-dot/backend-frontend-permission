"use client";

export default function RoleDashboardPage() {
    return (
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                            <i className="fas fa-users"></i>
                        </div>
                        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-2xl font-bold">248</p>
                    <p className="text-xs text-gray-400">Total Students</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
                            <i className="fas fa-book-open"></i>
                        </div>
                        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+3</span>
                    </div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-gray-400">Active Courses</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+8%</span>
                    </div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-gray-400">Total Tests</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+2%</span>
                    </div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-xs text-gray-400">Avg. Score</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <div className="xl:col-span-2 space-y-8">
                    
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold">Recent Students</h3>
                            <a href="#" className="text-xs text-blue-600 font-semibold">View All</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Enrolled</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">Sarah Ahmed</div>
                                            <div className="text-[10px] text-gray-400">sarah@example.com</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">Pre A1 Starter</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-green-50 text-green-500 text-[10px] font-bold rounded">active</span></td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">2 days ago</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">Ali Rahman</div>
                                            <div className="text-[10px] text-gray-400">ali@example.com</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">A1 Movers</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-green-50 text-green-500 text-[10px] font-bold rounded">active</span></td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">3 days ago</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold mb-6">Course Performance</h3>
                        <div className="space-y-6">
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-gray-700">Pre A1 Starter</h4>
                                    <span className="text-[10px] text-gray-400">95 students</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div><p className="text-[10px] text-gray-400">Enrolled</p><p className="font-bold">95</p></div>
                                    <div><p className="text-[10px] text-gray-400">Completed</p><p className="font-bold">45</p></div>
                                    <div><p className="text-[10px] text-gray-400">Avg Score</p><p className="font-bold">87%</p></div>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[45%]"></div>
                                </div>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-gray-700">A1 Movers</h4>
                                    <span className="text-[10px] text-gray-400">82 students</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div><p className="text-[10px] text-gray-400">Enrolled</p><p className="font-bold">82</p></div>
                                    <div><p className="text-[10px] text-gray-400">Completed</p><p className="font-bold">38</p></div>
                                    <div><p className="text-[10px] text-gray-400">Avg Score</p><p className="font-bold">85%</p></div>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-purple-500 h-full w-[40%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold mb-4 text-sm">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition">
                                <i className="fas fa-user-plus"></i> Add New Student
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition">
                                <i className="fas fa-plus-square"></i> Create Course
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition">
                                <i className="fas fa-file-signature"></i> Create Assessment
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold mb-6 text-sm">Recent Activity</h3>
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                            <div className="relative pl-10">
                                <div className="absolute left-0 p-1.5 bg-green-50 text-green-500 rounded-full text-[10px] border-4 border-white"><i className="fas fa-check"></i></div>
                                <p className="text-xs font-bold">Sarah Ahmed <span className="font-normal text-gray-400">completed Grammar Test</span></p>
                                <p className="text-[10px] text-gray-400 mt-1">10 min ago</p>
                            </div>
                            <div className="relative pl-10">
                                <div className="absolute left-0 p-1.5 bg-blue-50 text-blue-500 rounded-full text-[10px] border-4 border-white"><i className="fas fa-user"></i></div>
                                <p className="text-xs font-bold">Ali Rahman <span className="font-normal text-gray-400">enrolled in A1 Movers</span></p>
                                <p className="text-[10px] text-gray-400 mt-1">1 hour ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#7030FF] p-6 rounded-2xl text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <i className="fas fa-satellite-dish"></i>
                            <h3 className="font-bold text-sm">System Status</h3>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center opacity-90">
                                <span>Server Status</span>
                                <span className="flex items-center gap-1"><i className="fas fa-check-circle"></i> Online</span>
                            </div>
                            <div className="flex justify-between items-center opacity-90">
                                <span>Database</span>
                                <span className="flex items-center gap-1"><i className="fas fa-link"></i> Connected</span>
                            </div>
                            <div className="pt-3 border-t border-white/20 flex justify-between items-center opacity-70">
                                <span>Last Backup</span>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
