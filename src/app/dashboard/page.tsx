"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Dashboard from "@/components/incidents/Dashboard";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <Sidebar />
      <Dashboard />
    </>
  );
}