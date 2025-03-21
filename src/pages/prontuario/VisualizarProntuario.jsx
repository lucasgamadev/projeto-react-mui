import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProntuarioDetails from "../../components/prontuario/ProntuarioDetails";
import { useProntuario } from "../../contexts/ProntuarioContext";

const VisualizarProntuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buscarProntuario, prontuarioAtual, loading, error } = useProntuario();
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(null);

  useEffect(() => {
    const carregarProntuario = async () => {
      if (!id) {
        setErroCarregamento("ID do prontuário não fornecido");
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        await buscarProntuario(id);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar prontuário:", error);
        setErroCarregamento(error.message || "Erro ao carregar prontuário");
        setCarregando(false);
      }
    };

    carregarProntuario();
  }, [id, buscarProntuario]);

  const handleVoltar = () => {
    navigate("/app/prontuarios");
  };

  // Página de carregamento
  if (carregando) {
    return (
      <Container maxWidth="lg">
        <Box
          my={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="70vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2}>
            Carregando prontuário...
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Isso pode levar alguns instantes.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Página de erro
  if (erroCarregamento) {
    return (
      <Container maxWidth="lg">
        <Box my={4}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleVoltar} sx={{ mb: 2 }}>
            Voltar
          </Button>
          <Alert severity="error" sx={{ mt: 2 }}>
            {erroCarregamento}
          </Alert>
        </Box>
      </Container>
    );
  }

  // Página principal
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleVoltar} sx={{ mb: 2 }}>
          Voltar
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {prontuarioAtual ? (
          <ProntuarioDetails prontuario={prontuarioAtual} />
        ) : (
          <Alert severity="info">Nenhum prontuário encontrado com o ID informado.</Alert>
        )}
      </Box>
    </Container>
  );
};

export default VisualizarProntuario;
