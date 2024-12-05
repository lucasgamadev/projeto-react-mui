import React from 'react';
import {
	Box,
	Container,
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Button,
	IconButton,
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';

const mockEvents = [
	{
		id: 1,
		title: 'Campeonato de Windsurf',
		date: '2024-02-15',
		location: 'Praia de Copacabana',
		image: 'https://source.unsplash.com/random/800x600/?windsurf',
	},
	{
		id: 2,
		title: 'Workshop de Iniciantes',
		date: '2024-03-01',
		location: 'Praia do Forte',
		image: 'https://source.unsplash.com/random/800x600/?surf',
	},
];

export const Events = () => {
	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Eventos
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
				>
					Novo Evento
				</Button>
			</Box>

			<Grid container spacing={3}>
				{mockEvents.map((event) => (
					<Grid item xs={12} md={6} key={event.id}>
						<Card>
							<CardMedia
								component="img"
								height="200"
								image={event.image}
								alt={event.title}
							/>
							<CardContent>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
									<Box>
										<Typography variant="h6" component="h2">
											{event.title}
										</Typography>
										<Typography variant="body1" color="text.secondary">
											Data: {new Date(event.date).toLocaleDateString()}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Local: {event.location}
										</Typography>
									</Box>
									<Box>
										<IconButton color="primary" size="small">
											<EditIcon />
										</IconButton>
										<IconButton color="error" size="small">
											<DeleteIcon />
										</IconButton>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Events;