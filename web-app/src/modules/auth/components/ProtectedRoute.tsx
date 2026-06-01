import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    isAllowed: boolean;
    redirectTo?: string;
    children?: React.ReactNode;
}

export default function ProtectedRoute({
    isAllowed,
    redirectTo = "/login",
    children
}: ProtectedRouteProps) {

    if (!isAllowed) {
        return <Navigate to={redirectTo} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}