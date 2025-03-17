import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import Consultas from "../pages/consultas/Consultas";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import ProfilePage from "../pages/profile/ProfilePage";
import Settings from "../pages/settings/Settings";
import Users from "../pages/users/Users";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="consultas" element={<Consultas />} />
        <Route path="users" element={<Users />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="configuracoes" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
