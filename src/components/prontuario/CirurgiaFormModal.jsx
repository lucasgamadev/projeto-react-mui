import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Report as ReportIcon } from '@mui/icons-material';

const CirurgiaFormModal = ({ open, onClose, onSave }) => {
  const [cirurgia, setCirurgia] = useState({
    tipo: "",
    data: new Date(),
    hospital: "",
    medicoResponsavel: "",
    descricao: "",
    resultado: "",
    complicacoes: "Nenhuma"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setCirurgia((prev) => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando ele for preenchido
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cirurgia.tipo.trim()) {
      newErrors.tipo = "O tipo da cirurgia é obrigatório";
    }

    if (!cirurgia.hospital.trim()) {
      newErrors.hospital = "O hospital é obrigatório";
    }

    if (!cirurgia.medicoResponsavel.trim()) {
      newErrors.medicoResponsavel = "O médico responsável é obrigatório";
    }

    if (!cirurgia.resultado.trim()) {
      newErrors.resultado = "O resultado da cirurgia é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(cirurgia);
      handleClose();
    }
  };

  const handleClose = () => {
    setCirurgia({
      tipo: "",
      data: new Date(),
      hospital: "",
      medicoResponsavel: "",
      descricao: "",
      resultado: "",
      complicacoes: "Nenhuma"
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <ReportIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">NOVA CIRURGIA</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.tipo}>
                <InputLabel>Tipo de Cirurgia</InputLabel>
                <Select
                  value={cirurgia.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value)}
                  label="Tipo de Cirurgia"
                >
                  <MenuItem value="Cardíaca">Cardíaca</MenuItem>
                  <MenuItem value="Ortopédica">Ortopédica</MenuItem>
                  <MenuItem value="Plástica">Plástica</MenuItem>
                  <MenuItem value="Outra">Outra</MenuItem>
                </Select>
                {errors.tipo && <FormHelperText>{errors.tipo}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hospital"
                value={cirurgia.hospital}
                onChange={(e) => handleChange('hospital', e.target.value)}
                error={!!errors.hospital}
                helperText={errors.hospital}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Médico Responsável"
                value={cirurgia.medicoResponsavel}
                onChange={(e) => handleChange('medicoResponsavel', e.target.value)}
                error={!!errors.medicoResponsavel}
                helperText={errors.medicoResponsavel}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                <DatePicker
                  label="Data da Cirurgia"
                  value={cirurgia.data}
                  onChange={(date) => handleChange('data', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resultado"
                value={cirurgia.resultado}
                onChange={(e) => handleChange('resultado', e.target.value)}
                error={!!errors.resultado}
                helperText={errors.resultado}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Complicações"
                value={cirurgia.complicacoes}
                onChange={(e) => handleChange('complicacoes', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CirurgiaFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default CirurgiaFormModal;
