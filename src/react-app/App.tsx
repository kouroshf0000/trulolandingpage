import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import HomePage from "@/react-app/pages/Home";
import WelcomePage from "@/react-app/pages/Welcome";
import OwnersPage from "@/react-app/pages/Owners";
import OwnersConfirmedPage from "@/react-app/pages/OwnersConfirmed";
import TenantsPage from "@/react-app/pages/Tenants";
import TenantsConfirmedPage from "@/react-app/pages/TenantsConfirmed";
import SalesTeamPage from "@/react-app/pages/SalesTeam";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/owners" element={<OwnersPage />} />
        <Route path="/owners/confirmed" element={<OwnersConfirmedPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/tenants/confirmed" element={<TenantsConfirmedPage />} />
        <Route path="/salesteam" element={<SalesTeamPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
