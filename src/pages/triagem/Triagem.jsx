import {
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  MedicalServices as MedicalServicesIcon,
  PersonSearch as PersonSearchIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FormularioTriagem from "../../components/triagem/FormularioTriagem";
import {
  criteriosClassificacaoRisco,
  temposMaximosEspera,
  triagemExemplo
} from "../../models/TriagemModel";

// Cores para cada classificação de risco
const coresClassificacao = {
  vermelho: "#e53935", // Emergência
  laranja: "#fb8c00", // Muito Urgente
  amarelo: "#fdd835", // Urgente
  verde: "#43a047", // Pouco Urgente
  azul: "#1e88e5" // Não Urgente
};

// Exemplo de pacientes para triagem
const pacientesExemplo = [
  {
    id: 101,
    nome: "Maria Silva",
    cpf: "123.456.789-00",
    dataNascimento: "15/05/1985",
    horaChegada: new Date("2023-10-15T08:15:00")
  },
  {
    id: 102,
    nome: "João Oliveira",
    cpf: "987.654.321-00",
    dataNascimento: "22/11/1978",
    horaChegada: new Date("2023-10-15T08:30:00")
  },
  {
    id: 103,
    nome: "Ana Carolina Santos",
    cpf: "111.222.333-44",
    dataNascimento: "30/07/1992",
    horaChegada: new Date("2023-10-15T08:45:00")
  },
  {
    id: 104,
    nome: "Roberto Almeida",
    cpf: "555.666.777-88",
    dataNascimento: "14/03/1965",
    horaChegada: new Date("2023-10-15T09:00:00")
  },
  {
    id: 105,
    nome: "Fernanda Costa",
    cpf: "999.888.777-66",
    dataNascimento: "05/12/1983",
    horaChegada: new Date("2023-10-15T09:15:00")
  }
];

// Lista de triagens exemplo para o dashboard
const triagensExemplo = [
  {
    ...triagemExemplo,
    id: 5001,
    pacienteId: 101,
    nomePaciente: "Maria Silva",
    dataHora: new Date("2023-10-15T08:30:00"),
    status: "concluída",
    classificacaoRisco: "amarelo"
  },
  {
    ...triagemExemplo,
    id: 5002,
    pacienteId: 102,
    nomePaciente: "João Oliveira",
    dataHora: new Date("2023-10-15T08:45:00"),
    status: "concluída",
    classificacaoRisco: "verde"
  },
  {
    ...triagemExemplo,
    id: 5003,
    pacienteId: 103,
    nomePaciente: "Ana Carolina Santos",
    dataHora: new Date("2023-10-15T09:00:00"),
    status: "concluída",
    classificacaoRisco: "laranja"
  },
  {
    ...triagemExemplo,
    id: 5004,
    pacienteId: 104,
    nomePaciente: "Roberto Almeida",
    dataHora: new Date("2023-10-15T09:15:00"),
    status: "aguardando",
    classificacaoRisco: null
  },
  {
    ...triagemExemplo,
    id: 5005,
    pacienteId: 105,
    nomePaciente: "Fernanda Costa",
    dataHora: new Date("2023-10-15T09:30:00"),
    status: "aguardando",
    classificacaoRisco: null
  }
];

// Componente que exibe um cartão com estatísticas
const EstatisticaCard = ({ titulo, valor, icone, cor }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Typography variant="subtitle2" color="text.secondary">
            {titulo}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            {valor}
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <Box
            sx={{
              backgroundColor: `${cor}22`,
              color: cor,
              borderRadius: "50%",
              width: 50,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 0 0 auto"
            }}
          >
            {icone}
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Componente principal da página de Triagem
const Triagem = () => {
  // Estados para gerenciar pacientes e triagens
  const [pacientesAguardando, setPacientesAguardando] = useState(pacientesExemplo);
  const [triagens, setTriagens] = useState(triagensExemplo);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabAtual, setTabAtual] = useState(0);

  // Estados para modal de triagem
  const [openTriagem, setOpenTriagem] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Estatísticas calculadas
  const estatisticas = {
    totalPacientes: pacientesAguardando.length,
    pacientesTriados: triagens.filter((t) => t.status === "concluída").length,
    pacientesAguardandoTriagem:
      pacientesAguardando.length - triagens.filter((t) => t.status === "concluída").length,
    tempoMedioEspera: "18 min"
  };

  // Contagem de pacientes por classificação
  const contagemPorClassificacao = {
    vermelho: triagens.filter((t) => t.classificacaoRisco === "vermelho").length,
    laranja: triagens.filter((t) => t.classificacaoRisco === "laranja").length,
    amarelo: triagens.filter((t) => t.classificacaoRisco === "amarelo").length,
    verde: triagens.filter((t) => t.classificacaoRisco === "verde").length,
    azul: triagens.filter((t) => t.classificacaoRisco === "azul").length
  };

  // Efeito para simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Aqui seria implementada a lógica para buscar dados atualizados
      // do servidor em um sistema real
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Função para buscar pacientes
  const buscarPacientes = () => {
    // Aqui seria implementada a lógica para buscar pacientes do servidor
    // Por enquanto, apenas filtra os pacientes de exemplo
    if (searchTerm) {
      return pacientesAguardando.filter(
        (p) => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm)
      );
    }
    return pacientesAguardando;
  };

  // Função para ordenar triagens por prioridade
  const ordenarPorPrioridade = (a, b) => {
    const ordemPrioridade = {
      vermelho: 1,
      laranja: 2,
      amarelo: 3,
      verde: 4,
      azul: 5,
      null: 6
    };

    return (
      ordemPrioridade[a.classificacaoRisco || "null"] -
      ordemPrioridade[b.classificacaoRisco || "null"]
    );
  };

  // Handler para mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabAtual(newValue);
  };

  // Handler para iniciar triagem de um paciente
  const handleIniciarTriagem = (paciente) => {
    setPacienteSelecionado(paciente);
    setOpenTriagem(true);
  };

  // Handler para concluir a triagem
  const handleConcluirTriagem = (dadosTriagem, classificacao) => {
    // Aqui seria implementada a lógica para salvar a triagem no servidor

    // Cria uma nova triagem com os dados fornecidos
    const novaTriagem = {
      id: Date.now(),
      pacienteId: dadosTriagem.pacienteId,
      nomePaciente: dadosTriagem.nomePaciente,
      dataHora: new Date(),
      status: "concluída",
      classificacaoRisco: classificacao,
      motivoAtendimento: dadosTriagem.motivoAtendimento,
      queixaPrincipal: dadosTriagem.queixaPrincipal,
      sintomas: dadosTriagem.sintomas,
      tempoEstimadoAtendimento: temposMaximosEspera[classificacao],
      sinaisVitais: dadosTriagem.sinaisVitais,
      historicoRelevante: dadosTriagem.historicoRelevante,
      observacoesEnfermagem: dadosTriagem.observacoesEnfermagem,
      profissionalTriagem: "Enfermeira Ana Santos", // Em um sistema real, seria o usuário logado
      localAtendimento: dadosTriagem.localAtendimento,
      criteriosClassificacao: {
        classificacao,
        criterios: criteriosClassificacaoRisco[classificacao]
      },
      dataConclusaoTriagem: new Date()
    };

    // Atualiza o estado com a nova triagem
    setTriagens((prev) => [novaTriagem, ...prev]);

    // Fecha o modal de triagem
    setOpenTriagem(false);
    setPacienteSelecionado(null);
  };

  // Calcula o tempo de espera para um paciente
  const calcularTempoEspera = (paciente) => {
    const agora = new Date();
    const tempoEsperaMs = agora - new Date(paciente.horaChegada);
    const tempoEsperaMin = Math.floor(tempoEsperaMs / 60000);

    return tempoEsperaMin;
  };

  // Verifica se o tempo de espera excedeu o limite para a classificação
  const tempoExcedido = (triagem) => {
    if (!triagem.classificacaoRisco) return false;

    const tempoMaximo = temposMaximosEspera[triagem.classificacaoRisco];
    const tempoEspera = calcularTempoEspera({ horaChegada: triagem.dataHora });

    return tempoEspera > tempoMaximo;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sistema de Triagem
      </Typography>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <EstatisticaCard
            titulo="Total de Pacientes"
            valor={estatisticas.totalPacientes}
            icone={<PersonSearchIcon fontSize="large" />}
            cor="#1e88e5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EstatisticaCard
            titulo="Pacientes Triados"
            valor={estatisticas.pacientesTriados}
            icone={<MedicalServicesIcon fontSize="large" />}
            cor="#43a047"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EstatisticaCard
            titulo="Aguardando Triagem"
            valor={estatisticas.pacientesAguardandoTriagem}
            icone={<AccessTimeIcon fontSize="large" />}
            cor="#fb8c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EstatisticaCard
            titulo="Tempo Médio de Espera"
            valor={estatisticas.tempoMedioEspera}
            icone={<WarningIcon fontSize="large" />}
            cor="#e53935"
          />
        </Grid>
      </Grid>

      {/* Dashboard de triagem */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabAtual}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Pacientes Aguardando" />
            <Tab
              label={
                <Badge
                  color="error"
                  badgeContent={
                    contagemPorClassificacao.vermelho + contagemPorClassificacao.laranja
                  }
                  showZero={false}
                >
                  Classificados por Risco
                </Badge>
              }
            />
            <Tab label="Histórico" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          {/* Barra de pesquisa e filtros */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextField
              size="small"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mr: 1, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <SearchIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                )
              }}
            />
            <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ mr: 1 }}>
              Filtros
            </Button>
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Conteúdo da aba atual */}
          <Box sx={{ mt: 2 }}>
            {/* Aba de pacientes aguardando */}
            {tabAtual === 0 && (
              <List sx={{ width: "100%" }}>
                {buscarPacientes().length === 0 ? (
                  <Typography align="center" sx={{ py: 4 }}>
                    Nenhum paciente encontrado
                  </Typography>
                ) : (
                  buscarPacientes().map((paciente) => {
                    // Verifica se o paciente já foi triado
                    const triagem = triagens.find((t) => t.pacienteId === paciente.id);
                    const tempoEspera = calcularTempoEspera(paciente);

                    return (
                      <Paper
                        key={paciente.id}
                        sx={{
                          mb: 2,
                          backgroundColor: triagem?.classificacaoRisco
                            ? `${coresClassificacao[triagem.classificacaoRisco]}11`
                            : "white",
                          borderLeft: triagem?.classificacaoRisco
                            ? `5px solid ${coresClassificacao[triagem.classificacaoRisco]}`
                            : "5px solid transparent"
                        }}
                      >
                        <ListItem
                          secondaryAction={
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() => handleIniciarTriagem(paciente)}
                              disabled={triagem?.status === "concluída"}
                            >
                              {triagem?.status === "concluída" ? "Visualizar" : "Iniciar Triagem"}
                            </Button>
                          }
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="subtitle1" component="span">
                                  {paciente.nome}
                                </Typography>
                                {triagem?.classificacaoRisco && (
                                  <Chip
                                    label={triagem.classificacaoRisco.toUpperCase()}
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      backgroundColor:
                                        coresClassificacao[triagem.classificacaoRisco],
                                      color: "white",
                                      fontWeight: "bold"
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="body2" component="span">
                                  CPF: {paciente.cpf} | Data Nasc.: {paciente.dataNascimento}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                  <AccessTimeIcon
                                    fontSize="small"
                                    sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    component="span"
                                    color={tempoEspera > 30 ? "error.main" : "text.secondary"}
                                  >
                                    Tempo de espera: {tempoEspera} min
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Paper>
                    );
                  })
                )}
              </List>
            )}

            {/* Aba de pacientes classificados por risco */}
            {tabAtual === 1 && (
              <Box>
                {/* Legenda da classificação de risco */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {Object.entries(coresClassificacao).map(([nivel, cor]) => (
                    <Chip
                      key={nivel}
                      label={`${nivel.toUpperCase()} (${contagemPorClassificacao[nivel] || 0})`}
                      sx={{
                        backgroundColor: cor,
                        color: "white",
                        fontWeight: "bold"
                      }}
                    />
                  ))}
                </Box>

                {/* Lista de pacientes classificados */}
                <List sx={{ width: "100%" }}>
                  {triagens
                    .filter((t) => t.status === "concluída")
                    .sort(ordenarPorPrioridade)
                    .map((triagem) => {
                      const tempoEspera = calcularTempoEspera({ horaChegada: triagem.dataHora });
                      const excedeuTempo = tempoExcedido(triagem);

                      return (
                        <Paper
                          key={triagem.id}
                          sx={{
                            mb: 2,
                            backgroundColor: `${coresClassificacao[triagem.classificacaoRisco]}11`,
                            borderLeft: `5px solid ${coresClassificacao[triagem.classificacaoRisco]}`,
                            position: "relative",
                            overflow: "hidden"
                          }}
                        >
                          {excedeuTempo && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "error.main",
                                color: "white",
                                padding: "2px 8px",
                                transform: "rotate(45deg) translate(15px, -15px)",
                                transformOrigin: "top right",
                                width: 150,
                                textAlign: "center",
                                zIndex: 1
                              }}
                            >
                              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                                TEMPO EXCEDIDO
                              </Typography>
                            </Box>
                          )}

                          <ListItem
                            secondaryAction={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: 30,
                                  fontWeight: "bold",
                                  color: excedeuTempo ? "error.main" : "text.primary"
                                }}
                              >
                                {tempoEspera} min
                              </Typography>
                            }
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Typography variant="subtitle1" component="span">
                                    {triagem.nomePaciente}
                                  </Typography>
                                  <Chip
                                    label={triagem.classificacaoRisco.toUpperCase()}
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      backgroundColor:
                                        coresClassificacao[triagem.classificacaoRisco],
                                      color: "white",
                                      fontWeight: "bold"
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}>
                                  <Typography variant="body2">
                                    {triagem.motivoAtendimento}
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Tempo máximo:{" "}
                                      {temposMaximosEspera[triagem.classificacaoRisco]} min | Triado
                                      por: {triagem.profissionalTriagem}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        </Paper>
                      );
                    })}
                </List>
              </Box>
            )}

            {/* Aba de histórico */}
            {tabAtual === 2 && (
              <Typography align="center" sx={{ py: 4 }}>
                Histórico de triagens (em desenvolvimento)
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Modal de Triagem */}
      <Dialog open={openTriagem} onClose={() => setOpenTriagem(false)} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          Triagem de Paciente
          <IconButton onClick={() => setOpenTriagem(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {pacienteSelecionado && (
            <FormularioTriagem paciente={pacienteSelecionado} onSubmit={handleConcluirTriagem} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Triagem;
