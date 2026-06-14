"use client";

import StudentRouteActions from "../../components/dashboard/student/pages/StudentRouteActions";
import { DashboardPage } from "../../components/dashboard/student/pages/StudentPages";

export default function StudentPage() {
    return (
        <StudentRouteActions>
            {({ userName, onNavigate, onUpgrade }) => (
                <DashboardPage userName={userName} onNavigate={onNavigate} onUpgrade={onUpgrade} />
            )}
        </StudentRouteActions>
    );
}
