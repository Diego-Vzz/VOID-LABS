
import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "System Access | Void",
  description: "VOID LABS System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0C] text-zinc-100 antialiased selection:bg-zinc-700/50" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
          <main className="w-full max-w-[400px] bg-[#0A0A0C] sm:bg-[#121214] sm:border sm:border-zinc-800/60 sm:rounded-2xl sm:p-8 sm:shadow-2xl">
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
