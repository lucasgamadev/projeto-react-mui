import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const AlertaExamesCriticos = ({ onVerExame, mostrarApenasResumo = false }) => {
  const [examesCriticos, setExamesCriticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarExamesCriticos();
  }, []);

  const carregarExamesCriticos = async () => {
    try {
      setLoading(true);
      setErro(null);
      const exames = await ExameModel.verificarResultadosCriticos();
      setExamesCriticos(exames);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar exames críticos:", error);
      setErro("Não foi possível carregar os exames críticos. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (erro) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {erro}
      </Alert>
    );
  }

  return (
    <>
      {examesCriticos.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            Não há resultados críticos no momento.
          </Typography>
        </Paper>
      ) : (
        <>
          {mostrarApenasResumo ? (
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <b>{examesCriticos.length}</b> resultados críticos requerem atenção
                  </Typography>
                </Box>

                <List dense>
                  {examesCriticos.slice(0, 3).map((exame) => (
                    <ListItem
                      key={exame.id}
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => onVerExame && onVerExame(exame)}
                        >
                          Ver
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={exame.tipoExame?.nome || "Exame"}
                        secondary={`Paciente: ${exame.paciente?.nome || "Não identificado"}`}
                      />
                    </ListItem>
                  ))}
                </List>

                {examesCriticos.length > 3 && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => onVerExame && onVerExame({ tipo: "navegarParaAlertas" })}
                    >
                      Ver todos os {examesCriticos.length} resultados críticos
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de resultados críticos">
                  <TableHead>
                    <TableRow>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Exame</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Médico</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examesCriticos.map((exame) => (
                      <TableRow
                        key={exame.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "error.light",
                          "&:hover": {
                            backgroundColor: "error.main",
                            "& .MuiTableCell-root": {
                              color: "white"
                            }
                          }
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {exame.paciente?.nome || "Não identificado"}
                        </TableCell>
                        <TableCell>{exame.tipoExame?.nome || "Não especificado"}</TableCell>
                        <TableCell>
                          {new Date(exame.dataResultado).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{exame.medico?.nome || "Não atribuído"}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => onVerExame && onVerExame(exame)}
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="body2" color="error">
                  Resultados críticos requerem atenção imediata!
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AlertaExamesCriticos;
