import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useState } from "react";

const ExportarResultadoExame = ({ exame, onClose, open }) => {
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ aberto: false, tipo: "success", mensagem: "" });

  if (!exame) return null;

  const handleGerarPDF = async () => {
    try {
      setLoading(true);
      // Simulação de geração de PDF
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAlerta({
        aberto: true,
        tipo: "success",
        mensagem: "PDF gerado com sucesso!"
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao gerar o PDF. Tente novamente."
      });
      setLoading(false);
    }
  };

  const handleImprimir = () => {
    try {
      setLoading(true);
      // Simulação de impressão
      setTimeout(() => {
        window.print();
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao imprimir. Tente novamente."
      });
      setLoading(false);
    }
  };

  const handleEnviarEmail = async () => {
    try {
      setLoading(true);
      // Simulação de envio de email
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setAlerta({
        aberto: true,
        tipo: "success",
        mensagem: "Email enviado com sucesso!"
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao enviar o email. Tente novamente."
      });
      setLoading(false);
    }
  };

  const fecharAlerta = () => {
    setAlerta({ ...alerta, aberto: false });
  };

  const formatarData = (data) => {
    if (!data) return "Data não disponível";

    try {
      const dataObj = data instanceof Date ? data : new Date(data);
      return format(dataObj, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Exportar Resultado do Exame</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />

        <DialogContent>
          <Box id="conteudo-para-impressao">
            {/* Cabeçalho */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                RESULTADO DE EXAME
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID do Exame: {exame.id}
              </Typography>
            </Box>

            {/* Informações do paciente e exame */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Paciente
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {exame.pacienteNome || "Nome não disponível"}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    Médico Solicitante
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Dr. {exame.medicoNome || "Nome não disponível"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo de Exame
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {exame.tipoExame?.nome || "Não disponível"}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    Data da Coleta
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatarData(exame.dataRequisicao)}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    Data do Resultado
                  </Typography>
                  <Typography variant="body1">
                    {exame.resultado?.dataRegistro
                      ? formatarData(exame.resultado.dataRegistro)
                      : "Pendente"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Resultados */}
            {exame.resultado ? (
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parâmetro</TableCell>
                      <TableCell>Resultado</TableCell>
                      <TableCell>Valores de Referência</TableCell>
                      <TableCell>Unidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exame.tipoExame?.valoresReferencia &&
                      Object.entries(exame.tipoExame.valoresReferencia).map(([param, ref]) => {
                        const valorMedido = exame.resultado.valores[param];
                        const valorNumerico = parseFloat(valorMedido);
                        const minimoNumerico = parseFloat(ref.minimo);
                        const maximoNumerico = parseFloat(ref.maximo);

                        // Verificar se está fora do intervalo de referência
                        const foraDoRange =
                          !isNaN(valorNumerico) &&
                          !isNaN(minimoNumerico) &&
                          !isNaN(maximoNumerico) &&
                          (valorNumerico < minimoNumerico || valorNumerico > maximoNumerico);

                        return (
                          <TableRow key={param}>
                            <TableCell>{param}</TableCell>
                            <TableCell
                              sx={{
                                fontWeight: foraDoRange ? "bold" : "normal",
                                color: foraDoRange ? "error.main" : "inherit"
                              }}
                            >
                              {valorMedido || "N/A"}
                            </TableCell>
                            <TableCell>{`${ref.minimo} - ${ref.maximo}`}</TableCell>
                            <TableCell>{ref.unidade}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  Este exame ainda não possui resultados registrados.
                </Typography>
              </Paper>
            )}

            {/* Observações */}
            {exame.resultado?.observacoes && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Observações
                </Typography>
                <Typography variant="body1">{exame.resultado.observacoes}</Typography>
              </Paper>
            )}

            {/* Rodapé */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Este documento é apenas para visualização. O resultado oficial deve ser assinado por
                um profissional de saúde.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Data de emissão: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleEnviarEmail}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Enviar por Email
            </Button>
            <Button variant="outlined" startIcon={<ShareIcon />} disabled={loading}>
              Compartilhar
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={18} /> : <DownloadIcon />}
              onClick={handleGerarPDF}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Baixar PDF
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={loading ? <CircularProgress size={18} /> : <PrintIcon />}
              onClick={handleImprimir}
              disabled={loading}
            >
              Imprimir
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alerta.aberto}
        autoHideDuration={6000}
        onClose={fecharAlerta}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={fecharAlerta} severity={alerta.tipo} sx={{ width: "100%" }}>
          {alerta.mensagem}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportarResultadoExame;
