"use client";

import { useEffect, useState } from "react";
import Footer from "./partials/Footer";
import Header from "./partials/Header";
import Leftsidebar from "./partials/Leftsidebar";

export default function Layout({
    children,
    role = "admin",
    title = "Control center",
    subtitle = "Track team activity, permissions, and delivery health from one place.",
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (


    <div className="flex min-h-screen bg-[#F3F4F6] text-slate-800">
      {/* Sidebar - Conditionally Rendered */}    
        <Leftsidebar
            role={role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
            {/* Pass shouldHideSidebar to Header if you want to hide the Menu button too */}
                <Header
                    role={role}
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setSidebarOpen(true)}
                />
            
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                <div className="mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    </div>
    );
}
