import { LoginForm } from "./components/auth/login-form"
import Dashboard from "./pages/admin/dashboard"
import AnimalRecords from "./pages/admin/animal"
import OwnersPage from "./pages/admin/owner"
import VaccinationPage from "./pages/admin/vaccine"
import LostAndFoundPage from "./pages/admin/lost_and_found"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./router/router"
import Layout from "./components/layout"
import ScanReportsPage from "./pages/admin/reports"
import LandingPage from "./pages/landing"
import AnimalOwnersPage from "./pages/admin/owner/animal-owner"
import UserManagement from "./pages/admin/user"
import { ForgotPassword } from "./components/auth/forgot-password"
import AdoptionComingSoon from "./pages/adoption"
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:qrId" element={<LandingPage />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/animals" element={<AnimalRecords />} />
            <Route path="/owners" element={<OwnersPage />} />
            <Route path="/vaccinations" element={<VaccinationPage />} />
            <Route path="/lost-and-found" element={<LostAndFoundPage />} />
            <Route path="/reports" element={<ScanReportsPage />} />
            <Route path="/animal" element={<AnimalOwnersPage />} />
            <Route path="/adoption" element={<AdoptionComingSoon />} />
            <Route path="/users" element={<UserManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
