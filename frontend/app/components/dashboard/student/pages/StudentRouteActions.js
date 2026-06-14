"use client";

import { useSelector } from "react-redux";
import { useStudentShell } from "../StudentShellContext";

export default function StudentRouteActions({ children }) {
    const { user } = useSelector((state) => state.auth);
    const { navigate, openUpgrade } = useStudentShell();
    const userName = user?.name || "Rahim Hossain";

    return children({
        userName,
        onNavigate: navigate,
        onUpgrade: openUpgrade,
    });
}
