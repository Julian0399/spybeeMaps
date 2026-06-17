export interface TagGroup {
  label: string;
  children?: string[]; 
}

export const TAG_TREE: TagGroup[] = [
  {
    label: "Edificio 1",
    children: ["Piso 1", "Piso 2"],
  },
  {
    label: "Apartamento 112",
  },
  {
    label: "Test 1",
    children: ["Parqueadero", "Lobby", "Terraza"],
  },
];