'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
    useGetPracticeTestsQuery, 
    useDeletePracticeTestMutation 
} from '@/redux/features/practice-test/backend/practiceTestApi';

export default function PracticeTestsListPage() {
    const { role } = useParams();
    const { data: tests, isLoading, isError } = useGetPracticeTestsQuery();
    const [deleteTest, { isLoading: isDeleting }] = useDeletePracticeTestMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this practice test?')) {
            try {
                await deleteTest(id).unwrap();
            } catch (err) {
                alert('Failed to delete the test');
            }
        }
    };

    if (isLoading) return <div className="p-6">Loading practice tests...</div>;
    if (isError) return <div className="p-6 text-red-500">Error loading practice tests.</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Practice Tests</h1>
                <Link 
                    href={`/(staff)/${role}/practice-tests/create`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create New Test
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="px-5 py-3">Title</th>
                            <th className="px-5 py-3">Duration (Mins)</th>
                            <th className="px-5 py-3">Category</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests?.map((test) => (
                            <tr key={test.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm">{test.title}</td>
                                <td className="px-5 py-4 text-sm">{test.duration_mins}</td>
                                <td className="px-5 py-4 text-sm">{test.category}</td>
                                <td className="px-5 py-4 text-sm">{test.type}</td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <Link 
                                        href={`/(staff)/${role}/practice-tests/edit/${test.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(test.id)}
                                        disabled={isDeleting}
                                        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tests?.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
                                    No practice tests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
