import { Container, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {

	return (
		<Container maxWidth="lg">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h5" component="h2" gutterBottom>
							Bem-vindo ao Dashboard
						</Typography>
						<Typography variant="body1">
							Este é o seu painel de controle. Aqui você pode gerenciar suas informações e configurações.
						</Typography>
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Estatísticas
						</Typography>
						{/* Adicione seus componentes de estatísticas aqui */}
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Atividades Recentes
						</Typography>
						{/* Adicione seus componentes de atividades aqui */}
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Dashboard;
