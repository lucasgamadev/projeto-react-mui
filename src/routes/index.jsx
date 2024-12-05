import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Login } from '../pages/login/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Users } from '../pages/users/Users';
import { Events } from '../pages/events/Events';
import { Settings } from '../pages/settings/Settings';

const PrivateRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" />;
};

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/" element={
				<PrivateRoute>
					<Layout />
				</PrivateRoute>
			}>
				<Route index element={<Dashboard />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="events" element={<Events />} />
				<Route path="users" element={<Users />} />
				<Route path="perfil" element={<div>Página de Perfil</div>} />
				<Route path="configuracoes" element={<Settings />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;