export const CATEGORIES = [
  { value: "Electrico", label: "Electrico", color: "#fec510" },
  { value: "Estabilidad", label: "Estabilidad", color: "#8B5CF6" },
  { value: "Coordinación de Diseños", label: "Coordinación de Diseños", color: "#fec510" },
  { value: "Prevención de riesgos", label: "Prevención de riesgos", color: "#fec510" },
  { value: "Observación General", label: "Observación General", color: "#fec510" },
  { value: "Infraestructura", label: "Infraestructura", color: "#8B5CF6" },
  { value: "Estructural", label: "Estructural", color: "#fec510" },
  { value: "Estudio Suelos", label: "Estudio Suelos", color: "#84CC16" },
  { value: "Cimentación", label: "Cimentación", color: "#fec510" },
  { value: "Urbanismo", label: "Urbanismo", color: "#8B5CF6" },
] as const;


export const PRIORITIES = ["baja", "media", "alta"] as const;

export const STATUSES = ["abierto", "en progreso", "resuelta", "cerrada"] as const;

export interface Incident {
  id: string;
  title: string;                  
  description: string;            
  dueDate: string;                
  category: string;
  priority: typeof PRIORITIES[number];
  tags: string[];                 
  assignees: string[];            
  observers: string[];            
  location: {
    lat: number;                  
    lng: number;                  
    details: string;              
  };
  attachments: {
    images: string[];             
    videos: string[];             
    documents: string[];          
  };
  status: "abierto" | "en progreso" | "resuelta" | "cerrada";
  createdAt: string;            
}

export type IncidentFormData = Omit<Incident, "id" | "createdAt" | "status">;