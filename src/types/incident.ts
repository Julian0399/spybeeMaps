export interface Incident {
  id: string;
  title: string;                  
  description: string;            
  dueDate: string;                
  category:  "Electrico" | "Estabilidad" | "Coordinación de Diseños" | "Prevención de riesgos" | "Observación General" | "Infraestructura" | "Estructural" | "Estudio Suelos" | "Cimentación" | "Urbanismo";               // Categoría (Estructural, Plomería, etc.)
  priority: "baja" | "media" | "alta";  
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
  status: "abierta" | "en progreso" | "resuelta" | "cerrada";
  createdAt: string;            
}

export type IncidentFormData = Omit<Incident, "id" | "createdAt" | "status">;