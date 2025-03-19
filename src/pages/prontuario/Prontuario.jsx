import {
  ArrowBack as ArrowBackIcon,
  PersonSearch as PersonSearchIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import ProntuarioDetails from "../../components/prontuario/ProntuarioDetails";
import { useProntuario } from "../../contexts/ProntuarioContext";

const Prontuario = () => {
  const {
    prontuarioAtual,
    loading,
    error,
    buscarProntuario,
    buscarProntuarioPorCPF,
    buscarProntuarioPorNome,
    limparProntuario
  } = useProntuario();

  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Função de busca com debounce
  const buscarPacientes = debounce(async (termo) => {
    if (termo.length < 3) {
      setSearchResults([]);
      return;
    }

    setBuscando(true);
    try {
      let resultados = [];
      // Verifica se o termo é um CPF (contém apenas números e caracteres especiais)
      if (/^[\d.-]*$/.test(termo)) {
        resultados = await buscarProntuarioPorCPF(termo);
      } else {
        resultados = await buscarProntuarioPorNome(termo);
      }
      setSearchResults(resultados);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      setSnackbar({
        open: true,
        message: "Erro ao buscar pacientes. Tente novamente.",
        severity: "error"
      });
    } finally {
      setBuscando(false);
    }
  }, 500);

  // Efeito para buscar pacientes quando o termo de busca mudar
  useEffect(() => {
    buscarPacientes(searchTerm);
    // Cleanup function para cancelar o debounce se o componente for desmontado
    return () => buscarPacientes.cancel();
  }, [searchTerm, buscarPacientes]);

  // Função para lidar com a seleção de um paciente
  const handlePacienteSelecionado = async (event, paciente) => {
    setPacienteSelecionado(paciente);
    if (paciente) {
      try {
        await buscarProntuario(paciente.id);
        setSnackbar({
          open: true,
          message: "Prontuário carregado com sucesso",
          severity: "success"
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erro ao carregar prontuário. Tente novamente.",
          severity: "error"
        });
      }
    } else {
      limparProntuario();
    }
  };

  // Função para voltar à busca
  const handleVoltar = () => {
    setPacienteSelecionado(null);
    limparProntuario();
    setSearchTerm("");
  };

  // Função para fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Função para tentar carregar o prontuário novamente
  const handleTentarNovamente = async () => {
    if (pacienteSelecionado) {
      try {
        await buscarProntuario(pacienteSelecionado.id);
        setSnackbar({
          open: true,
          message: "Prontuário carregado com sucesso",
          severity: "success"
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erro ao carregar prontuário. Tente novamente.",
          severity: "error"
        });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {!pacienteSelecionado ? (
        // Tela de busca de paciente
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <PersonSearchIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
            <Typography variant="h4" component="h1">
              Prontuário Eletrônico
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Buscar Paciente
          </Typography>

          <Autocomplete
            id="busca-paciente"
            options={searchResults}
            getOptionLabel={(option) => `${option.nomePaciente} (${option.cpf})`}
            onChange={handlePacienteSelecionado}
            loading={buscando}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nome ou CPF do paciente"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  )
                }}
                helperText="Digite pelo menos 3 caracteres para iniciar a busca"
              />
            )}
            noOptionsText={
              searchTerm.length < 3
                ? "Digite pelo menos 3 caracteres para iniciar a busca"
                : "Nenhum paciente encontrado"
            }
            loadingText="Buscando pacientes..."
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Erro ao buscar pacientes: {error}
            </Alert>
          )}

          {searchResults.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"}{" "}
                encontrado{searchResults.length === 1 ? "" : "s"}
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        // Tela de visualização do prontuário
        <Box>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={handleVoltar} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Prontuário - {pacienteSelecionado.nomePaciente}
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
              <CircularProgress />
            </Box>
          ) : prontuarioAtual ? (
            <ProntuarioDetails prontuario={prontuarioAtual} />
          ) : (
            <Alert severity="error">
              Não foi possível carregar o prontuário. Tente novamente.
              <Box mt={2}>
                <Button variant="outlined" onClick={handleTentarNovamente}>
                  Tentar novamente
                </Button>
              </Box>
            </Alert>
          )}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Prontuario;
