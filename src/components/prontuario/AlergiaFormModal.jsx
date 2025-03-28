import { Close as CloseIcon } from '@mui/icons-material';
import { Add as AddIcon, MedicalServices as MedicalServicesIcon, SecurityUpdateWarning as SecurityUpdateWarningIcon } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { useState } from 'react';

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

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.tipo) newErrors.tipo = 'Campo obrigatório';
    if (!formData.agente) newErrors.agente = 'Campo obrigatório';
    if (!formData.reacao) newErrors.reacao = 'Campo obrigatório';
    if (!formData.gravidade) newErrors.gravidade = 'Campo obrigatório';
    if (!formData.dataIdentificacao) newErrors.dataIdentificacao = 'Campo obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <SecurityUpdateWarningIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">NOVA ALERGIA</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.tipo}>
              <InputLabel>Tipo de Alergia</InputLabel>
              <Select
                value={formData.tipo}
                label="Tipo de Alergia"
                onChange={handleChange}
                name="tipo"
              >
                {tiposAlergia.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.tipo}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agente"
              value={formData.agente}
              onChange={handleChange}
              name="agente"
              error={!!errors.agente}
              helperText={errors.agente}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reação"
              value={formData.reacao}
              onChange={handleChange}
              name="reacao"
              error={!!errors.reacao}
              helperText={errors.reacao}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.gravidade}>
              <InputLabel>Gravidade</InputLabel>
              <Select
                value={formData.gravidade}
                label="Gravidade"
                onChange={handleChange}
                name="gravidade"
              >
                {gravidadeOptions.map((gravidade) => (
                  <MenuItem key={gravidade} value={gravidade}>
                    {gravidade}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.gravidade}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
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
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              value={formData.observacoes}
              onChange={handleChange}
              name="observacoes"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
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

AlergiaFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  prontuarioId: PropTypes.string
};

export default AlergiaFormModal;
