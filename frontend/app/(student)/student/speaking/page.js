"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { SpeakingPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentSpeakingPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <SpeakingPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
