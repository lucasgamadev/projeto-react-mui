import { Close as CloseIcon } from "@mui/icons-material";
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

/**
 * Modal para adicionar histórico familiar ao prontuário do paciente
 */
const HistoricoFamiliarFormModal = ({ open, onClose, onSave }) => {
  // Estado inicial do formulário
  const initialFormState = {
    doenca: "",
    parentesco: "",
    observacoes: ""
  };

  // Estados do formulário
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Lista de parentescos comuns
  const parentescos = [
    "Pai",
    "Mãe",
    "Avô Paterno",
    "Avó Paterna",
    "Avô Materno",
    "Avó Materna",
    "Irmão",
    "Irmã",
    "Tio Paterno",
    "Tia Paterna",
    "Tio Materno",
    "Tia Materna",
    "Primo",
    "Prima",
    "Outro"
  ];

  // Lista de doenças comuns para histórico familiar
  const doencasComuns = [
    "Hipertensão",
    "Diabetes Tipo 1",
    "Diabetes Tipo 2",
    "Câncer de Mama",
    "Câncer de Próstata",
    "Câncer de Pulmão",
    "Câncer Colorretal",
    "Doença Cardíaca",
    "Acidente Vascular Cerebral (AVC)",
    "Alzheimer",
    "Parkinson",
    "Asma",
    "Doença Pulmonar Obstrutiva Crônica (DPOC)",
    "Doença Renal Crônica",
    "Artrite Reumatoide",
    "Lúpus",
    "Esclerose Múltipla",
    "Depressão",
    "Transtorno Bipolar",
    "Esquizofrenia",
    "Obesidade",
    "Dislipidemia",
    "Hipotireoidismo",
    "Hipertireoidismo",
    "Osteoporose",
    "Anemia Falciforme",
    "Hemofilia",
    "Talassemia",
    "Fibrose Cística",
    "Doença Celíaca",
    "Doença de Crohn",
    "Colite Ulcerativa",
    "Epilepsia",
    "Enxaqueca",
    "Glaucoma",
    "Outro"
  ];

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};

    // Validar doença
    if (!formData.doenca.trim()) {
      newErrors.doenca = "A doença é obrigatória";
    }

    // Validar parentesco
    if (!formData.parentesco.trim()) {
      newErrors.parentesco = "O parentesco é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitting(true);

      // Criar objeto com dados do histórico familiar
      const historicoFamiliar = {
        id: `historico-${Date.now()}`,
        doenca: formData.doenca,
        parentesco: formData.parentesco,
        observacoes: formData.observacoes,
        dataCadastro: new Date().toISOString()
      };

      // Chamar função de callback para salvar
      onSave(historicoFamiliar);

      // Resetar formulário e fechar modal
      handleReset();
      onClose();
      setSubmitting(false);
    }
  };

  // Função para resetar o formulário
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  // Função para lidar com o fechamento do modal
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
          <Typography variant="h6">Adicionar Histórico Familiar</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.doenca}>
              <InputLabel id="doenca-label">Doença</InputLabel>
              <Select
                labelId="doenca-label"
                id="doenca"
                name="doenca"
                value={formData.doenca}
                onChange={handleChange}
                label="Doença"
              >
                {doencasComuns.map((doenca) => (
                  <MenuItem key={doenca} value={doenca}>
                    {doenca}
                  </MenuItem>
                ))}
              </Select>
              {errors.doenca && <FormHelperText>{errors.doenca}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.parentesco}>
              <InputLabel id="parentesco-label">Parentesco</InputLabel>
              <Select
                labelId="parentesco-label"
                id="parentesco"
                name="parentesco"
                value={formData.parentesco}
                onChange={handleChange}
                label="Parentesco"
              >
                {parentescos.map((parentesco) => (
                  <MenuItem key={parentesco} value={parentesco}>
                    {parentesco}
                  </MenuItem>
                ))}
              </Select>
              {errors.parentesco && <FormHelperText>{errors.parentesco}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="observacoes"
              name="observacoes"
              label="Observações"
              multiline
              rows={4}
              value={formData.observacoes}
              onChange={handleChange}
              fullWidth
              placeholder="Informações adicionais sobre a condição, idade de diagnóstico, tratamentos realizados, etc."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

HistoricoFamiliarFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default HistoricoFamiliarFormModal;
