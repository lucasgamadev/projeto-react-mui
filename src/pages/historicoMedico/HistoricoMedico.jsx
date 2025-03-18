import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  CalendarMonth as CalendarIcon,
  FileDownload as FileDownloadIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import HistoricoTimeline from "../../components/historicoMedico/HistoricoTimeline";
import { historicoExemplo } from "../../models/HistoricoMedicoModel";

// Lista de pacientes exemplo (a mesma do prontuário)
const pacientesExemplo = [
  { id: 101, nome: "Maria Silva", cpf: "123.456.789-00", dataNascimento: "15/05/1985" },
  { id: 102, nome: "João Oliveira", cpf: "987.654.321-00", dataNascimento: "22/11/1978" },
  { id: 103, nome: "Ana Carolina Santos", cpf: "111.222.333-44", dataNascimento: "30/07/1992" },
  { id: 104, nome: "Roberto Almeida", cpf: "555.666.777-88", dataNascimento: "14/03/1965" },
  { id: 105, nome: "Fernanda Costa", cpf: "999.888.777-66", dataNascimento: "05/12/1983" }
];

// Componente para exibir métricas de saúde do paciente
const MetricasSaude = ({ metricas = [] }) => {
  const [metricaSelecionada, setMetricaSelecionada] = useState(
    metricas.length > 0 ? metricas[0].tipo : ""
  );

  // Encontra a métrica selecionada
  const metricaAtual = metricas.find((m) => m.tipo === metricaSelecionada) || {
    tipo: "",
    medicoes: [],
    metas: []
  };

  // Obtém a última medição
  const ultimaMedicao =
    metricaAtual.medicoes && metricaAtual.medicoes.length > 0
      ? metricaAtual.medicoes[metricaAtual.medicoes.length - 1]
      : null;

  // Obtém a meta atual
  const metaAtual =
    metricaAtual.metas && metricaAtual.metas.length > 0
      ? metricaAtual.metas[metricaAtual.metas.length - 1]
      : null;

  const handleMetricaChange = (event) => {
    setMetricaSelecionada(event.target.value);
  };

  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Métricas de Saúde
      </Typography>

      {metricas.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          Não há métricas de saúde registradas para este paciente.
        </Typography>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>Selecione a métrica</InputLabel>
            <Select
              value={metricaSelecionada}
              label="Selecione a métrica"
              onChange={handleMetricaChange}
            >
              {metricas.map((metrica) => (
                <MenuItem key={metrica.tipo} value={metrica.tipo}>
                  {metrica.tipo.charAt(0).toUpperCase() + metrica.tipo.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {ultimaMedicao && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Última medição:</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {ultimaMedicao.valor} {ultimaMedicao.unidade}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(ultimaMedicao.data).toLocaleDateString("pt-BR")} -{" "}
                {ultimaMedicao.contexto}
              </Typography>

              {metaAtual && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Meta:</Typography>
                  <Typography variant="body1">
                    {metaAtual.valorMeta} {metaAtual.unidade}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prazo: {new Date(metaAtual.prazo).toLocaleDateString("pt-BR")}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Histórico de medições:
            </Typography>
            <Box sx={{ height: 150, overflow: "auto" }}>
              {metricaAtual.medicoes &&
                metricaAtual.medicoes
                  .sort((a, b) => new Date(b.data) - new Date(a.data))
                  .map((medicao, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider"
                      }}
                    >
                      <Typography variant="body2">
                        {new Date(medicao.data).toLocaleDateString("pt-BR")}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {medicao.valor} {medicao.unidade}
                      </Typography>
                    </Box>
                  ))}
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
};

// Componente para exibir tratamentos ativos do paciente
const Tratamentos = ({ tratamentos = [] }) => {
  const tratamentosAtivos = tratamentos.filter((t) => t.status === "em andamento");

  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tratamentos Ativos
      </Typography>

      {tratamentosAtivos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          Não há tratamentos ativos para este paciente.
        </Typography>
      ) : (
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          {tratamentosAtivos.map((tratamento) => (
            <Paper
              key={tratamento.id}
              elevation={1}
              sx={{ p: 2, mb: 2, borderLeft: "5px solid", borderColor: "primary.main" }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {tratamento.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Condição: {tratamento.condicaoTratada}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption">
                  Início: {new Date(tratamento.dataInicio).toLocaleDateString("pt-BR")}
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  Responsável: {tratamento.responsavel}
                </Typography>
              </Box>

              {tratamento.avaliacoes && tratamento.avaliacoes.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ display: "block" }}>
                    Último progresso:{" "}
                    {tratamento.avaliacoes[tratamento.avaliacoes.length - 1].progresso}%
                  </Typography>
                  <Box
                    sx={{
                      height: 8,
                      width: "100%",
                      bgcolor: "grey.300",
                      borderRadius: 1,
                      mt: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${tratamento.avaliacoes[tratamento.avaliacoes.length - 1].progresso}%`,
                        bgcolor: "primary.main",
                        borderRadius: 1
                      }}
                    />
                  </Box>
                </Box>
              )}

              {tratamento.etapas && tratamento.etapas.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">
                    Etapa atual:{" "}
                    {tratamento.etapas.find((e) => e.status === "em andamento")?.descricao ||
                      "Nenhuma etapa em andamento"}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Card>
  );
};

// Componente de detalhes do evento
const DetalhesEvento = ({ evento, open, onClose }) => {
  if (!evento) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">{evento.titulo}</Typography>
        <Tooltip title="Exportar">
          <IconButton>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Data:</Typography>
            <Typography variant="body1">
              {new Date(evento.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Local:</Typography>
            <Typography variant="body1">{evento.local}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Profissional:</Typography>
            <Typography variant="body1">{evento.profissional}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Especialidade:</Typography>
            <Typography variant="body1">{evento.especialidade}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Descrição:</Typography>
            <Typography variant="body1">{evento.descricao}</Typography>
          </Grid>

          {evento.diagnosticos && evento.diagnosticos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Diagnósticos:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {evento.diagnosticos.map((diag, idx) => (
                  <Chip key={idx} label={diag} size="small" color="primary" />
                ))}
              </Box>
            </Grid>
          )}

          {evento.procedimentos && evento.procedimentos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Procedimentos:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {evento.procedimentos.map((proc, idx) => (
                  <Chip key={idx} label={proc} size="small" color="info" />
                ))}
              </Box>
            </Grid>
          )}

          {evento.medicamentos && evento.medicamentos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Medicamentos:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {evento.medicamentos.map((med, idx) => (
                  <Chip key={idx} label={med} size="small" color="success" />
                ))}
              </Box>
            </Grid>
          )}

          {evento.resultado && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Resultado:</Typography>
              <Typography variant="body1">{evento.resultado}</Typography>
            </Grid>
          )}

          {evento.observacoes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Observações:</Typography>
              <Typography variant="body1">{evento.observacoes}</Typography>
            </Grid>
          )}

          {evento.anexos && evento.anexos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Anexos:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {evento.anexos.map((anexo, idx) => (
                  <Chip
                    key={idx}
                    label={anexo}
                    color="secondary"
                    clickable
                    onClick={() => console.log("Visualizar anexo:", anexo)}
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

// Componente principal de Histórico Médico
const HistoricoMedico = () => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [tabAtual, setTabAtual] = useState(0);
  const [filtros, setFiltros] = useState({
    tipoEvento: "todos",
    dataInicio: null,
    dataFim: null
  });
  const [openFiltros, setOpenFiltros] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [openDetalhesEvento, setOpenDetalhesEvento] = useState(false);

  // Efeito para simular busca de pacientes quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.length > 2) {
      // Filtra pacientes pelo nome ou CPF
      const resultados = pacientesExemplo.filter(
        (paciente) =>
          paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.cpf.includes(searchTerm)
      );
      setSearchResults(resultados);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Função para buscar histórico médico (simulação de API)
  const buscarHistoricoMedico = (pacienteId) => {
    setLoading(true);

    // Simulando uma chamada assíncrona a uma API
    setTimeout(() => {
      // Aqui estamos apenas usando o histórico de exemplo, mas seria uma chamada a API
      const historicoEncontrado = { ...historicoExemplo };

      // Atualiza o estado com o histórico encontrado
      setHistorico(historicoEncontrado);
      setLoading(false);
    }, 1000);
  };

  // Função para lidar com a seleção de paciente
  const handlePacienteSelecionado = (event, paciente) => {
    setPacienteSelecionado(paciente);

    if (paciente) {
      buscarHistoricoMedico(paciente.id);
    } else {
      setHistorico(null);
    }
  };

  // Função para voltar à seleção de paciente
  const handleVoltar = () => {
    setPacienteSelecionado(null);
    setHistorico(null);
    setTabAtual(0);
    setFiltros({
      tipoEvento: "todos",
      dataInicio: null,
      dataFim: null
    });
  };

  // Função para alterar a aba atual
  const handleTabChange = (event, newValue) => {
    setTabAtual(newValue);
  };

  // Função para lidar com mudanças nos filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Função para aplicar filtros nos eventos
  const eventosFiltrados = () => {
    if (!historico || !historico.eventos) return [];

    return historico.eventos.filter((evento) => {
      // Filtro por tipo de evento
      if (filtros.tipoEvento !== "todos" && evento.tipo !== filtros.tipoEvento) {
        return false;
      }

      // Filtro por data de início
      if (filtros.dataInicio && new Date(evento.data) < filtros.dataInicio) {
        return false;
      }

      // Filtro por data de fim
      if (filtros.dataFim && new Date(evento.data) > filtros.dataFim) {
        return false;
      }

      return true;
    });
  };

  // Função para lidar com clique em evento
  const handleEventoClick = (evento) => {
    setEventoSelecionado(evento);
    setOpenDetalhesEvento(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {!pacienteSelecionado ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Histórico Médico
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Selecione o paciente para visualizar o histórico médico:
            </Typography>
            <Autocomplete
              options={searchResults}
              getOptionLabel={(option) => `${option.nome} (${option.cpf})`}
              onChange={handlePacienteSelecionado}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar paciente"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Box>
        </Paper>
      ) : (
        <>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
          >
            <Button startIcon={<ArrowBackIcon />} onClick={handleVoltar} variant="outlined">
              Voltar
            </Button>
            <Typography variant="h5">Histórico Médico - {pacienteSelecionado.nome}</Typography>
            <Box>
              <Button
                startIcon={<FileDownloadIcon />}
                variant="outlined"
                sx={{ mr: 1 }}
                disabled={!historico}
              >
                Exportar PDF
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : historico ? (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <MetricasSaude metricas={historico.metricasSaude} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Tratamentos tratamentos={historico.tratamentos} />
                </Grid>
              </Grid>

              <Paper sx={{ mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabAtual}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab icon={<TimelineIcon />} label="Linha do Tempo" />
                    <Tab icon={<CalendarIcon />} label="Calendário" disabled />
                    <Tab icon={<AssessmentIcon />} label="Análise" disabled />
                  </Tabs>
                </Box>

                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 2
                    }}
                  >
                    <Button
                      startIcon={<FilterListIcon />}
                      onClick={() => setOpenFiltros(!openFiltros)}
                      variant="outlined"
                      size="small"
                    >
                      Filtros
                    </Button>
                  </Box>

                  <Collapse in={openFiltros}>
                    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Tipo de Evento</InputLabel>
                            <Select
                              value={filtros.tipoEvento}
                              label="Tipo de Evento"
                              onChange={(e) => handleFiltroChange("tipoEvento", e.target.value)}
                            >
                              <MenuItem value="todos">Todos</MenuItem>
                              <MenuItem value="consulta">Consultas</MenuItem>
                              <MenuItem value="exame">Exames</MenuItem>
                              <MenuItem value="cirurgia">Cirurgias</MenuItem>
                              <MenuItem value="medicacao">Medicações</MenuItem>
                              <MenuItem value="internacao">Internações</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <DatePicker
                            label="Data Inicial"
                            value={filtros.dataInicio}
                            onChange={(newValue) => handleFiltroChange("dataInicio", newValue)}
                            slotProps={{ textField: { size: "small", fullWidth: true } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <DatePicker
                            label="Data Final"
                            value={filtros.dataFim}
                            onChange={(newValue) => handleFiltroChange("dataFim", newValue)}
                            slotProps={{ textField: { size: "small", fullWidth: true } }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>

                  {tabAtual === 0 && (
                    <Box sx={{ mt: 2 }}>
                      <HistoricoTimeline
                        eventos={eventosFiltrados()}
                        onEventoClick={handleEventoClick}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            </>
          ) : (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography>Não foi possível carregar o histórico médico do paciente.</Typography>
            </Paper>
          )}
        </>
      )}

      <DetalhesEvento
        evento={eventoSelecionado}
        open={openDetalhesEvento}
        onClose={() => setOpenDetalhesEvento(false)}
      />
    </Container>
  );
};

export default HistoricoMedico;
