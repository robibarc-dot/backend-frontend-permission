"use client";

import { FileText, Lock } from "lucide-react";
import { Button, Card, PageIntro } from "./shared";

export default function ResultsPage({ onNavigate, onUpgrade }) {
    return (
        <div>
            <PageIntro title="My Results" subtitle="Your test history will appear here after you complete a mock test." />
            <Card className="py-14 text-center">
                <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] bg-red-50 text-red-600"><FileText size={28} /></span>
                <h3 className="font-['Sora',sans-serif] text-base font-bold text-gray-950">No tests completed yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-gray-400">Take your first free mock test to see band scores, section breakdown, and detailed review here.</p>
                <Button className="mt-5" onClick={() => onNavigate("mock-tests")}>Start a Mock Test</Button>
                <p className="mt-4 text-xs text-gray-400">You have 3 free tests remaining this month.</p>
            </Card>
            <Card className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="text-[13px] font-bold">Download Score Report</h3><p className="text-xs text-gray-400">PDF report for universities and applications. Pro feature.</p></div>
                <Button variant="amber" className="px-3 py-2 text-xs" onClick={onUpgrade}><Lock size={13} /> Unlock PDF</Button>
            </Card>
        </div>
    );
}
