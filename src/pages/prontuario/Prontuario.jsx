import {
  AddCircle as AddCircleIcon,
  ArrowBack as ArrowBackIcon,
  PersonSearch as PersonSearchIcon,
  RestartAlt as RestartAltIcon,
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
import { useEffect, useState } from "react";
import ProntuarioDetails from "../../components/prontuario/ProntuarioDetails";
import { useProntuario } from "../../contexts/ProntuarioContext";

// Lista de pacientes exemplo para busca rápida
const pacientesExemplo = [
  {
    id: 1,
    nomePaciente: "Maria Silva",
    cpf: "123.456.789-00",
    dataNascimento: "15/05/1985"
  },
  {
    id: 2,
    nomePaciente: "João Oliveira",
    cpf: "987.654.321-00",
    dataNascimento: "22/11/1978"
  },
  {
    id: 3,
    nomePaciente: "Ana Carolina Santos",
    cpf: "111.222.333-44",
    dataNascimento: "30/07/1992"
  },
  {
    id: 4,
    nomePaciente: "Roberto Almeida",
    cpf: "555.666.777-88",
    dataNascimento: "14/03/1965"
  },
  {
    id: 5,
    nomePaciente: "Fernanda Costa",
    cpf: "999.888.777-66",
    dataNascimento: "05/12/1983"
  }
];

// Chave para armazenar exemplos carregados no localStorage
const EXEMPLOS_STORAGE_KEY = "prontuario-exemplos-carregados";

const Prontuario = () => {
  const {
    prontuarioAtual,
    loading,
    error,
    buscarProntuario,
    buscarProntuarioPorCPF,
    buscarProntuarioPorNome,
    limparProntuario,
    reinicializarDados
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
  const [exemplosCarregados, setExemplosCarregados] = useState(false);

  // Verificar se os exemplos já estão carregados ao iniciar
  useEffect(() => {
    const exemplosSalvos = localStorage.getItem(EXEMPLOS_STORAGE_KEY);
    if (exemplosSalvos === "true") {
      setSearchResults(pacientesExemplo);
      setExemplosCarregados(true);
    }
  }, []);

  // Função para carregar pacientes de exemplo na busca
  const handleCarregarExemplos = () => {
    setSearchResults(pacientesExemplo);
    setExemplosCarregados(true);
    // Salvar no localStorage que os exemplos foram carregados
    localStorage.setItem(EXEMPLOS_STORAGE_KEY, "true");
    setSnackbar({
      open: true,
      message: "Pacientes de exemplo carregados na busca",
      severity: "success"
    });
  };

  // Função de busca com debounce
  const buscarPacientes = debounce(async (termo) => {
    if (termo.length < 3) {
      setSearchResults([]);
      return;
    }

    setBuscando(true);
    try {
      let resultados = [];
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

  useEffect(() => {
    if (searchTerm.length >= 3) {
      buscarPacientes(searchTerm);
    }
    return () => buscarPacientes.cancel();
  }, [searchTerm, buscarPacientes]);

  const handlePacienteSelecionado = async (event, paciente) => {
    setPacienteSelecionado(paciente);
    if (paciente) {
      try {
        // Buscar o prontuário pelo CPF em vez do ID
        const prontuariosPorCPF = await buscarProntuarioPorCPF(paciente.cpf);
        if (prontuariosPorCPF && prontuariosPorCPF.length > 0) {
          // Use o primeiro prontuário encontrado com o CPF
          await buscarProntuario(prontuariosPorCPF[0].id);
          setSnackbar({
            open: true,
            message: "Prontuário carregado com sucesso",
            severity: "success"
          });
        } else {
          throw new Error("Prontuário não encontrado para este CPF");
        }
      } catch (error) {
        console.error("Erro ao carregar prontuário:", error);
        setSnackbar({
          open: true,
          message: `Erro ao carregar prontuário: ${error.message}`,
          severity: "error"
        });
      }
    } else {
      limparProntuario();
    }
  };

  const handleVoltar = () => {
    setPacienteSelecionado(null);
    limparProntuario();
    setSearchTerm("");

    // Verificar se devemos carregar os exemplos novamente ao voltar
    if (exemplosCarregados) {
      setSearchResults(pacientesExemplo);
    } else {
      setSearchResults([]);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Função para reinicializar os dados do sistema
  const handleReinicializarDados = async () => {
    try {
      if (
        window.confirm(
          "Tem certeza que deseja reinicializar todos os dados? Esta ação não pode ser desfeita."
        )
      ) {
        setBuscando(true);
        await reinicializarDados();
        setSearchResults([]);
        setPacienteSelecionado(null);
        setSnackbar({
          open: true,
          message: "Dados reinicializados com sucesso. Os exemplos foram recarregados.",
          severity: "success"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Erro ao reinicializar dados: ${error.message}`,
        severity: "error"
      });
    } finally {
      setBuscando(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {!pacienteSelecionado ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <PersonSearchIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
            <Typography variant="h4" component="h1">
              Prontuário Eletrônico
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Buscar Paciente</Typography>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={handleCarregarExemplos}
                sx={{ mr: 1 }}
              >
                Carregar Exemplos
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RestartAltIcon />}
                onClick={handleReinicializarDados}
              >
                Reinicializar Dados
              </Button>
            </Box>
          </Box>

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
                helperText={
                  searchResults.length === 0
                    ? "Digite pelo menos 3 caracteres para buscar ou use o botão 'Carregar Exemplos'"
                    : ""
                }
              />
            )}
            noOptionsText={
              searchTerm.length < 3
                ? "Digite pelo menos 3 caracteres para iniciar a busca"
                : "Nenhum paciente encontrado"
            }
            loadingText="Buscando pacientes..."
            slots={{
              textField: (params) => (
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
                  helperText={
                    searchResults.length === 0
                      ? "Digite pelo menos 3 caracteres para buscar ou use o botão 'Carregar Exemplos'"
                      : ""
                  }
                />
              )
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Erro ao buscar pacientes: {error}
            </Alert>
          )}

          {searchResults.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {searchResults.length} {searchResults.length === 1 ? "paciente" : "pacientes"}{" "}
                {searchResults.length === 1 ? "disponível" : "disponíveis"}
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
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
              Não foi possível carregar o prontuário. O sistema pode estar com problemas de
              inicialização.
              <Box mt={2} display="flex" gap={2}>
                <Button variant="outlined" onClick={handleVoltar}>
                  Voltar à busca
                </Button>
                <Button variant="contained" color="error" onClick={handleReinicializarDados}>
                  Reinicializar Dados
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
