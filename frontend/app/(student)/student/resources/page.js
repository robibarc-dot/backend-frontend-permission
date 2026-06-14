"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { ResourcesPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentResourcesPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <ResourcesPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
