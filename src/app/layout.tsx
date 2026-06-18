import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esMX } from "@clerk/localizations";
import "@/styles/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
        <head>
          <link rel="icon" href="/favicon.png" type="image/png" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
            rel="stylesheet"
          />
        </head>
        <body className={poppins.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}