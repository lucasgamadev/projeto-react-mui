import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const ResumoDashboardMedico = ({ medicoId }) => {
  const [medicoInfo, setMedicoInfo] = useState(null);
  const [estatisticas, setEstatisticas] = useState({
    examesSolicitados: 0,
    examesConcluidos: 0,
    pacientesAtendidos: 0,
    examesCriticos: 0
  });

  useEffect(() => {
    carregarDadosMedico();
    carregarEstatisticas();
  }, [medicoId]);

  const carregarDadosMedico = async () => {
    try {
      // Simular carregamento de informações do médico
      const medicos = await ExameModel.listarMedicos();
      const medico = medicos.find((m) => m.id === medicoId);

      if (medico) {
        setMedicoInfo(medico);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do médico:", error);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const dados = await ExameModel.obterEstatisticas();

      // Filtrar informações relevantes para o médico
      const medicoStats = dados.examesPorMedico.find((m) => m.medicoId === medicoId) || {
        quantidade: 0
      };

      setEstatisticas({
        examesSolicitados: medicoStats.quantidade,
        examesConcluidos: Math.floor(medicoStats.quantidade * 0.6), // Simulação: 60% concluídos
        pacientesAtendidos: Math.min(5, medicoStats.quantidade), // Simulação
        examesCriticos: dados.exameCriticoCount || 0
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  if (!medicoInfo) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                <LocalHospitalIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{medicoInfo.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {medicoInfo.especialidade}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Resumo de Atividades
            </Typography>

            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "info.main" }}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Exames Solicitados"
                  secondary={estatisticas.examesSolicitados}
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <EventNoteIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Exames Concluídos"
                  secondary={estatisticas.examesConcluidos}
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Pacientes Atendidos"
                  secondary={estatisticas.pacientesAtendidos}
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "error.main" }}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Resultados Críticos"
                  secondary={estatisticas.examesCriticos}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResumoDashboardMedico;
