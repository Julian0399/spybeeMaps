"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Sidebar />
      <main style={{ 
        marginLeft: 80,
        marginTop: 68, 
        padding: 20,
        background: "#fff",
        minHeight: "calc(100vh - 68px)",
        borderRadius: 12,
      }}>
        <h1>Spybee - Maps Incidencias</h1>
        <p>Despues del Login</p>
      </main>
    </>
  );
}