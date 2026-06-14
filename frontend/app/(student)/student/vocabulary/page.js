"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { VocabularyPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentVocabularyPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <VocabularyPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
