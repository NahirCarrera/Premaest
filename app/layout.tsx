// app/layout.tsx o pages/_app.tsx si estás usando la estructura antigua

import "./globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "PREMAEST",
  description: "Sistema de prematrículas para estudiantes de la ESPE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={geistSans.className}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children} {/* ✅ Aquí se renderizan tus páginas dinámicamente */}
        </ThemeProvider>
      </body>
    </html>
  );
}
