import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";

const PrescreverMedicamentoForm = ({ medicamento, onSubmit }) => {
  const initialFormState = {
    pacienteId: "",
    pacienteNome: "",
    quantidade: 1,
    posologia: "",
    duracao: "",
    observacoes: "",
    atualizarEstoque: true,
    usoContinuo: false,
    prioridade: "normal"
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar lista de pacientes (simulado)
    setPacientes([
      { id: "1", nome: "João Silva" },
      { id: "2", nome: "Maria Oliveira" },
      { id: "3", nome: "Pedro Santos" },
      { id: "4", nome: "Ana Souza" },
      { id: "5", nome: "Carlos Ferreira" }
    ]);

    if (medicamento) {
      setFormData((prev) => ({
        ...prev,
        posologia: medicamento.posologia || ""
      }));
    }
  }, [medicamento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === "quantidade") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value)
      }));
    } else if (name === "pacienteId") {
      const pacienteSelecionado = pacientes.find((p) => p.id === value);
      setFormData((prev) => ({
        ...prev,
        pacienteId: value,
        pacienteNome: pacienteSelecionado ? pacienteSelecionado.nome : ""
      }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pacienteId) {
      newErrors.pacienteId = "Paciente é obrigatório";
    }

    if (!formData.posologia?.trim()) {
      newErrors.posologia = "Posologia é obrigatória";
    }

    if (formData.quantidade <= 0) {
      newErrors.quantidade = "Quantidade deve ser maior que zero";
    }

    if (!formData.usoContinuo && !formData.duracao?.trim()) {
      newErrors.duracao = "Duração do tratamento é obrigatória para uso não contínuo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Corrija os erros no formulário antes de continuar.
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        Informações da Prescrição
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.pacienteId}>
            <InputLabel>Paciente</InputLabel>
            <Select
              name="pacienteId"
              value={formData.pacienteId}
              onChange={handleChange}
              label="Paciente"
            >
              <MenuItem value="">
                <em>Selecione o paciente</em>
              </MenuItem>
              {pacientes.map((paciente) => (
                <MenuItem key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.pacienteId && <FormHelperText>{errors.pacienteId}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Quantidade"
            name="quantidade"
            type="number"
            value={formData.quantidade}
            onChange={handleChange}
            error={!!errors.quantidade}
            helperText={errors.quantidade}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.atualizarEstoque}
                onChange={handleChange}
                name="atualizarEstoque"
                color="primary"
              />
            }
            label="Descontar do estoque"
          />
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
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.usoContinuo}
                onChange={handleChange}
                name="usoContinuo"
                color="primary"
              />
            }
            label="Uso contínuo"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duração do Tratamento"
            name="duracao"
            value={formData.duracao}
            onChange={handleChange}
            disabled={formData.usoContinuo}
            error={!formData.usoContinuo && !!errors.duracao}
            helperText={!formData.usoContinuo && errors.duracao}
            placeholder="Ex: 7 dias, 2 semanas, etc."
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              Prioridade
            </Typography>
            <RadioGroup row name="prioridade" value={formData.prioridade} onChange={handleChange}>
              <FormControlLabel value="baixa" control={<Radio color="default" />} label="Baixa" />
              <FormControlLabel value="normal" control={<Radio color="primary" />} label="Normal" />
              <FormControlLabel value="alta" control={<Radio color="error" />} label="Alta" />
            </RadioGroup>
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
            rows={3}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" color="primary" size="large">
          Criar Prescrição
        </Button>
      </Box>
    </Box>
  );
};

export default PrescreverMedicamentoForm;
