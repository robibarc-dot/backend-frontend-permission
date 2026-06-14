"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { ResultsPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentResultsPage() {
    return (
        <StudentRouteActions>
            {({ onNavigate, onUpgrade }) => <ResultsPage onNavigate={onNavigate} onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
