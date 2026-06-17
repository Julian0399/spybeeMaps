import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Incident, IncidentFormData } from "@/types/incident";
import { v4 as uuidv4 } from "uuid";

interface IncidentState {

  incidents: Incident[];                          
  selectedIncident: Incident | null;              
  isCreating: boolean;                            
  clickedLocation: { lat: number; lng: number } | null;  
  showCreateModal: boolean;                       

  setSelectedIncident: (incident: Incident | null) => void;
  setIsCreating: (val: boolean) => void;
  setClickedLocation: (loc: { lat: number; lng: number } | null) => void;
  setShowCreateModal: (val: boolean) => void;
  addIncident: (data: IncidentFormData) => void;  
}

export const useIncidentStore = create<IncidentState>()(
  persist(
    (set) => ({
  incidents: [],
  selectedIncident: null,
  isCreating: false,
  clickedLocation: null,
  showCreateModal: false,

  setSelectedIncident: (incident) => set({ selectedIncident: incident }),

  setIsCreating: (val) => set({ isCreating: val }),

  setClickedLocation: (loc) => set({ clickedLocation: loc }),

  setShowCreateModal: (val) => set({ showCreateModal: val }),

  addIncident: (data) =>
    set((state) => ({
      incidents: [
        ...state.incidents,
        {
          ...data,                              
          id: uuidv4(),                         
          status: "abierto",                    
          createdAt: new Date().toISOString(),   
        },
      ],
      
      showCreateModal: false,
      isCreating: false,
      clickedLocation: null,
    })),
}),
    {
      name: "incident-storage",
    }
  )
);