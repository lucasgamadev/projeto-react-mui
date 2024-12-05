import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import AppRoutes from './routes';

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<DashboardProvider>
					<AppRoutes />
				</DashboardProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;