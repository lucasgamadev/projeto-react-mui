import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import TratamentoEvolucao from "../../components/tratamento/TratamentoEvolucao";
import TratamentoFormModal from "../../components/tratamento/TratamentoFormModal";
import TratamentosList from "../../components/tratamento/TratamentosList";
import { atualizarStatusTratamento } from "../../models/TratamentoModel";

// Dados simulados para demonstração
const pacientesMock = [
  { id: 1, nome: "Maria Silva", idade: 45, documento: "123.456.789-01" },
  { id: 2, nome: "João Santos", idade: 32, documento: "987.654.321-09" },
  { id: 3, nome: "Ana Oliveira", idade: 28, documento: "456.789.123-45" }
];

const medicosMock = [
  { id: 1, nome: "Dr. Carlos Mendes", especialidade: "Cardiologia" },
  { id: 2, nome: "Dra. Fernanda Lima", especialidade: "Neurologia" },
  { id: 3, nome: "Dr. Rafael Costa", especialidade: "Ortopedia" }
];

const tratamentosMock = [
  {
    id: 1,
    pacienteId: 1,
    nome: "Tratamento Hipertensão",
    descricao: "Tratamento para controle de hipertensão arterial",
    condicaoTratada: "Hipertensão",
    dataInicio: new Date(2024, 2, 10),
    dataFim: new Date(2024, 8, 10),
    status: "em andamento",
    medicoId: 1,
    medicoNome: "Dr. Carlos Mendes",
    especialidade: "Cardiologia",
    etapas: [
      {
        id: 101,
        numero: 1,
        nome: "Ajuste medicamentoso",
        descricao: "Ajuste da dosagem e monitoramento inicial",
        dataInicio: new Date(2024, 2, 10),
        dataFim: new Date(2024, 3, 10),
        dataConclusao: new Date(2024, 3, 8),
        status: "concluída",
        resultado: "Medicação ajustada com sucesso",
        observacoes: "Paciente respondeu bem ao tratamento"
      },
      {
        id: 102,
        numero: 2,
        nome: "Monitoramento periódico",
        descricao: "Acompanhamento mensal da pressão arterial",
        dataInicio: new Date(2024, 3, 11),
        dataFim: new Date(2024, 8, 10),
        dataConclusao: null,
        status: "em andamento",
        resultado: "",
        observacoes: "Monitoramento em andamento"
      }
    ],
    avaliacoes: [
      {
        id: 201,
        data: new Date(2024, 3, 8),
        medicoId: 1,
        medicoNome: "Dr. Carlos Mendes",
        descricao: "Primeira avaliação após ajuste medicamentoso",
        progresso: 30,
        sintomas: ["Leve tontura ocasional"],
        evolucao: "Melhora significativa nos níveis pressóricos",
        observacoes: "Continuar com o tratamento conforme prescrito"
      }
    ],
    lembretes: [],
    metricas: [],
    observacoes: [
      "Paciente com histórico familiar de problemas cardíacos",
      "Recomendado adoção de dieta hipossódica"
    ],
    ultimaAtualizacao: new Date(2024, 3, 8)
  },
  {
    id: 2,
    pacienteId: 2,
    nome: "Reabilitação de Joelho",
    descricao: "Tratamento fisioterápico pós-cirúrgico",
    condicaoTratada: "Reconstrução de LCA",
    dataInicio: new Date(2024, 1, 15),
    dataFim: new Date(2024, 7, 15),
    status: "em andamento",
    medicoId: 3,
    medicoNome: "Dr. Rafael Costa",
    especialidade: "Ortopedia",
    etapas: [
      {
        id: 103,
        numero: 1,
        nome: "Fase inicial de recuperação",
        descricao: "Controle de dor e edema",
        dataInicio: new Date(2024, 1, 15),
        dataFim: new Date(2024, 2, 15),
        dataConclusao: new Date(2024, 2, 20),
        status: "concluída",
        resultado: "Edema controlado",
        observacoes: "Paciente evoluiu bem, mas com atraso de 5 dias"
      },
      {
        id: 104,
        numero: 2,
        nome: "Fortalecimento muscular",
        descricao: "Exercícios de fortalecimento gradual",
        dataInicio: new Date(2024, 2, 21),
        dataFim: new Date(2024, 4, 21),
        dataConclusao: null,
        status: "em andamento",
        resultado: "",
        observacoes: "Progredindo conforme esperado"
      }
    ],
    avaliacoes: [
      {
        id: 202,
        data: new Date(2024, 2, 20),
        medicoId: 3,
        medicoNome: "Dr. Rafael Costa",
        descricao: "Avaliação após fase inicial",
        progresso: 25,
        sintomas: ["Dor leve ao movimento", "Limitação de amplitude"],
        evolucao: "Evolução dentro do esperado para o período",
        observacoes: "Iniciar fase de fortalecimento"
      }
    ],
    lembretes: [],
    metricas: [],
    observacoes: [
      "Paciente atleta amador",
      "Objetivo de retorno às atividades esportivas em 6 meses"
    ],
    ultimaAtualizacao: new Date(2024, 2, 20)
  }
];

const Tratamento = () => {
  const [tratamentos, setTratamentos] = useState(tratamentosMock);
  const [pacientes] = useState(pacientesMock);
  const [medicos] = useState(medicosMock);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [selectedTratamento, setSelectedTratamento] = useState(null);
  const [openDetalhesModal, setOpenDetalhesModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleOpenFormModal = (paciente) => {
    setSelectedPaciente(paciente);
    setOpenFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenFormModal(false);
  };

  const handleSaveTratamento = (novoTratamento) => {
    setTratamentos([...tratamentos, novoTratamento]);
  };

  const handleVerDetalhes = (tratamento) => {
    setSelectedTratamento(tratamento);
    setOpenDetalhesModal(true);
  };

  const handleAtualizarStatus = (tratamentoId, novoStatus) => {
    const tratamentosAtualizados = tratamentos.map((tratamento) => {
      if (tratamento.id === tratamentoId) {
        const tratamentoAtualizado = atualizarStatusTratamento(tratamento, novoStatus);
        return tratamentoAtualizado;
      }
      return tratamento;
    });

    setTratamentos(tratamentosAtualizados);
  };

  const handleAdicionarEtapa = (tratamentoId) => {
    // Implementação para adicionar uma nova etapa ao tratamento
    // Aqui seria aberto um modal para coleta dos dados da etapa
    alert(`Adicionar etapa ao tratamento ${tratamentoId}`);
  };

  const handleAdicionarAvaliacao = (tratamentoId) => {
    // Implementação para adicionar uma nova avaliação ao tratamento
    // Aqui seria aberto um modal para coleta dos dados da avaliação
    alert(`Adicionar avaliação ao tratamento ${tratamentoId}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Acompanhamento de Tratamentos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenFormModal(pacientes[0])}
        >
          Novo Tratamento
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="abas de tratamentos">
                <Tab label="Todos os Tratamentos" />
                <Tab label="Em Andamento" />
                <Tab label="Concluídos" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <TratamentosList
                tratamentos={tratamentos}
                onAddClick={() => handleOpenFormModal(pacientes[0])}
                onVerDetalhes={handleVerDetalhes}
                onAtualizarStatus={handleAtualizarStatus}
                onAdicionarEtapa={handleAdicionarEtapa}
                onAdicionarAvaliacao={handleAdicionarAvaliacao}
              />
            )}

            {tabValue === 1 && (
              <TratamentosList
                tratamentos={tratamentos.filter((t) => t.status === "em andamento")}
                onAddClick={() => handleOpenFormModal(pacientes[0])}
                onVerDetalhes={handleVerDetalhes}
                onAtualizarStatus={handleAtualizarStatus}
                onAdicionarEtapa={handleAdicionarEtapa}
                onAdicionarAvaliacao={handleAdicionarAvaliacao}
              />
            )}

            {tabValue === 2 && (
              <TratamentosList
                tratamentos={tratamentos.filter((t) => t.status === "concluído")}
                onAddClick={() => handleOpenFormModal(pacientes[0])}
                onVerDetalhes={handleVerDetalhes}
                onAtualizarStatus={handleAtualizarStatus}
                onAdicionarEtapa={handleAdicionarEtapa}
                onAdicionarAvaliacao={handleAdicionarAvaliacao}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para cadastro de novo tratamento */}
      <TratamentoFormModal
        open={openFormModal}
        onClose={handleCloseFormModal}
        pacienteId={selectedPaciente?.id || 0}
        pacienteNome={selectedPaciente?.nome || ""}
        onSave={handleSaveTratamento}
        medicos={medicos}
      />

      {/* Modal para visualização detalhada do tratamento */}
      <Dialog
        open={openDetalhesModal}
        onClose={() => setOpenDetalhesModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes do Tratamento</DialogTitle>
        <DialogContent>
          {selectedTratamento && <TratamentoEvolucao tratamento={selectedTratamento} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalhesModal(false)} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tratamento;
