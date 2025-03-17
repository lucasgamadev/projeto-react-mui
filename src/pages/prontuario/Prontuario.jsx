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
import React, { useEffect, useState } from "react";
import ProntuarioDetails from "../../components/prontuario/ProntuarioDetails";
import { prontuarioExemplo } from "../../models/ProntuarioModel";

// Lista de pacientes exemplo
const pacientesExemplo = [
  { id: 101, nome: "Maria Silva", cpf: "123.456.789-00", dataNascimento: "15/05/1985" },
  { id: 102, nome: "João Oliveira", cpf: "987.654.321-00", dataNascimento: "22/11/1978" },
  { id: 103, nome: "Ana Carolina Santos", cpf: "111.222.333-44", dataNascimento: "30/07/1992" },
  { id: 104, nome: "Roberto Almeida", cpf: "555.666.777-88", dataNascimento: "14/03/1965" },
  { id: 105, nome: "Fernanda Costa", cpf: "999.888.777-66", dataNascimento: "05/12/1983" }
];

const Prontuario = () => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [prontuario, setProntuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  // Função para buscar prontuário (simulação de API)
  const buscarProntuario = (pacienteId) => {
    setLoading(true);

    // Simulando uma chamada assíncrona a uma API
    setTimeout(() => {
      // Aqui estamos apenas usando o prontuário de exemplo, mas em uma
      // aplicação real seria uma chamada a API para buscar o prontuário pelo ID
      const prontuarioEncontrado = { ...prontuarioExemplo };

      setProntuario(prontuarioEncontrado);
      setLoading(false);

      setSnackbar({
        open: true,
        message: "Prontuário carregado com sucesso",
        severity: "success"
      });
    }, 1000);
  };

  // Função para lidar com a seleção de um paciente
  const handlePacienteSelecionado = (event, paciente) => {
    setPacienteSelecionado(paciente);
    if (paciente) {
      buscarProntuario(paciente.id);
    } else {
      setProntuario(null);
    }
  };

  // Função para voltar à busca
  const handleVoltar = () => {
    setPacienteSelecionado(null);
    setProntuario(null);
    setSearchTerm("");
  };

  // Função para fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            getOptionLabel={(option) => `${option.nome} (${option.cpf})`}
            onChange={handlePacienteSelecionado}
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
            noOptionsText="Nenhum paciente encontrado"
            loading={searchTerm.length > 2 && searchResults.length === 0}
            loadingText="Buscando..."
          />

          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Digite pelo menos 3 caracteres para iniciar a busca
            </Alert>
          )}

          {searchTerm.length >= 3 && searchResults.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Nenhum paciente encontrado com os termos informados
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
              Prontuário - {pacienteSelecionado.nome}
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
              <CircularProgress />
            </Box>
          ) : prontuario ? (
            <ProntuarioDetails prontuario={prontuario} />
          ) : (
            <Alert severity="error">
              Não foi possível carregar o prontuário. Tente novamente.
              <Box mt={2}>
                <Button variant="outlined" onClick={() => buscarProntuario(pacienteSelecionado.id)}>
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
