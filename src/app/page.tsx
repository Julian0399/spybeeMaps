"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MapView from "@/components/map/MapView";

export default function Home() {
  return (
    <>
      <Header />
      <Sidebar />
      <MapView />
    </>
  );
}