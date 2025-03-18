import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LaunchIcon from "@mui/icons-material/Launch";
import MedicationIcon from "@mui/icons-material/Medication";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PauseIcon from "@mui/icons-material/Pause";
import PersonIcon from "@mui/icons-material/Person";
import TimerIcon from "@mui/icons-material/Timer";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  calcularProgressoTratamento,
  verificarTratamentoAtrasado
} from "../../models/TratamentoModel";

const TratamentosList = ({
  tratamentos,
  onAddClick,
  onVerDetalhes,
  onAtualizarStatus,
  onAdicionarEtapa,
  onAdicionarAvaliacao
}) => {
  const [expandido, setExpandido] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [tratamentoSelecionado, setTratamentoSelecionado] = useState(null);

  const handleExpandClick = (tratamentoId) => {
    setExpandido((prev) => ({
      ...prev,
      [tratamentoId]: !prev[tratamentoId]
    }));
  };

  const handleMenuClick = (event, tratamento) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setTratamentoSelecionado(tratamento);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setTratamentoSelecionado(null);
  };

  const handleAtualizarStatus = (novoStatus) => {
    onAtualizarStatus(tratamentoSelecionado.id, novoStatus);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "não iniciado":
        return "default";
      case "em andamento":
        return "primary";
      case "concluído":
        return "success";
      case "interrompido":
        return "error";
      default:
        return "default";
    }
  };

  const formatarData = (data) => {
    if (!data) return "Não definido";
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Tratamentos</Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddClick}>
          Novo Tratamento
        </Button>
      </Box>

      {tratamentos.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="textSecondary">Nenhum tratamento registrado.</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick} sx={{ mt: 2 }}>
            Iniciar Tratamento
          </Button>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {tratamentos.map((tratamento) => {
            const progresso = calcularProgressoTratamento(tratamento);
            const atrasado = verificarTratamentoAtrasado(tratamento);

            return (
              <Paper
                key={tratamento.id}
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  border: atrasado ? "1px solid #f44336" : "none"
                }}
              >
                <ListItem
                  button
                  onClick={() => handleExpandClick(tratamento.id)}
                  sx={{
                    bgcolor: expandido[tratamento.id] ? "rgba(0, 0, 0, 0.04)" : "transparent"
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <MedicationIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" component="span">
                              {tratamento.nome}
                            </Typography>
                            {atrasado && (
                              <Tooltip title="Tratamento atrasado">
                                <WarningIcon color="error" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box mt={0.5}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {tratamento.condicaoTratada}
                            </Typography>
                            <Chip
                              label={tratamento.status}
                              size="small"
                              color={getStatusColor(tratamento.status)}
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              icon={<PersonIcon fontSize="small" />}
                              label={tratamento.medicoNome}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              icon={<CalendarTodayIcon fontSize="small" />}
                              label={`Início: ${formatarData(tratamento.dataInicio)}`}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                            {tratamento.dataFim && (
                              <Chip
                                icon={<EventAvailableIcon fontSize="small" />}
                                label={`Término: ${formatarData(tratamento.dataFim)}`}
                                size="small"
                                variant="outlined"
                                sx={{ mb: 1 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                        justifyContent="space-between"
                        height="100%"
                      >
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Ver detalhes do tratamento">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onVerDetalhes(tratamento);
                              }}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={(e) => handleMenuClick(e, tratamento)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box sx={{ width: "100%", mt: 1 }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={0.5}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Progresso:
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {progresso}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progresso}
                            color={atrasado ? "error" : "primary"}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </ListItem>

                <Collapse in={expandido[tratamento.id]} timeout="auto" unmountOnExit>
                  <Divider />
                  <Box p={2}>
                    <Grid container spacing={2}>
                      {tratamento.descricao && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Descrição
                          </Typography>
                          <Typography variant="body2">{tratamento.descricao}</Typography>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            Etapas do Tratamento
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => onAdicionarEtapa(tratamento.id)}
                            disabled={
                              tratamento.status === "concluído" ||
                              tratamento.status === "interrompido"
                            }
                          >
                            Adicionar Etapa
                          </Button>
                        </Box>

                        {tratamento.etapas.length === 0 ? (
                          <Typography variant="body2" color="textSecondary">
                            Nenhuma etapa definida.
                          </Typography>
                        ) : (
                          <List dense disablePadding>
                            {tratamento.etapas.map((etapa, index) => (
                              <ListItem
                                key={index}
                                sx={{ bgcolor: "background.paper", mb: 1, borderRadius: 1 }}
                              >
                                <ListItemText
                                  primary={
                                    <Box display="flex" alignItems="center">
                                      <Typography variant="body2" fontWeight="medium">
                                        {etapa.numero}. {etapa.nome}
                                      </Typography>
                                      <Chip
                                        label={etapa.status}
                                        size="small"
                                        color={getStatusColor(
                                          etapa.status === "pendente"
                                            ? "não iniciado"
                                            : etapa.status
                                        )}
                                        sx={{ ml: 1 }}
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box mt={0.5}>
                                      {etapa.descricao && (
                                        <Typography variant="body2" color="textSecondary">
                                          {etapa.descricao}
                                        </Typography>
                                      )}
                                      <Grid container spacing={1} mt={0.5}>
                                        <Grid item>
                                          <Typography variant="caption" color="textSecondary">
                                            Início: {formatarData(etapa.dataInicio)}
                                          </Typography>
                                        </Grid>
                                        {etapa.dataFim && (
                                          <Grid item>
                                            <Typography variant="caption" color="textSecondary">
                                              Término previsto: {formatarData(etapa.dataFim)}
                                            </Typography>
                                          </Grid>
                                        )}
                                        {etapa.dataConclusao && (
                                          <Grid item>
                                            <Typography variant="caption" color="textSecondary">
                                              Concluído em: {formatarData(etapa.dataConclusao)}
                                            </Typography>
                                          </Grid>
                                        )}
                                      </Grid>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            Avaliações de Progresso
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => onAdicionarAvaliacao(tratamento.id)}
                            disabled={
                              tratamento.status === "concluído" ||
                              tratamento.status === "interrompido"
                            }
                          >
                            Nova Avaliação
                          </Button>
                        </Box>

                        {tratamento.avaliacoes.length === 0 ? (
                          <Typography variant="body2" color="textSecondary">
                            Nenhuma avaliação registrada.
                          </Typography>
                        ) : (
                          <List dense disablePadding>
                            {tratamento.avaliacoes.map((avaliacao, index) => (
                              <ListItem
                                key={index}
                                sx={{ bgcolor: "background.paper", mb: 1, borderRadius: 1 }}
                              >
                                <ListItemText
                                  primary={
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="space-between"
                                    >
                                      <Typography variant="body2" fontWeight="medium">
                                        Avaliação de {formatarData(avaliacao.data)}
                                      </Typography>
                                      <Chip
                                        label={`${avaliacao.progresso}% de progresso`}
                                        size="small"
                                        color="primary"
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box mt={0.5}>
                                      <Typography variant="body2" color="textSecondary">
                                        {avaliacao.descricao}
                                      </Typography>
                                      {avaliacao.medicoNome && (
                                        <Typography
                                          variant="caption"
                                          display="block"
                                          color="textSecondary"
                                        >
                                          Médico: {avaliacao.medicoNome}
                                        </Typography>
                                      )}
                                      {avaliacao.evolucao && (
                                        <Typography
                                          variant="caption"
                                          display="block"
                                          color="textSecondary"
                                        >
                                          Evolução: {avaliacao.evolucao}
                                        </Typography>
                                      )}
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Grid>

                      {tratamento.observacoes.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Observações
                          </Typography>
                          <List dense disablePadding>
                            {tratamento.observacoes.map((obs, index) => (
                              <ListItem
                                key={index}
                                sx={{ bgcolor: "background.paper", mb: 0.5, borderRadius: 1 }}
                              >
                                <ListItemText primary={obs} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Collapse>
              </Paper>
            );
          })}
        </List>
      )}

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            onVerDetalhes(tratamentoSelecionado);
            handleMenuClose();
          }}
        >
          <LaunchIcon fontSize="small" sx={{ mr: 1 }} />
          Ver detalhes
        </MenuItem>

        {tratamentoSelecionado && tratamentoSelecionado.status === "não iniciado" && (
          <MenuItem onClick={() => handleAtualizarStatus("em andamento")}>
            <TimerIcon fontSize="small" sx={{ mr: 1 }} />
            Iniciar tratamento
          </MenuItem>
        )}

        {tratamentoSelecionado && tratamentoSelecionado.status === "em andamento" && (
          <>
            <MenuItem onClick={() => handleAtualizarStatus("concluído")}>
              <CheckIcon fontSize="small" sx={{ mr: 1 }} />
              Marcar como concluído
            </MenuItem>
            <MenuItem onClick={() => handleAtualizarStatus("interrompido")}>
              <PauseIcon fontSize="small" sx={{ mr: 1 }} />
              Interromper tratamento
            </MenuItem>
          </>
        )}

        {tratamentoSelecionado &&
          (tratamentoSelecionado.status === "interrompido" ||
            tratamentoSelecionado.status === "concluído") && (
            <MenuItem onClick={() => handleAtualizarStatus("em andamento")}>
              <TimerIcon fontSize="small" sx={{ mr: 1 }} />
              Reativar tratamento
            </MenuItem>
          )}
      </Menu>
    </Box>
  );
};

TratamentosList.propTypes = {
  tratamentos: PropTypes.array.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onVerDetalhes: PropTypes.func.isRequired,
  onAtualizarStatus: PropTypes.func.isRequired,
  onAdicionarEtapa: PropTypes.func.isRequired,
  onAdicionarAvaliacao: PropTypes.func.isRequired
};

export default TratamentosList;
