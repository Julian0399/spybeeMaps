import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { esMX } from "@clerk/localizations";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Spybee - Maps Gestión de Incidencias",
  description: "Plataforma de gestión de incidencias en proyectos de construcción",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esMX}>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}