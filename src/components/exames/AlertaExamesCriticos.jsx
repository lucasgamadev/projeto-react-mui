import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Avatar,
  Badge,
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
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const AlertaExamesCriticos = ({ onVerExame }) => {
  const [examesCriticos, setExamesCriticos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogExameAberto, setDialogExameAberto] = useState(false);
  const [exameDetalhe, setExameDetalhe] = useState(null);

  useEffect(() => {
    carregarExamesCriticos();

    // Verificar a cada 5 minutos
    const intervalo = setInterval(
      () => {
        carregarExamesCriticos();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(intervalo);
  }, []);

  const carregarExamesCriticos = async () => {
    try {
      setLoading(true);
      const exames = await ExameModel.verificarResultadosCriticos();
      setExamesCriticos(exames);
    } catch (error) {
      console.error("Erro ao carregar exames críticos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhe = (exame) => {
    setExameDetalhe(exame);
    setDialogExameAberto(true);
  };

  const fecharDialog = () => {
    setDialogExameAberto(false);
    setExameDetalhe(null);
  };

  const handleVerExame = () => {
    if (onVerExame && exameDetalhe) {
      onVerExame(exameDetalhe);
      fecharDialog();
    }
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return "";
    try {
      const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const renderDialogDetalheExame = () => {
    if (!exameDetalhe) return null;

    const exame = exameDetalhe;

    return (
      <Dialog open={dialogExameAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            Alerta de Resultado Crítico
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {exame.tipoExame?.nome}
            </Typography>

            <Typography variant="body2" gutterBottom>
              <strong>Paciente:</strong> {exame.pacienteNome || "ID: " + exame.pacienteId}
            </Typography>

            <Typography variant="body2" gutterBottom>
              <strong>Data do Exame:</strong> {formatarData(exame.resultado?.dataRegistro)}
            </Typography>

            <Typography variant="body2" gutterBottom>
              <strong>Categoria:</strong> {exame.tipoExame?.categoria || "Não especificada"}
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            Este exame apresenta valores críticos que necessitam de atenção imediata!
          </Alert>

          <Typography variant="subtitle1" gutterBottom>
            Resultados Alterados:
          </Typography>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <List dense>
              {exame.tipoExame?.valoresReferencia &&
                exame.resultado?.valores &&
                Object.entries(exame.resultado.valores).map(([parametro, valor]) => {
                  const referencia = exame.tipoExame.valoresReferencia[parametro];
                  if (!referencia) return null;

                  const valorNumerico = parseFloat(valor);
                  const minimo = parseFloat(referencia.minimo);
                  const maximo = parseFloat(referencia.maximo);

                  const isCritico = valorNumerico < minimo || valorNumerico > maximo;

                  if (!isCritico) return null;

                  return (
                    <ListItem key={parametro}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "error.main" }}>
                          <WarningIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={parametro}
                        secondary={
                          <Typography component="span" variant="body2">
                            Valor:{" "}
                            <strong>
                              {valor} {referencia.unidade}
                            </strong>{" "}
                            | Referência: {referencia.minimo} - {referencia.maximo}{" "}
                            {referencia.unidade}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
            </List>
          </Paper>

          {exame.resultado?.observacoes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Observações:
              </Typography>
              <Typography variant="body2">{exame.resultado.observacoes}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Fechar</Button>
          <Button
            onClick={handleVerExame}
            variant="contained"
            color="primary"
            startIcon={<VisibilityIcon />}
          >
            Ver Exame Completo
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Badge badgeContent={examesCriticos.length} color="error" max={99} sx={{ mr: 1 }}>
                <NotificationsIcon color="action" />
              </Badge>
              Alertas de Exames Críticos
            </Box>
          }
          action={
            <Button size="small" onClick={carregarExamesCriticos} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Atualizar"}
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {loading && examesCriticos.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={100}>
              <CircularProgress />
            </Box>
          ) : examesCriticos.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 2 }}>
              Não há exames com resultados críticos no momento.
            </Typography>
          ) : (
            <List sx={{ width: "100%" }}>
              {examesCriticos.map((exame) => (
                <React.Fragment key={exame.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleVerDetalhe(exame)}>
                        <VisibilityIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "error.main" }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {exame.tipoExame?.nome || "Exame não identificado"}
                          <Chip size="small" label="Crítico" color="error" sx={{ ml: 1 }} />
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Paciente: {exame.pacienteNome || "ID: " + exame.pacienteId}
                          </Typography>
                          <Typography variant="body2">
                            Data: {formatarData(exame.resultado?.dataRegistro)}
                          </Typography>
                          <Typography variant="body2">
                            {Object.entries(exame.resultado?.valores || {}).reduce(
                              (acc, [param, valor]) => {
                                const ref = exame.tipoExame?.valoresReferencia?.[param];
                                if (!ref) return acc;

                                const val = parseFloat(valor);
                                const min = parseFloat(ref.minimo);
                                const max = parseFloat(ref.maximo);

                                if (val < min || val > max) {
                                  if (acc) acc += ", ";
                                  acc += `${param}: ${valor} ${ref.unidade}`;
                                }
                                return acc;
                              },
                              ""
                            )}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {renderDialogDetalheExame()}
    </>
  );
};

export default AlertaExamesCriticos;
