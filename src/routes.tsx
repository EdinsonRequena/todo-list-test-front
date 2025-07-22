import type { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
// import TasksPage from "./tasks/pages/TasksPage";

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";

function Private({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/tasks"
            element={
              <Private>
                <h1>estoy en tasks</h1>
              </Private>
            }
          />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
