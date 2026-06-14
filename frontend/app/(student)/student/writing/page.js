"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { WritingPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentWritingPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <WritingPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
