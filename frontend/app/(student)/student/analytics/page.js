"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { AnalyticsPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentAnalyticsPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <AnalyticsPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
