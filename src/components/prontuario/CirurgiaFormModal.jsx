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
  TextField,
  Typography
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import { useState } from "react";

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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Registrar Nova Cirurgia
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tipo de Cirurgia"
                fullWidth
                value={cirurgia.tipo}
                onChange={(e) => handleChange("tipo", e.target.value)}
                error={!!errors.tipo}
                helperText={errors.tipo}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data da Cirurgia"
                  value={cirurgia.data}
                  onChange={(newValue) => handleChange("data", newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hospital"
                fullWidth
                value={cirurgia.hospital}
                onChange={(e) => handleChange("hospital", e.target.value)}
                error={!!errors.hospital}
                helperText={errors.hospital}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Médico Responsável"
                fullWidth
                value={cirurgia.medicoResponsavel}
                onChange={(e) => handleChange("medicoResponsavel", e.target.value)}
                error={!!errors.medicoResponsavel}
                helperText={errors.medicoResponsavel}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrição do Procedimento"
                fullWidth
                multiline
                rows={3}
                value={cirurgia.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Resultado"
                fullWidth
                value={cirurgia.resultado}
                onChange={(e) => handleChange("resultado", e.target.value)}
                error={!!errors.resultado}
                helperText={errors.resultado}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="complicacoes-label">Complicações</InputLabel>
                <Select
                  labelId="complicacoes-label"
                  value={cirurgia.complicacoes}
                  label="Complicações"
                  onChange={(e) => handleChange("complicacoes", e.target.value)}
                >
                  <MenuItem value="Nenhuma">Nenhuma</MenuItem>
                  <MenuItem value="Leves">Leves</MenuItem>
                  <MenuItem value="Moderadas">Moderadas</MenuItem>
                  <MenuItem value="Graves">Graves</MenuItem>
                </Select>
                <FormHelperText>Selecione se houve complicações</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
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
