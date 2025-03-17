import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import ConsultaFormModal from "../../components/consultas/ConsultaFormModal";

const mockConsultas = [
  {
    id: 1,
    paciente: "Maria Silva",
    data: "14/02/2024", // Formato BR
    horario: "14:30",
    medico: "Dr. João Cardoso",
    especialidade: "Cardiologia",
    status: "Agendada"
  },
  {
    id: 2,
    paciente: "Pedro Almeida",
    data: "29/02/2024", // Formato BR
    horario: "10:15",
    medico: "Dra. Ana Pereira",
    especialidade: "Dermatologia",
    status: "Confirmada"
  }
];

export const Consultas = () => {
  const [consultas, setConsultas] = useState(mockConsultas);
  const [openModal, setOpenModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddConsulta = (newConsulta) => {
    setConsultas([...consultas, newConsulta]);
    setAlertMessage("Consulta agendada com sucesso!");
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Consultas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Nova Consulta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {consultas.map((consulta) => (
          <Grid item xs={12} md={6} key={consulta.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {consulta.paciente}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Data: {consulta.data} às {consulta.horario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Médico: {consulta.medico}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Especialidade: {consulta.especialidade}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: consulta.status === "Confirmada" ? "success.main" : "info.main"
                      }}
                    >
                      Status: {consulta.status}
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

      {/* Modal de Cadastro de Consulta */}
      <ConsultaFormModal open={openModal} onClose={handleCloseModal} onSave={handleAddConsulta} />

      {/* Alerta de sucesso */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Consultas;
