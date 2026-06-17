"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MapView from "@/components/map/MapView";
import CreateIncidentModal from "@/components/incidents/CreateIncidentModal";
import { useIncidentStore } from "@/store/incidentStore";

export default function Home() {
  const { showCreateModal } = useIncidentStore();
  return (
    <>
      <Header />
      <Sidebar />
      <MapView />
      {showCreateModal && <CreateIncidentModal />}
    </>
  );
}