"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { PricingPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentPricingPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <PricingPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
