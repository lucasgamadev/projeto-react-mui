import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import AlertaExamesCriticos from "../components/exames/AlertaExamesCriticos";
import SolicitacaoExameForm from "../components/exames/SolicitacaoExameForm";
import TipoExameForm from "../components/exames/TipoExameForm";
import VisualizadorResultadosExames from "../components/exames/VisualizadorResultadosExames";

const Exames = () => {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [dialogCadastroAberto, setDialogCadastroAberto] = useState(false);
  const [dialogSolicitacaoAberto, setDialogSolicitacaoAberto] = useState(false);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [medicoLogado, setMedicoLogado] = useState({ id: "medico-1", nome: "Dr. Exemplo" }); // Temporário
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  const handleMudarTab = (event, novoValor) => {
    setTabAtiva(novoValor);
  };

  const handleAbrirDialogCadastro = () => {
    setDialogCadastroAberto(true);
  };

  const handleFecharDialogCadastro = () => {
    setDialogCadastroAberto(false);
  };

  const handleAbrirDialogSolicitacao = () => {
    // Aqui seria aberta uma busca de pacientes
    // Para exemplo, estamos apenas determinando um paciente fixo
    setPacienteSelecionado({ id: "paciente-1", nome: "João Silva" });
    setDialogSolicitacaoAberto(true);
  };

  const handleFecharDialogSolicitacao = () => {
    setDialogSolicitacaoAberto(false);
  };

  const handleSucessoCadastro = () => {
    // Ação após cadastro bem-sucedido
    handleFecharDialogCadastro();
  };

  const handleSucessoSolicitacao = () => {
    // Ação após solicitação bem-sucedida
    handleFecharDialogSolicitacao();
  };

  const handleFiltrarPaciente = (e) => {
    setFiltroPaciente(e.target.value);
  };

  const handleVerExameAlerta = (exame) => {
    // Aqui seria implementada a navegação para a visualização detalhada do exame
    console.log("Ver exame em alerta:", exame);
    setTabAtiva(2); // Muda para a aba de resultados
    setPacienteSelecionado({ id: exame.pacienteId, nome: exame.pacienteNome || "Paciente" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Tabs value={tabAtiva} onChange={handleMudarTab} aria-label="abas de exames">
            <Tab label="Visão Geral" />
            <Tab label="Cadastro de Tipos" />
            <Tab label="Resultados" />
            <Tab label="Alertas" />
          </Tabs>

          <Box>
            {tabAtiva === 1 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAbrirDialogCadastro}
                sx={{ mr: 1 }}
              >
                Novo Tipo de Exame
              </Button>
            )}

            {tabAtiva === 2 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAbrirDialogSolicitacao}
                sx={{ mr: 1 }}
              >
                Solicitar Exame
              </Button>
            )}
          </Box>
        </Box>

        {/* Visão Geral */}
        {tabAtiva === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Dashboard de Exames
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Exames Pendentes
                    </Typography>
                    <Typography variant="h3" align="center" sx={{ my: 3 }}>
                      12
                    </Typography>
                    <Button fullWidth variant="outlined">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Resultados Críticos
                    </Typography>
                    <Typography variant="h3" align="center" sx={{ my: 3, color: "error.main" }}>
                      3
                    </Typography>
                    <Button fullWidth variant="outlined" color="error">
                      Ver Alertas
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Estatísticas de Exames
                    </Typography>
                    <Box
                      sx={{
                        height: 250,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Aqui seriam exibidos gráficos de estatísticas de exames
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Cadastro de Tipos */}
        {tabAtiva === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Tipos de Exames Cadastrados
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Aqui seria exibida uma tabela com os tipos de exames já cadastrados no sistema.
                Utilizando o botão acima, é possível adicionar novos tipos de exames.
              </Typography>
            </Box>
          </Box>
        )}

        {/* Resultados */}
        {tabAtiva === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Resultados de Exames
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Buscar paciente..."
                value={filtroPaciente}
                onChange={handleFiltrarPaciente}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {pacienteSelecionado ? (
                <VisualizadorResultadosExames
                  pacienteId={pacienteSelecionado.id}
                  medicoLogado={medicoLogado}
                />
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 5, color: "text.secondary" }}>
                  Selecione um paciente para visualizar seus exames
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Alertas */}
        {tabAtiva === 3 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Alertas de Resultados Críticos
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <AlertaExamesCriticos onVerExame={handleVerExameAlerta} />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Dialog para cadastro de tipo de exame */}
      <Dialog
        open={dialogCadastroAberto}
        onClose={handleFecharDialogCadastro}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cadastrar Novo Tipo de Exame</DialogTitle>
        <DialogContent>
          <TipoExameForm onSuccess={handleSucessoCadastro} />
        </DialogContent>
      </Dialog>

      {/* Dialog para solicitação de exame */}
      <Dialog
        open={dialogSolicitacaoAberto}
        onClose={handleFecharDialogSolicitacao}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Solicitar Exame para {pacienteSelecionado?.nome}</DialogTitle>
        <DialogContent>
          {pacienteSelecionado && (
            <SolicitacaoExameForm
              pacienteId={pacienteSelecionado.id}
              medicoId={medicoLogado.id}
              onSuccess={handleSucessoSolicitacao}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Exames;
