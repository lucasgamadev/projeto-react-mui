import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const statusColors = {
  Solicitado: "info",
  "Em Andamento": "warning",
  Concluído: "success",
  Cancelado: "error"
};

const VisualizadorResultadosExames = ({ pacienteId, medicoLogado }) => {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogRegistroAberto, setDialogRegistroAberto] = useState(false);
  const [exameAtual, setExameAtual] = useState(null);
  const [resultadoForm, setResultadoForm] = useState({
    valores: {},
    observacoes: ""
  });
  const [alerta, setAlerta] = useState({ aberto: false, tipo: "success", mensagem: "" });

  useEffect(() => {
    if (pacienteId) {
      carregarExames();
    }
  }, [pacienteId]);

  const carregarExames = async () => {
    try {
      setLoading(true);
      const listaExames = await ExameModel.listarExamesPaciente(pacienteId);
      setExames(listaExames);
    } catch (error) {
      console.error("Erro ao carregar exames:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao carregar lista de exames."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarResultado = (exame) => {
    setExameAtual(exame);

    // Inicializar form com valores vazios baseados nos parâmetros do tipo de exame
    const valoresIniciais = {};
    if (exame.tipoExame && exame.tipoExame.valoresReferencia) {
      Object.keys(exame.tipoExame.valoresReferencia).forEach((parametro) => {
        valoresIniciais[parametro] = "";
      });
    }

    setResultadoForm({
      valores: valoresIniciais,
      observacoes: ""
    });

    setDialogRegistroAberto(true);
  };

  const handleChangeResultadoForm = (e) => {
    const { name, value } = e.target;
    setResultadoForm({
      ...resultadoForm,
      observacoes: value
    });
  };

  const handleChangeValorParametro = (parametro, valor) => {
    setResultadoForm({
      ...resultadoForm,
      valores: {
        ...resultadoForm.valores,
        [parametro]: valor
      }
    });
  };

  const fecharDialogRegistro = () => {
    setDialogRegistroAberto(false);
    setExameAtual(null);
  };

  const salvarResultado = async () => {
    try {
      setLoading(true);

      await ExameModel.registrarResultado(exameAtual.id, resultadoForm);

      setAlerta({
        aberto: true,
        tipo: "success",
        mensagem: "Resultado registrado com sucesso!"
      });

      fecharDialogRegistro();
      await carregarExames();
    } catch (error) {
      console.error("Erro ao registrar resultado:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao registrar resultado do exame."
      });
    } finally {
      setLoading(false);
    }
  };

  const verificarValorCritico = (parametro, valor) => {
    if (!exameAtual || !exameAtual.tipoExame || !exameAtual.tipoExame.valoresReferencia) {
      return false;
    }

    const valoresReferencia = exameAtual.tipoExame.valoresReferencia[parametro];
    if (!valoresReferencia) return false;

    const valorNumerico = parseFloat(valor);
    const minimo = parseFloat(valoresReferencia.minimo);
    const maximo = parseFloat(valoresReferencia.maximo);

    return valorNumerico < minimo || valorNumerico > maximo;
  };

  const fecharAlerta = () => {
    setAlerta({ ...alerta, aberto: false });
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return "Não definida";

    try {
      const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const renderDialogRegistroResultado = () => {
    if (!exameAtual) return null;

    return (
      <Dialog open={dialogRegistroAberto} onClose={fecharDialogRegistro} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Resultado - {exameAtual.tipoExame?.nome}</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Parâmetros:
            </Typography>

            {exameAtual.tipoExame?.valoresReferencia ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parâmetro</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Valor de Referência</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(exameAtual.tipoExame.valoresReferencia).map(
                      ([parametro, referencia]) => (
                        <TableRow key={parametro}>
                          <TableCell>{parametro}</TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={resultadoForm.valores[parametro] || ""}
                              onChange={(e) =>
                                handleChangeValorParametro(parametro, e.target.value)
                              }
                              error={verificarValorCritico(
                                parametro,
                                resultadoForm.valores[parametro]
                              )}
                              InputProps={{
                                endAdornment: referencia.unidade ? (
                                  <span>{referencia.unidade}</span>
                                ) : null
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {referencia.minimo} - {referencia.maximo} {referencia.unidade}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Não há parâmetros de referência definidos para este exame.
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={resultadoForm.observacoes}
                onChange={handleChangeResultadoForm}
                multiline
                rows={4}
                variant="outlined"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialogRegistro}>Cancelar</Button>
          <Button onClick={salvarResultado} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar Resultado"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderResultadoExame = (exame) => {
    if (!exame.resultado) return "Não disponível";

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Resultados:
        </Typography>

        {exame.tipoExame?.valoresReferencia && exame.resultado.valores && (
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Parâmetro</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Referência</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(exame.resultado.valores).map(([parametro, valor]) => {
                  const referencia = exame.tipoExame.valoresReferencia[parametro];
                  if (!referencia) return null;

                  const valorNumerico = parseFloat(valor);
                  const minimo = parseFloat(referencia.minimo);
                  const maximo = parseFloat(referencia.maximo);

                  const isCritico = valorNumerico < minimo || valorNumerico > maximo;

                  return (
                    <TableRow key={parametro}>
                      <TableCell>{parametro}</TableCell>
                      <TableCell>
                        {valor} {referencia.unidade}
                      </TableCell>
                      <TableCell>
                        {referencia.minimo} - {referencia.maximo} {referencia.unidade}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={isCritico ? "Alterado" : "Normal"}
                          color={isCritico ? "error" : "success"}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {exame.resultado.observacoes && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Observações:</Typography>
            <Typography variant="body2">{exame.resultado.observacoes}</Typography>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Registrado em: {formatarData(exame.resultado.dataRegistro)}
        </Typography>
      </Box>
    );
  };

  if (loading && exames.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Exames Médicos"
          action={
            medicoLogado && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {}}
                sx={{ mr: 1 }}
              >
                Solicitar Novo Exame
              </Button>
            )
          }
        />
        <Divider />
        <CardContent>
          {exames.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              Nenhum exame encontrado para este paciente.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exame</TableCell>
                    <TableCell>Data Solicitação</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Resultado</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exames.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {exame.tipoExame?.nome || "Exame não identificado"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exame.tipoExame?.categoria || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatarData(exame.dataRequisicao)}</TableCell>
                      <TableCell>
                        <Chip
                          label={exame.status}
                          color={statusColors[exame.status] || "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {exame.status === "Concluído" ? (
                          <Box sx={{ maxWidth: 300 }}>{renderResultadoExame(exame)}</Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {exame.status === "Cancelado"
                              ? "Exame cancelado"
                              : "Aguardando resultado"}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          {medicoLogado && exame.status === "Solicitado" && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleRegistrarResultado(exame)}
                              sx={{ mr: 1 }}
                            >
                              Registrar Resultado
                            </Button>
                          )}

                          {exame.status === "Concluído" && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => {}}
                            >
                              PDF
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {renderDialogRegistroResultado()}

      <Snackbar open={alerta.aberto} autoHideDuration={6000} onClose={fecharAlerta}>
        <Alert onClose={fecharAlerta} severity={alerta.tipo} sx={{ width: "100%" }}>
          {alerta.mensagem}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VisualizadorResultadosExames;
