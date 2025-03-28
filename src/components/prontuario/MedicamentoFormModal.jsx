import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
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

const MedicamentoFormModal = ({ open, onClose, onSave, prontuarioId }) => {
  const initialFormState = {
    nome: "",
    principioAtivo: "",
    concentracao: "",
    formaFarmaceutica: "",
    posologia: "",
    viaAdministracao: "",
    dataInicio: new Date(),
    dataFim: null,
    continuo: false,
    observacoes: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const formasFarmaceuticas = [
    "Comprimido",
    "Cápsula",
    "Solução Oral",
    "Suspensão",
    "Xarope",
    "Pomada",
    "Creme",
    "Gel",
    "Injetável",
    "Spray",
    "Adesivo Transdérmico",
    "Outro"
  ];

  const viasAdministracao = [
    "Oral",
    "Intravenosa",
    "Intramuscular",
    "Subcutânea",
    "Tópica",
    "Retal",
    "Inalatória",
    "Sublingual",
    "Transdérmica",
    "Outra"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));

      // Se marcar como contínuo, limpa a data fim
      if (name === "continuo" && checked) {
        setFormData((prev) => ({
          ...prev,
          dataFim: null
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpa o erro do campo quando ele é modificado
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date
    }));

    // Limpa o erro do campo quando ele é modificado
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome do medicamento é obrigatório";
    }

    if (!formData.principioAtivo?.trim()) {
      newErrors.principioAtivo = "Princípio ativo é obrigatório";
    }

    if (!formData.posologia?.trim()) {
      newErrors.posologia = "Posologia é obrigatória";
    }

    if (!formData.formaFarmaceutica) {
      newErrors.formaFarmaceutica = "Forma farmacêutica é obrigatória";
    }

    if (!formData.viaAdministracao) {
      newErrors.viaAdministracao = "Via de administração é obrigatória";
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória";
    }

    if (!formData.continuo && !formData.dataFim) {
      newErrors.dataFim = "Data de término é obrigatória para medicamentos não contínuos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Adiciona o ID do prontuário ao medicamento
      const medicamentoComProntuario = {
        ...formData,
        prontuarioId,
        id: `med-${Date.now()}`
      };

      onSave(medicamentoComProntuario);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Adicionar Novo Medicamento</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nome do Medicamento"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={!!errors.nome}
                helperText={errors.nome}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Princípio Ativo"
                name="principioAtivo"
                value={formData.principioAtivo}
                onChange={handleChange}
                error={!!errors.principioAtivo}
                helperText={errors.principioAtivo}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Concentração"
                name="concentracao"
                value={formData.concentracao}
                onChange={handleChange}
                placeholder="Ex: 500mg, 10mg/mL"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.formaFarmaceutica}>
                <InputLabel>Forma Farmacêutica</InputLabel>
                <Select
                  name="formaFarmaceutica"
                  value={formData.formaFarmaceutica}
                  onChange={handleChange}
                  label="Forma Farmacêutica"
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {formasFarmaceuticas.map((forma) => (
                    <MenuItem key={forma} value={forma}>
                      {forma}
                    </MenuItem>
                  ))}
                </Select>
                {errors.formaFarmaceutica && (
                  <FormHelperText>{errors.formaFarmaceutica}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Posologia"
                name="posologia"
                value={formData.posologia}
                onChange={handleChange}
                error={!!errors.posologia}
                helperText={errors.posologia}
                multiline
                rows={2}
                placeholder="Ex: 1 comprimido a cada 8 horas por 7 dias"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.viaAdministracao}>
                <InputLabel>Via de Administração</InputLabel>
                <Select
                  name="viaAdministracao"
                  value={formData.viaAdministracao}
                  onChange={handleChange}
                  label="Via de Administração"
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {viasAdministracao.map((via) => (
                    <MenuItem key={via} value={via}>
                      {via}
                    </MenuItem>
                  ))}
                </Select>
                {errors.viaAdministracao && (
                  <FormHelperText>{errors.viaAdministracao}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.continuo}
                    onChange={handleChange}
                    name="continuo"
                    color="primary"
                  />
                }
                label="Uso Contínuo"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Início *"
                  value={formData.dataInicio}
                  onChange={(date) => handleDateChange("dataInicio", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.dataInicio,
                      helperText: errors.dataInicio
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Término"
                  value={formData.dataFim}
                  onChange={(date) => handleDateChange("dataFim", date)}
                  disabled={formData.continuo}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: !formData.continuo,
                      error: !!errors.dataFim,
                      helperText:
                        errors.dataFim ||
                        (formData.continuo ? "Não aplicável para uso contínuo" : "")
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
                placeholder="Informações adicionais, recomendações ou precauções"
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

MedicamentoFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  prontuarioId: PropTypes.string.isRequired
};

export default MedicamentoFormModal;
