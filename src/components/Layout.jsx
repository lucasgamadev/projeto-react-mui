import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useDashboard } from '../contexts/DashboardContext';
import {
	Box,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import {
	Menu as MenuIcon,
	Dashboard as DashboardIcon,
	Person as PersonIcon,
	Settings as SettingsIcon,
	Group as GroupIcon,
	Event as EventIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
	{ path: '/dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
	{ path: '/events', name: 'Eventos', icon: <EventIcon /> },
	{ path: '/users', name: 'Usuários', icon: <GroupIcon /> },
	{ path: '/perfil', name: 'Perfil', icon: <PersonIcon /> },
	{ path: '/configuracoes', name: 'Configurações', icon: <SettingsIcon /> },
];

export const Layout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { mobileOpen, handleDrawerToggle } = useDashboard();

	const getCurrentPageName = () => {
		const currentItem = menuItems.find(item => item.path === location.pathname) || 
											 menuItems.find(item => item.path === '/dashboard');
		return currentItem.name;
	};

	const drawer = (
		<div>
			<Toolbar />
			<List>
				{menuItems.map((item) => (
					<ListItem
						button
						key={item.path}
						onClick={() => navigate(item.path)}
						selected={location.pathname === item.path}
					>
						<ListItemIcon>
							{item.icon}
						</ListItemIcon>
						<ListItemText primary={item.name} />
					</ListItem>
				))}
			</List>
		</div>
	);



	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="abrir menu"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
					</Typography>
				</Toolbar>
			</AppBar>

			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					marginTop: '64px',
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
