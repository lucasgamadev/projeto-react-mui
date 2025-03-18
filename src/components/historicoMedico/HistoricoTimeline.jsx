import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  MedicationLiquid as MedicationIcon,
  MonitorHeart as MonitorHeartIcon,
  Science as ScienceIcon
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useState } from "react";

/**
 * Componente que exibe uma linha do tempo com os eventos médicos do paciente
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.eventos - Lista de eventos médicos
 * @param {function} props.onEventoClick - Função chamada ao clicar em um evento
 */
const HistoricoTimeline = ({ eventos = [], onEventoClick }) => {
  const theme = useTheme();
  const [expandidos, setExpandidos] = useState({});

  // Função para alternar a expansão de um item
  const toggleExpansao = (eventoId) => {
    setExpandidos((prev) => ({
      ...prev,
      [eventoId]: !prev[eventoId]
    }));
  };

  // Define o ícone com base no tipo do evento
  const getIconePorTipo = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "consulta":
        return <MedicalServicesIcon />;
      case "cirurgia":
        return <LocalHospitalIcon />;
      case "exame":
        return <ScienceIcon />;
      case "medicacao":
        return <MedicationIcon />;
      default:
        return <MonitorHeartIcon />;
    }
  };

  // Define a cor do ícone com base no tipo do evento
  const getCorPorTipo = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "consulta":
        return "primary";
      case "cirurgia":
        return "error";
      case "exame":
        return "info";
      case "medicacao":
        return "success";
      default:
        return "secondary";
    }
  };

  // Formata a data para exibição
  const formatarData = (data) => {
    return format(new Date(data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Define a cor do status
  const getCorPorStatus = (status) => {
    switch (status.toLowerCase()) {
      case "agendado":
        return "warning";
      case "realizado":
        return "success";
      case "cancelado":
        return "error";
      default:
        return "default";
    }
  };

  // Se não houver eventos, mostrar mensagem
  if (eventos.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center", width: "100%" }}>
        <Typography variant="body1" color="text.secondary">
          Nenhum evento médico registrado no histórico do paciente.
        </Typography>
      </Box>
    );
  }

  // Ordenar eventos por data (mais recente primeiro)
  const eventoOrdenados = [...eventos].sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <Stack spacing={3} sx={{ width: "100%", px: 2 }}>
      {eventoOrdenados.map((evento, index) => (
        <Box
          key={evento.id}
          sx={{
            display: "flex",
            position: "relative",
            mb: 4
          }}
        >
          {/* Linha do tempo */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: { xs: 40, md: "50%" },
              width: 2,
              bgcolor: "divider",
              transform: { xs: "none", md: "translateX(-1px)" },
              zIndex: 0
            }}
          />

          {/* Data do evento (à esquerda no desktop, acima no mobile) */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              pr: { xs: 0, md: 2 },
              textAlign: { xs: "left", md: index % 2 === 0 ? "right" : "left" },
              order: { xs: 1, md: index % 2 === 0 ? 1 : 2 },
              mb: { xs: 1, md: 0 }
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
                display: { xs: "block", md: "inline-block" },
                mb: { xs: 1, md: 0 }
              }}
            >
              {formatarData(evento.data)}
            </Typography>
          </Box>

          {/* Marcador do timeline */}
          <Box
            sx={{
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: { xs: "absolute", md: "static" },
              left: { xs: 0, md: "auto" },
              top: { xs: 0, md: "auto" },
              order: { md: 2 }
            }}
          >
            <Box
              sx={{
                bgcolor: theme.palette[getCorPorTipo(evento.tipo)].main,
                color: "white",
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 3
              }}
            >
              {getIconePorTipo(evento.tipo)}
            </Box>
          </Box>

          {/* Conteúdo do evento (à direita no desktop, abaixo no mobile) */}
          <Box
            sx={{
              width: { xs: "calc(100% - 60px)", md: "50%" },
              pl: { xs: 3, md: 2 },
              ml: { xs: "auto", md: 0 },
              order: { xs: 2, md: index % 2 === 0 ? 2 : 1 }
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: `5px solid ${theme.palette[getCorPorTipo(evento.tipo)].main}`,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4
                }
              }}
              onClick={() => onEventoClick && onEventoClick(evento)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography variant="h6" component="h3">
                  {evento.titulo}
                </Typography>
                <Chip
                  label={evento.statusEvento}
                  size="small"
                  color={getCorPorStatus(evento.statusEvento)}
                />
              </Box>

              <Typography variant="subtitle2" color="text.secondary">
                {evento.local} • {evento.especialidade}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="body2" sx={{ mb: 1 }}>
                {evento.descricao}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpansao(evento.id);
                  }}
                  sx={{
                    transform: expandidos[evento.id] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s"
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              <Collapse in={expandidos[evento.id]}>
                <Box sx={{ mt: 1 }}>
                  {evento.diagnosticos && evento.diagnosticos.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Diagnósticos:</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {evento.diagnosticos.map((diag, idx) => (
                          <Chip
                            key={idx}
                            label={diag}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {evento.procedimentos && evento.procedimentos.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Procedimentos:</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {evento.procedimentos.map((proc, idx) => (
                          <Chip
                            key={idx}
                            label={proc}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {evento.medicamentos && evento.medicamentos.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Medicamentos:</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {evento.medicamentos.map((med, idx) => (
                          <Chip
                            key={idx}
                            label={med}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {evento.resultado && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Resultado:</Typography>
                      <Typography variant="body2">{evento.resultado}</Typography>
                    </Box>
                  )}

                  {evento.observacoes && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Observações:</Typography>
                      <Typography variant="body2">{evento.observacoes}</Typography>
                    </Box>
                  )}

                  {evento.anexos && evento.anexos.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Anexos:</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {evento.anexos.map((anexo, idx) => (
                          <Chip
                            key={idx}
                            label={anexo}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Função para visualizar o anexo - implementar conforme necessário
                              console.log("Visualizar anexo:", anexo);
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Paper>
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default HistoricoTimeline;
