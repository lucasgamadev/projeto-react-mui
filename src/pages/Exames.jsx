import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import AlertaExamesCriticos from "../components/exames/AlertaExamesCriticos";
import DetalhePaciente from "../components/exames/DetalhePaciente";
import EstatisticasExames from "../components/exames/EstatisticasExames";
import ExportarResultadoExame from "../components/exames/ExportarResultadoExame";
import GraficosEstatisticos from "../components/exames/GraficosEstatisticos";
import ResumoDashboardMedico from "../components/exames/ResumoDashboardMedico";
import SolicitacaoExameForm from "../components/exames/SolicitacaoExameForm";
import TabelaTiposExames from "../components/exames/TabelaTiposExames";
import TipoExameForm from "../components/exames/TipoExameForm";
import VisualizadorResultadosExames from "../components/exames/VisualizadorResultadosExames";
import ExameModel from "../models/ExameModel";

const Exames = () => {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [dialogCadastroAberto, setDialogCadastroAberto] = useState(false);
  const [dialogSolicitacaoAberto, setDialogSolicitacaoAberto] = useState(false);
  const [dialogDetalhesAberto, setDialogDetalhesAberto] = useState(false);
  const [dialogExclusaoAberto, setDialogExclusaoAberto] = useState(false);
  const [dialogExportarAberto, setDialogExportarAberto] = useState(false);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [medicoLogado, setMedicoLogado] = useState({ id: "medico1", nome: "Dr. Roberto Almeida" }); // Usando médico do JSON
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState(null);
  const [exameSelecionado, setExameSelecionado] = useState(null);
  const [periodoEstatisticas, setPeriodoEstatisticas] = useState("mes");
  const [listaPacientes, setListaPacientes] = useState([]);
  const [carregandoPacientes, setCarregandoPacientes] = useState(false);

  useEffect(() => {
    // Se trocar de tab, podemos limpar algumas seleções
    if (tabAtiva !== 2) {
      setPacienteSelecionado(null);
    }

    // Carregar lista de pacientes
    carregarPacientes();
  }, [tabAtiva]);

  const carregarPacientes = async () => {
    try {
      setCarregandoPacientes(true);
      const pacientes = await ExameModel.listarPacientes();
      setListaPacientes(pacientes);
      setCarregandoPacientes(false);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setCarregandoPacientes(false);
    }
  };

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
    if (!pacienteSelecionado) {
      // Se não há paciente selecionado na guia de resultados, abrimos o dialog para selecionar
      setDialogSolicitacaoAberto(true);
    } else {
      // Se já há um paciente selecionado, usamos ele
      setDialogSolicitacaoAberto(true);
    }
  };

  const handleFecharDialogSolicitacao = () => {
    setDialogSolicitacaoAberto(false);
  };

  const handleViewTipoExame = (tipoExame) => {
    setTipoExameSelecionado(tipoExame);
    setDialogDetalhesAberto(true);
  };

  const handleFecharDialogDetalhes = () => {
    setDialogDetalhesAberto(false);
  };

  const handleExcluirTipoExame = (tipoExame) => {
    setTipoExameSelecionado(tipoExame);
    setDialogExclusaoAberto(true);
  };

  const handleFecharDialogExclusao = () => {
    setDialogExclusaoAberto(false);
  };

  const handleConfirmarExclusao = async () => {
    try {
      // Aqui você implementaria a exclusão real
      await ExameModel.excluirTipoExame(tipoExameSelecionado.id);
      console.log("Tipo de exame excluído:", tipoExameSelecionado);

      // Fechar o diálogo
      setDialogExclusaoAberto(false);

      // Atualizar os componentes que mostram tipos de exames
      // Isso seria feito pelo efeito de atualização nos componentes
    } catch (error) {
      console.error("Erro ao excluir tipo de exame:", error);
    }
  };

  const handleEditarTipoExame = (tipoExame) => {
    // Aqui você implementaria a edição
    console.log("Editando tipo de exame:", tipoExame);
  };

  const handleSucessoCadastro = () => {
    // Ação após cadastro bem-sucedido
    handleFecharDialogCadastro();
  };

  const handleSucessoSolicitacao = () => {
    // Ação após solicitação bem-sucedida
    handleFecharDialogSolicitacao();
  };

  const handleFiltrarPaciente = (e, value) => {
    if (value) {
      setPacienteSelecionado(value);
    }
  };

  const handleVerExameAlerta = (exame) => {
    // Navegar para a visualização detalhada do exame
    setTabAtiva(2); // Muda para a aba de resultados

    // Selecionar o paciente do exame
    const paciente = listaPacientes.find((p) => p.id === exame.pacienteId);
    if (paciente) {
      setPacienteSelecionado(paciente);
    } else {
      setPacienteSelecionado({
        id: exame.pacienteId,
        nome: exame.pacienteNome || "Paciente"
      });
    }
  };

  const handleExportarResultado = (exame) => {
    setExameSelecionado(exame);
    setDialogExportarAberto(true);
  };

  const handleFecharDialogExportar = () => {
    setDialogExportarAberto(false);
  };

  const tabs = [
    { index: 0, label: "Dashboard", icon: <DashboardIcon /> },
    { index: 1, label: "Tipos de Exame", icon: <CategoryIcon /> },
    { index: 2, label: "Resultados", icon: <AssignmentIcon /> },
    { index: 3, label: "Alertas", icon: <NotificationsIcon /> },
    { index: 4, label: "Pacientes", icon: <PeopleIcon /> }
  ];

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
            <Tab label="Pacientes" />
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

        {/* Dashboard */}
        {tabAtiva === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Dashboard de Exames
            </Typography>

            <Box sx={{ mt: 3, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <ResumoDashboardMedico medicoId={medicoLogado.id} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <EstatisticasExames />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Análise de Exames
              </Typography>
              <GraficosEstatisticos />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Resultados Críticos
              </Typography>
              <AlertaExamesCriticos onVerExame={handleVerExameAlerta} mostrarApenasResumo={true} />
            </Box>
          </Box>
        )}

        {/* Cadastro de Tipos */}
        {tabAtiva === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Tipos de Exames Cadastrados
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <TabelaTiposExames
                onEdit={handleEditarTipoExame}
                onDelete={handleExcluirTipoExame}
                onView={handleViewTipoExame}
              />
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
              <Autocomplete
                options={listaPacientes}
                getOptionLabel={(option) => option.nome}
                value={pacienteSelecionado}
                onChange={handleFiltrarPaciente}
                loading={carregandoPacientes}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="Selecionar paciente..."
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        endAdornment: (
                          <>
                            {carregandoPacientes ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                      sx={{ mb: 3 }}
                    />
                  )
                }}
              />

              {pacienteSelecionado ? (
                <VisualizadorResultadosExames
                  pacienteId={pacienteSelecionado.id}
                  medicoLogado={medicoLogado}
                  onExportarResultado={handleExportarResultado}
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

        {/* Pacientes */}
        {tabAtiva === 4 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Detalhes dos Pacientes
            </Typography>

            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar paciente por nome..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={(e) => {
                  const termo = e.target.value.toLowerCase();
                  if (termo.length > 0) {
                    const pacientesFiltrados = listaPacientes.filter((p) =>
                      p.nome.toLowerCase().includes(termo)
                    );
                    setListaPacientes(pacientesFiltrados);
                  } else {
                    carregarPacientes();
                  }
                }}
                sx={{ mb: 3 }}
              />

              <Grid container spacing={3}>
                {listaPacientes.slice(0, 12).map((paciente) => (
                  <Grid item xs={12} sm={6} md={4} key={paciente.id}>
                    <DetalhePaciente pacienteId={paciente.id} />
                  </Grid>
                ))}

                {listaPacientes.length === 0 && !carregandoPacientes && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ py: 5, color: "text.secondary" }}
                    >
                      Nenhum paciente encontrado
                    </Typography>
                  </Grid>
                )}

                {carregandoPacientes && (
                  <Grid item xs={12} display="flex" justifyContent="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </Grid>
                )}
              </Grid>
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
        <DialogTitle>
          {pacienteSelecionado
            ? `Solicitar Exame para ${pacienteSelecionado.nome}`
            : "Solicitar Exame"}
        </DialogTitle>
        <DialogContent>
          {!pacienteSelecionado ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selecione um paciente:
              </Typography>
              <Autocomplete
                options={listaPacientes}
                getOptionLabel={(option) => option.nome}
                onChange={(e, novoPaciente) => setPacienteSelecionado(novoPaciente)}
                loading={carregandoPacientes}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="Buscar paciente..."
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {carregandoPacientes ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )
                }}
              />
            </Box>
          ) : (
            <SolicitacaoExameForm
              pacienteId={pacienteSelecionado.id}
              medicoId={medicoLogado.id}
              onSuccess={handleSucessoSolicitacao}
            />
          )}
        </DialogContent>
        {!pacienteSelecionado && (
          <DialogActions>
            <Button onClick={handleFecharDialogSolicitacao}>Cancelar</Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Dialog para visualizar detalhes do tipo de exame */}
      <Dialog
        open={dialogDetalhesAberto}
        onClose={handleFecharDialogDetalhes}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes do Tipo de Exame</DialogTitle>
        <DialogContent>
          {tipoExameSelecionado && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{tipoExameSelecionado.nome}</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {tipoExameSelecionado.descricao}
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Categoria
              </Typography>
              <Typography variant="body1" paragraph>
                {tipoExameSelecionado.categoria}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Preparo Necessário
              </Typography>
              <Typography variant="body1" paragraph>
                {tipoExameSelecionado.preparoNecessario || "Nenhum preparo necessário"}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Parâmetros Avaliados
              </Typography>
              {tipoExameSelecionado.valoresReferencia &&
              Object.entries(tipoExameSelecionado.valoresReferencia).length > 0 ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  {Object.entries(tipoExameSelecionado.valoresReferencia).map(([param, ref]) => (
                    <Box component="li" key={param} sx={{ mb: 1 }}>
                      <Typography variant="body1">
                        <strong>{param}:</strong> {ref.minimo} - {ref.maximo} {ref.unidade}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Nenhum parâmetro cadastrado
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogDetalhes}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={dialogExclusaoAberto} onClose={handleFecharDialogExclusao}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o tipo de exame "{tipoExameSelecionado?.nome}"? Esta ação
            não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogExclusao}>Cancelar</Button>
          <Button onClick={handleConfirmarExclusao} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para exportar resultado de exame */}
      {exameSelecionado && (
        <ExportarResultadoExame
          exame={exameSelecionado}
          open={dialogExportarAberto}
          onClose={handleFecharDialogExportar}
        />
      )}
    </Container>
  );
};

export default Exames;
