import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const DetalhePaciente = ({ pacienteId }) => {
  const [paciente, setPaciente] = useState(null);
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pacienteId) {
      carregarDadosPaciente();
      carregarExamesPaciente();
    }
  }, [pacienteId]);

  const carregarDadosPaciente = async () => {
    try {
      // Buscar paciente pelo ID
      const pacientes = await ExameModel.listarPacientes();
      const pacienteEncontrado = pacientes.find((p) => p.id === pacienteId);

      if (pacienteEncontrado) {
        setPaciente(pacienteEncontrado);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do paciente:", error);
    }
  };

  const carregarExamesPaciente = async () => {
    try {
      setLoading(true);
      const examesPaciente = await ExameModel.listarExamesPaciente(pacienteId);
      setExames(examesPaciente);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar exames do paciente:", error);
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "Não disponível";

    try {
      const dataObj = typeof data === "string" ? new Date(data) : data;
      return format(dataObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  if (loading && !paciente) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!paciente) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        Paciente não encontrado
      </Typography>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Ficha do Paciente"
        avatar={<PersonIcon fontSize="large" color="primary" />}
      />
      <Divider />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {paciente.nome}
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <WcIcon />
              </ListItemIcon>
              <ListItemText primary="Sexo" secondary={paciente.sexo} />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="Idade" secondary={`${paciente.idade} anos`} />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Exames Recentes
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : exames.length > 0 ? (
          <List>
            {exames.slice(0, 5).map((exame) => (
              <Paper key={exame.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                  <ListItemIcon>
                    <MedicalInformationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={exame.tipoExame?.nome || "Exame"}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Data: {formatarData(exame.dataRequisicao)}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={exame.status}
                            size="small"
                            color={
                              exame.status === "Concluído"
                                ? "success"
                                : exame.status === "Em Andamento"
                                  ? "warning"
                                  : exame.status === "Solicitado"
                                    ? "info"
                                    : "default"
                            }
                          />
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            Nenhum exame encontrado para este paciente
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DetalhePaciente;
