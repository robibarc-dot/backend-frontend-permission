'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PracticeTestResult from '@/app/components/dashboard/common/results/PracticeTestResut';
import {
    useGetPracticeTestQuery,
    useGetPracticeTestResultsQuery,
} from '@/redux/features/practice-test/frontend/practiceTestApis';

export default function PracticeTestResultsPage() {
    const { slug: identifier } = useParams();

    const { data: testData, isLoading: isTestLoading, error: testError } = useGetPracticeTestQuery(identifier, {
        skip: !identifier,
    });
    const { data: resultsData, isLoading: isResultsLoading, error: resultsError } = useGetPracticeTestResultsQuery(
        { identifier },
        { skip: !identifier }
    );

    const testDetails = testData?.data;
    const latestSubmission = useMemo(() => {
        const submissions = Array.isArray(resultsData?.data) ? resultsData.data : [];
        return submissions[0] || null;
    }, [resultsData]);

    if (isTestLoading || isResultsLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
            </div>
        );
    }

    if (testError || resultsError || !testDetails || !latestSubmission) {
        return (
            <div className="mx-auto max-w-4xl p-6 text-center text-sm font-semibold text-rose-700 dark:text-rose-300">
                No submitted result is available for this practice test yet.
            </div>
        );
    }

    return <PracticeTestResult testDetails={testDetails} resultData={latestSubmission} />;
}
