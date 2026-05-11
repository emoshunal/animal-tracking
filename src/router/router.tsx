import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}
