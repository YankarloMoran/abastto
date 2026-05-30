import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { NexusChatWrapper } from "@/components/nexus-chat-wrapper";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abastto - Red Empresarial de Compras Inteligentes",
  description: "Plataforma de conexión para proveedores verificados y gestión rápida con copiloto Nexus AI.",
};

/**
 * Componente principal de diseño (Layout) que envuelve toda la aplicación.
 * Configura las fuentes, el tema visual (ThemeProvider), el proveedor de notificaciones (Toaster)
 * y el contenedor del chat de IA (NexusChatWrapper).
 * 
 * @param children - Los componentes hijos (páginas) que se renderizarán dentro del layout.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${outfit.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <NexusChatWrapper />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: { fontWeight: 600 },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

