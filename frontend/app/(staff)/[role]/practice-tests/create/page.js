'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCreatePracticeTestMutation } from '@/redux/features/practice-test/backend/practiceTestApi';

export default function CreatePracticeTestPage() {
    const { role } = useParams();
    const router = useRouter();
    const [createTest, { isLoading }] = useCreatePracticeTestMutation();

    const [formData, setFormData] = useState({
        title: '',
        duration_mins: 60,
        category: '',
        type: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTest(formData).unwrap();
            router.push(`/(staff)/${role}/practice-tests`);
        } catch (err) {
            console.error('Failed to create test:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Practice Test</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                    <input
                        type="number"
                        name="duration_mins"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.duration_mins}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        name="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                        type="text"
                        name="type"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={formData.type}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Test'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="text-gray-600 px-6 py-2">Cancel</button>
                </div>
            </form>
        </div>
    );
}
