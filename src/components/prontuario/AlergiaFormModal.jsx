import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import { useState } from "react";

const AlergiaFormModal = ({ open, onClose, onSave, prontuarioId }) => {
  const initialFormState = {
    tipo: "",
    agente: "",
    reacao: "",
    gravidade: "",
    dataIdentificacao: new Date(),
    observacoes: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const tiposAlergia = ["Medicamento", "Alimento", "Substância", "Ambiental", "Látex", "Outro"];

  const gravidadeOptions = ["Leve", "Moderada", "Grave"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Limpa o erro do campo quando ele é modificado
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dataIdentificacao: date
    }));

    // Limpa o erro do campo quando ele é modificado
    if (errors.dataIdentificacao) {
      setErrors((prev) => ({
        ...prev,
        dataIdentificacao: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipo) {
      newErrors.tipo = "O tipo de alergia é obrigatório";
    }

    if (!formData.agente) {
      newErrors.agente = "O agente causador é obrigatório";
    }

    if (!formData.reacao) {
      newErrors.reacao = "A reação é obrigatória";
    }

    if (!formData.gravidade) {
      newErrors.gravidade = "A gravidade é obrigatória";
    }

    if (!formData.dataIdentificacao) {
      newErrors.dataIdentificacao = "A data de identificação é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        id: `alergia-${Date.now()}`
      });
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nova Alergia</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.tipo}>
                <InputLabel id="tipo-label">Tipo de Alergia</InputLabel>
                <Select
                  labelId="tipo-label"
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo de Alergia"
                >
                  {tiposAlergia.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tipo && <FormHelperText>{errors.tipo}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gravidade}>
                <InputLabel id="gravidade-label">Gravidade</InputLabel>
                <Select
                  labelId="gravidade-label"
                  id="gravidade"
                  name="gravidade"
                  value={formData.gravidade}
                  onChange={handleChange}
                  label="Gravidade"
                >
                  {gravidadeOptions.map((gravidade) => (
                    <MenuItem key={gravidade} value={gravidade}>
                      {gravidade}
                    </MenuItem>
                  ))}
                </Select>
                {errors.gravidade && <FormHelperText>{errors.gravidade}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agente Causador"
                name="agente"
                value={formData.agente}
                onChange={handleChange}
                error={!!errors.agente}
                helperText={errors.agente}
                placeholder="Ex: Penicilina, Amendoim, Pólen"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reação"
                name="reacao"
                value={formData.reacao}
                onChange={handleChange}
                error={!!errors.reacao}
                helperText={errors.reacao}
                placeholder="Ex: Anafilaxia, Urticária, Edema"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Identificação"
                  value={formData.dataIdentificacao}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.dataIdentificacao}
                      helperText={errors.dataIdentificacao}
                    />
                  )}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dataIdentificacao,
                      helperText: errors.dataIdentificacao
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Informações adicionais sobre a alergia"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AlergiaFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  prontuarioId: PropTypes.string
};

export default AlergiaFormModal;
