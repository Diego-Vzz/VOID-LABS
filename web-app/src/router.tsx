import { createBrowserRouter } from "react-router-dom";

import Page from "./modules/test/page/Page";
import RootLayout from "./layouts/RootLayout";
import ProtectedRoute from "./modules/auth/components/ProtectedRoute";
import UnauthenticatedPage from "./modules/auth/page/unauthenticated/Page";

const isAuthenticated = true;
export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        //errorElement: <ErrorPage />, // Se muestra si la ruta no existe o hay un error crítico
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/unauthenticated">
                        <Page />
                    </ProtectedRoute>
                )
            },
            {
                path: "unauthenticated",
                element: <UnauthenticatedPage />,
            },
        ],
    },
]);