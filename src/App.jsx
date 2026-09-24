import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext";

import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import MedicineForm from "./pages/MedicineForm";
import Suppliers from "./pages/Suppliers";
import StaffDashboard from "./pages/StaffDashboard";
import StaffCreateBill from "./pages/StaffCreateBill";
import NotFound from "./pages/NotFound";

/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: currentRole } = useApp();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (role && currentRole !== role) {
    return (
      <Navigate
        to={currentRole === "staff" ? "/staff" : "/"}
        replace
      />
    );
  }

  return children;
}

/* =========================
   PUBLIC ROUTE
========================= */

function PublicRoute({ children }) {
  const { isAuthenticated, role } = useApp();

  // Already logged in
  if (isAuthenticated) {
    return (
      <Navigate
        to={role === "staff" ? "/staff" : "/"}
        replace
      />
    );
  }

  return children;
}

/* =========================
   APP ROUTES
========================= */

export default function App() {
  return (
    <Routes>

      {/* =========================
          LOGIN
      ========================= */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* =========================
          ADMIN ROUTES
      ========================= */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/medicines"
          element={<Medicines />}
        />

        <Route
          path="/medicines/new"
          element={<MedicineForm />}
        />

        <Route
          path="/medicines/:id/edit"
          element={<MedicineForm />}
        />

        <Route
          path="/suppliers"
          element={<Suppliers />}
        />
      </Route>

      {/* =========================
          STAFF DASHBOARD
      ========================= */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          STAFF CREATE BILL
      ========================= */}
      <Route
        path="/staff/create-bill"
        element={
          <ProtectedRoute role="staff">
            <StaffCreateBill />
          </ProtectedRoute>
        }
      />

      {/* =========================
          404
      ========================= */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}