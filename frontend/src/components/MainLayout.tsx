"use client";

import { useState } from "react";
import Navigation from "./Navigation";
import Header from "./Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            <Navigation isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <Header onMenuToggle={toggleSidebar} />
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
