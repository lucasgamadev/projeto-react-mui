import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { criarTratamento } from "../../models/TratamentoModel";

const TratamentoFormModal = ({ open, onClose, pacienteId, pacienteNome, onSave, medicos = [] }) => {
  const initialFormValues = {
    nome: "",
    descricao: "",
    condicaoTratada: "",
    dataInicio: new Date(),
    dataFim: null,
    medicoId: "",
    medicoNome: "",
    especialidade: "",
    observacoes: []
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);

  useEffect(() => {
    if (open) {
      // Reset form quando o modal é aberto
      setFormValues({
        ...initialFormValues,
        pacienteId
      });
      setErrors({});
      setMedicoSelecionado(null);
    }
  }, [open, pacienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));

    // Limpa erro quando o campo é preenchido
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleMedicoChange = (event, newValue) => {
    setMedicoSelecionado(newValue);
    if (newValue) {
      setFormValues((prev) => ({
        ...prev,
        medicoId: newValue.id,
        medicoNome: newValue.nome,
        especialidade: newValue.especialidade
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        medicoId: "",
        medicoNome: "",
        especialidade: ""
      }));
    }
  };

  const handleObservacaoChange = (e) => {
    const observacao = e.target.value;
    if (observacao.trim()) {
      setFormValues((prev) => ({
        ...prev,
        observacoes: [...prev.observacoes, observacao]
      }));
      e.target.value = "";
    }
  };

  const handleRemoveObservacao = (index) => {
    setFormValues((prev) => ({
      ...prev,
      observacoes: prev.observacoes.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.nome.trim()) {
      newErrors.nome = "Nome do tratamento é obrigatório";
    }

    if (!formValues.condicaoTratada.trim()) {
      newErrors.condicaoTratada = "Condição tratada é obrigatória";
    }

    if (!formValues.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória";
    }

    if (!formValues.medicoId) {
      newErrors.medicoId = "Médico responsável é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const novoTratamento = criarTratamento(formValues);
      onSave(novoTratamento);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Novo Tratamento</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Paciente: <strong>{pacienteNome}</strong>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="nome"
              label="Nome do Tratamento"
              fullWidth
              value={formValues.nome}
              onChange={handleChange}
              error={!!errors.nome}
              helperText={errors.nome}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="condicaoTratada"
              label="Condição Tratada"
              fullWidth
              value={formValues.condicaoTratada}
              onChange={handleChange}
              error={!!errors.condicaoTratada}
              helperText={errors.condicaoTratada}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Início"
                value={formValues.dataInicio}
                onChange={(newValue) => {
                  setFormValues((prev) => ({
                    ...prev,
                    dataInicio: newValue
                  }));

                  if (errors.dataInicio) {
                    setErrors((prev) => ({
                      ...prev,
                      dataInicio: null
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={!!errors.dataInicio}
                    helperText={errors.dataInicio}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Previsão de Término"
                value={formValues.dataFim}
                onChange={(newValue) => {
                  setFormValues((prev) => ({
                    ...prev,
                    dataFim: newValue
                  }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={medicos}
              getOptionLabel={(option) => `${option.nome} (${option.especialidade})`}
              value={medicoSelecionado}
              onChange={handleMedicoChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Médico Responsável"
                  required
                  error={!!errors.medicoId}
                  helperText={errors.medicoId}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="descricao"
              label="Descrição do Tratamento"
              multiline
              rows={3}
              fullWidth
              value={formValues.descricao}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Observações
            </Typography>
            <TextField
              name="novaObservacao"
              label="Adicionar observação"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleObservacaoChange(e);
                }
              }}
              helperText="Pressione Enter para adicionar"
            />
          </Grid>

          {formValues.observacoes.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 1, p: 1, bgcolor: "background.paper", borderRadius: 1 }}>
                {formValues.observacoes.map((obs, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      mb: 1,
                      bgcolor: "grey.100",
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2">{obs}</Typography>
                    <IconButton size="small" onClick={() => handleRemoveObservacao(index)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TratamentoFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pacienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  pacienteNome: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  medicos: PropTypes.array
};

export default TratamentoFormModal;
