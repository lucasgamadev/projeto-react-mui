import React, { useState } from 'react';
import {
	Box,
	Container,
	Paper,
	Typography,
	Switch,
	FormGroup,
	FormControlLabel,
	Divider,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
} from '@mui/material';

export const Settings = () => {
	const [settings, setSettings] = useState({
		darkMode: false,
		notifications: true,
		emailNotifications: true,
		language: 'pt-BR',
	});

	const handleChange = (event) => {
		const { name, checked, value } = event.target;
		setSettings(prev => ({
			...prev,
			[name]: checked !== undefined ? checked : value,
		}));
	};

	const handleSave = () => {
		// Aqui você implementaria a lógica para salvar as configurações
		console.log('Configurações salvas:', settings);
	};

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Configurações
			</Typography>

			<Stack spacing={3}>
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Aparência
					</Typography>
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={settings.darkMode}
									onChange={handleChange}
									name="darkMode"
								/>
							}
							label="Modo Escuro"
						/>
					</FormGroup>
				</Paper>

				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Notificações
					</Typography>
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={settings.notifications}
									onChange={handleChange}
									name="notifications"
								/>
							}
							label="Notificações Push"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={settings.emailNotifications}
									onChange={handleChange}
									name="emailNotifications"
								/>
							}
							label="Notificações por Email"
						/>
					</FormGroup>
				</Paper>

				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Preferências
					</Typography>
					<FormControl fullWidth sx={{ mt: 2 }}>
						<InputLabel id="language-label">Idioma</InputLabel>
						<Select
							labelId="language-label"
							value={settings.language}
							label="Idioma"
							name="language"
							onChange={handleChange}
						>
							<MenuItem value="pt-BR">Português (Brasil)</MenuItem>
							<MenuItem value="en-US">English (US)</MenuItem>
							<MenuItem value="es">Español</MenuItem>
						</Select>
					</FormControl>
				</Paper>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSave}
						size="large"
					>
						Salvar Alterações
					</Button>
				</Box>
			</Stack>
		</Container>
	);
};

export default Settings;