import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CadastroMedicamentoForm from "../../components/medicamentos/CadastroMedicamentoForm";
import PrescreverMedicamentoForm from "../../components/medicamentos/PrescreverMedicamentoForm";
import MedicamentoModel from "../../models/MedicamentoModel";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCadastroDialog, setOpenCadastroDialog] = useState(false);
  const [openPrescricaoDialog, setOpenPrescricaoDialog] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const carregarMedicamentos = async () => {
    setLoading(true);
    try {
      const data = await MedicamentoModel.buscarTodosMedicamentos();
      setMedicamentos(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar medicamentos:", err);
      setError("Erro ao carregar os medicamentos. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await carregarMedicamentos();
      return;
    }

    setLoading(true);
    try {
      const results = await MedicamentoModel.buscarMedicamentosPorNome(searchTerm);
      setMedicamentos(results);
    } catch (err) {
      console.error("Erro na busca:", err);
      setError("Erro ao buscar medicamentos. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCadastroDialog = (medicamento = null) => {
    setSelectedMedicamento(medicamento);
    setOpenCadastroDialog(true);
  };

  const handleCloseCadastroDialog = () => {
    setOpenCadastroDialog(false);
    setSelectedMedicamento(null);
  };

  const handleOpenPrescricaoDialog = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setOpenPrescricaoDialog(true);
  };

  const handleClosePrescricaoDialog = () => {
    setOpenPrescricaoDialog(false);
    setSelectedMedicamento(null);
  };

  const handleSaveMedicamento = async (medicamento) => {
    try {
      if (selectedMedicamento) {
        // Atualizar medicamento existente
        await MedicamentoModel.atualizarMedicamento(selectedMedicamento.id, medicamento);
        setSnackbar({
          open: true,
          message: "Medicamento atualizado com sucesso!",
          severity: "success"
        });
      } else {
        // Novo medicamento
        await MedicamentoModel.adicionarMedicamento(medicamento);
        setSnackbar({
          open: true,
          message: "Medicamento cadastrado com sucesso!",
          severity: "success"
        });
      }
      handleCloseCadastroDialog();
      carregarMedicamentos();
    } catch (err) {
      console.error("Erro ao salvar medicamento:", err);
      setSnackbar({
        open: true,
        message: "Erro ao salvar medicamento. Por favor, tente novamente.",
        severity: "error"
      });
    }
  };

  const handleDeleteMedicamento = async (medicamentoId) => {
    if (window.confirm("Tem certeza que deseja desativar este medicamento?")) {
      try {
        await MedicamentoModel.desativarMedicamento(medicamentoId);
        setSnackbar({
          open: true,
          message: "Medicamento desativado com sucesso!",
          severity: "success"
        });
        carregarMedicamentos();
      } catch (err) {
        console.error("Erro ao desativar medicamento:", err);
        setSnackbar({
          open: true,
          message: "Erro ao desativar medicamento. Por favor, tente novamente.",
          severity: "error"
        });
      }
    }
  };

  const handleSavePrescricao = async (prescricao) => {
    try {
      await MedicamentoModel.criarPrescricao({
        ...prescricao,
        medicamentoId: selectedMedicamento.id,
        medicamentoNome: selectedMedicamento.nome
      });

      // Atualizar estoque se necessário
      if (prescricao.atualizarEstoque) {
        await MedicamentoModel.atualizarEstoque(
          selectedMedicamento.id,
          prescricao.quantidade,
          "saida"
        );
      }

      setSnackbar({
        open: true,
        message: "Prescrição criada com sucesso!",
        severity: "success"
      });
      handleClosePrescricaoDialog();
    } catch (err) {
      console.error("Erro ao criar prescrição:", err);
      setSnackbar({
        open: true,
        message: "Erro ao criar prescrição. Por favor, tente novamente.",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtragem por termo de busca
  const filteredMedicamentos = medicamentos.filter(
    (med) =>
      med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.principioAtivo && med.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginação
  const paginatedMedicamentos = filteredMedicamentos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestão de Medicamentos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <TextField
          label="Buscar medicamento"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mr: 1, flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{ mr: 1 }}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarMedicamentos}
          sx={{ mr: 1 }}
        >
          Atualizar
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => handleOpenCadastroDialog()}
        >
          Novo Medicamento
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="tabela de medicamentos">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Princípio Ativo</TableCell>
                <TableCell>Dosagem</TableCell>
                <TableCell>Estoque</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : paginatedMedicamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum medicamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMedicamentos.map((medicamento) => (
                  <TableRow key={medicamento.id}>
                    <TableCell>{medicamento.nome}</TableCell>
                    <TableCell>{medicamento.principioAtivo}</TableCell>
                    <TableCell>
                      {medicamento.dosagem} {medicamento.unidadeDosagem}
                    </TableCell>
                    <TableCell>
                      {medicamento.quantidadeEstoque || 0}
                      {medicamento.quantidadeEstoque < 10 && (
                        <Tooltip title="Estoque baixo">
                          <WarningIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={medicamento.ativo ? "Ativo" : "Inativo"}
                        color={medicamento.ativo ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleOpenCadastroDialog(medicamento)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Prescrever">
                        <IconButton
                          onClick={() => handleOpenPrescricaoDialog(medicamento)}
                          color="primary"
                          size="small"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Desativar">
                        <IconButton
                          onClick={() => handleDeleteMedicamento(medicamento.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredMedicamentos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Diálogo de Cadastro/Edição */}
      <Dialog open={openCadastroDialog} onClose={handleCloseCadastroDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMedicamento ? "Editar Medicamento" : "Novo Medicamento"}</DialogTitle>
        <DialogContent>
          <CadastroMedicamentoForm
            medicamento={selectedMedicamento}
            onSubmit={handleSaveMedicamento}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCadastroDialog}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Prescrição */}
      <Dialog
        open={openPrescricaoDialog}
        onClose={handleClosePrescricaoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescrever {selectedMedicamento?.nome}</DialogTitle>
        <DialogContent>
          <PrescreverMedicamentoForm
            medicamento={selectedMedicamento}
            onSubmit={handleSavePrescricao}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrescricaoDialog}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedbacks */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Medicamentos;
