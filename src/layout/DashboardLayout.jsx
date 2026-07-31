import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function DashboardLayout() {
    const [activeNav, setActiveNav] = useState('Home');
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Fixed Navbar */}
            <Navbar
                activeNav={activeNav}
                setActiveNav={setActiveNav}
            />

            {/* Page Content */}
            <main className=" px-5">
                <Outlet />
            </main>
        </div>
    );
}