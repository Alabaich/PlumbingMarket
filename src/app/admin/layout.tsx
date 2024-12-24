"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Suspense, lazy } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  // Lazy load components for each section
  const pages: { [key: string]: React.LazyExoticComponent<React.FC> } = {
    dashboard: lazy(() => import("./pages/Dashboard")),
    users: lazy(() => import("./pages/Users")),
    products: lazy(() => import("./pages/Products")),
    orders: lazy(() => import("./pages/Orders")),
    settings: lazy(() => import("./pages/Settings")),
  };

  const SelectedPage = pages[selectedPage];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-100">
        <Suspense fallback={<div>Loading...</div>}>
          <SelectedPage />
        </Suspense>
      </div>
    </div>
  );
}
