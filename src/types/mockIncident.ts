export interface MockIncident {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;
  type: {
    id: string;
    key: string;
    name: string;
    name_en: string;
  };
  priority: "high" | "medium" | "low";
  status: "open" | "closed" | "in_progress" | "assigned";
  approval: boolean;
  project: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  assignees: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  }[];
  observers: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  locationDescription: string;
  dueDate: string | null;
  closingDate: string | null;
  media: {
    id: string;
    name: string;
    type: "image" | "video";
    format: string;
    size: number;
    status: string;
    url: string;
  }[];
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string;
}