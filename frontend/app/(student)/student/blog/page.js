"use client";

import StudentRouteActions from "../../../components/dashboard/student/pages/StudentRouteActions";
import { BlogPage } from "../../../components/dashboard/student/pages/StudentPages";

export default function StudentBlogPage() {
    return (
        <StudentRouteActions>
            {({ onUpgrade }) => <BlogPage onUpgrade={onUpgrade} />}
        </StudentRouteActions>
    );
}
