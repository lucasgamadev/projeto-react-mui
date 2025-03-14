import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import React from "react";

const mockEvents = [
  {
    id: 1,
    title: "Campeonato de Windsurf",
    date: "14/02/2024", // Formato BR
    location: "Praia de Copacabana",
    image: "/images/events/windsurf.svg" // Alterado para SVG
  },
  {
    id: 2,
    title: "Workshop de Iniciantes",
    date: "29/02/2024", // Formato BR
    location: "Praia do Forte",
    image: "/images/events/workshop.svg" // Alterado para SVG
  }
];

export const Events = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Eventos
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
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
                sx={{ objectFit: "cover" }} // Para garantir que a imagem preencha adequadamente
              />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {event.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Data: {event.date}
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
