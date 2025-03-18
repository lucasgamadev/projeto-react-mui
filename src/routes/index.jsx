import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import Consultas from "../pages/consultas/Consultas";
import Dashboard from "../pages/dashboard/Dashboard";
import Exames from "../pages/Exames";
import HistoricoMedico from "../pages/historicoMedico/HistoricoMedico";
import Login from "../pages/login/Login";
import Medicamentos from "../pages/medicamentos/Medicamentos";
import ProfilePage from "../pages/profile/ProfilePage";
import Prontuario from "../pages/prontuario/Prontuario";
import Settings from "../pages/settings/Settings";
import Tratamento from "../pages/tratamento/Tratamento";
import Triagem from "../pages/triagem/Triagem";
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
        <Route path="prontuario" element={<Prontuario />} />
        <Route path="historico-medico" element={<HistoricoMedico />} />
        <Route path="tratamento" element={<Tratamento />} />
        <Route path="triagem" element={<Triagem />} />
        <Route path="exames" element={<Exames />} />
        <Route path="medicamentos" element={<Medicamentos />} />
        <Route path="users" element={<Users />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="configuracoes" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
