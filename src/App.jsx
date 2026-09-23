import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import MedicineForm from "./pages/MedicineForm";
import Suppliers from "./pages/Suppliers";
import StaffDashboard from "./pages/StaffDashboard";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: currentRole } = useApp();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) {
    return <Navigate to={currentRole === "staff" ? "/staff" : "/"} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, role } = useApp();
  if (!isAuthenticated) return children;
  return <Navigate to={role === "staff" ? "/staff" : "/"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route
        element={
          <ProtectedRoute role="admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/new" element={<MedicineForm />} />
        <Route path="/medicines/:id/edit" element={<MedicineForm />} />
        <Route path="/suppliers" element={<Suppliers />} />
      </Route>

      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
