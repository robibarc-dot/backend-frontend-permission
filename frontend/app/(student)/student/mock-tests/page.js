"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { MockTestsPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentMockTestsPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <MockTestsPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
