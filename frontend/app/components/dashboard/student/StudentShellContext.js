"use client";

import { createContext, useContext } from "react";

const StudentShellContext = createContext(null);

export function StudentShellProvider({ value, children }) {
    return (
        <StudentShellContext.Provider value={value}>
            {children}
        </StudentShellContext.Provider>
    );
}

export function useStudentShell() {
    const context = useContext(StudentShellContext);

    if (!context) {
        throw new Error("useStudentShell must be used within StudentShellProvider.");
    }

    return context;
}
