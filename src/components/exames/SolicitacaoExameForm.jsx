import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ptBR from "date-fns/locale/pt-BR";
import React, { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const SolicitacaoExameForm = ({ pacienteId, medicoId, consultaId, onSuccess }) => {
  const [tiposExames, setTiposExames] = useState([]);
  const [formData, setFormData] = useState({
    tipoExameId: "",
    dataPrevista: null,
    prioridade: "Normal",
    observacoes: ""
  });
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ aberto: false, tipo: "success", mensagem: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    carregarTiposExames();
  }, []);

  const carregarTiposExames = async () => {
    try {
      setLoading(true);
      const tipos = await ExameModel.listarTiposExames();
      setTiposExames(tipos);
    } catch (error) {
      console.error("Erro ao carregar tipos de exames:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao carregar tipos de exames. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.tipoExameId) {
      novosErros.tipoExameId = "Selecione um tipo de exame";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpar erro do campo quando ele for preenchido
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dataPrevista: date
    });
  };

  const fecharAlerta = () => {
    setAlerta({ ...alerta, aberto: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const solicitacao = {
        ...formData,
        pacienteId,
        medicoId,
        consultaId
      };

      await ExameModel.solicitarExame(solicitacao);

      setAlerta({
        aberto: true,
        tipo: "success",
        mensagem: "Exame solicitado com sucesso!"
      });

      // Limpar formulário
      setFormData({
        tipoExameId: "",
        dataPrevista: null,
        prioridade: "Normal",
        observacoes: ""
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao solicitar exame:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao solicitar exame. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Solicitação de Exame" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.tipoExameId}>
                  <InputLabel id="tipo-exame-label">Tipo de Exame</InputLabel>
                  <Select
                    labelId="tipo-exame-label"
                    id="tipoExameId"
                    name="tipoExameId"
                    value={formData.tipoExameId}
                    onChange={handleChange}
                    label="Tipo de Exame"
                    disabled={loading || tiposExames.length === 0}
                    required
                  >
                    {tiposExames.map((tipo) => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipoExameId && <FormHelperText>{errors.tipoExameId}</FormHelperText>}
                </FormControl>
              </Grid>

              {formData.tipoExameId && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Informações do Exame:
                    </Typography>

                    {tiposExames.find((tipo) => tipo.id === formData.tipoExameId)?.descricao && (
                      <Typography variant="body2" gutterBottom>
                        {tiposExames.find((tipo) => tipo.id === formData.tipoExameId)?.descricao}
                      </Typography>
                    )}

                    {tiposExames.find((tipo) => tipo.id === formData.tipoExameId)
                      ?.preparoNecessario && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>
                          Preparo Necessário:
                        </Typography>
                        <Typography variant="body2">
                          {
                            tiposExames.find((tipo) => tipo.id === formData.tipoExameId)
                              ?.preparoNecessario
                          }
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Data Prevista"
                  value={formData.dataPrevista}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                  disablePast
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="prioridade-label">Prioridade</InputLabel>
                  <Select
                    labelId="prioridade-label"
                    id="prioridade"
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    label="Prioridade"
                  >
                    <MenuItem value="Baixa">Baixa</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Alta">Alta</MenuItem>
                    <MenuItem value="Urgente">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              Solicitar Exame
            </Button>
          </Box>
        </Card>

        <Snackbar open={alerta.aberto} autoHideDuration={6000} onClose={fecharAlerta}>
          <Alert onClose={fecharAlerta} severity={alerta.tipo} sx={{ width: "100%" }}>
            {alerta.mensagem}
          </Alert>
        </Snackbar>
      </form>
    </LocalizationProvider>
  );
};

export default SolicitacaoExameForm;
