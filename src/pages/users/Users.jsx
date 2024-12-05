import React from 'react';
import {
	Box,
	Container,
	Paper,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Button,
} from '@mui/material';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
} from '@mui/icons-material';

// Mock data - você pode substituir isso por dados reais depois
const mockUsers = [
	{ id: 1, name: 'João Silva', email: 'joao@email.com', role: 'Admin' },
	{ id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'User' },
	{ id: 3, name: 'Pedro Costa', email: 'pedro@email.com', role: 'User' },
];

export const Users = () => {
	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Usuários
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
				>
					Novo Usuário
				</Button>
			</Box>
			
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Nome</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Função</TableCell>
							<TableCell align="right">Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{mockUsers.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role}</TableCell>
								<TableCell align="right">
									<IconButton color="primary" size="small">
										<EditIcon />
									</IconButton>
									<IconButton color="error" size="small">
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default Users;