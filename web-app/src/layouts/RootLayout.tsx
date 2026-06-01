import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function RootLayout() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            <main style={{ padding: "2rem", flex: 1 }}>
                <Outlet />
            </main>

            <Toaster position="bottom-right" richColors />
        </div>
    );
}