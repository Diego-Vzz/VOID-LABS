
import type { Metadata } from "next";
import "@/app/globals.css";
import NavegationBar from "@/shared/ui/system/components/NavegationBar";
import { Action } from "@/module/auth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Void System | Ghost Client",
  description: "VOID LABS System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const user = await Action.Auth.SysMe();

  return (
    <html lang="es" >
      <body suppressHydrationWarning>
        <div className="flex min-h-screen flex-col lg:flex-row gap-2 lg:gap-4 p-2 lg:p-4 overflow-hidden">
          <aside className="sticky top-0 z-40 w-full flex-none lg:w-64">
            <NavegationBar />
          </aside>

          <main className="flex-1 min-w-0 overflow-hidden bg-[#18181B] rounded-xl p-4">
            {children}
          </main>
        </div>
        <Toaster
          theme="dark"
          position="top-center"
          closeButton
          richColors
          duration={3000}
        />
      </body>
    </html>
  );
}
