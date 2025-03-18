import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";

const CadastroMedicamentoForm = ({ medicamento, onSubmit }) => {
  const initialFormState = {
    nome: "",
    principioAtivo: "",
    descricao: "",
    dosagem: "",
    unidadeDosagem: "mg",
    formaFarmaceutica: "",
    fabricante: "",
    quantidadeEstoque: 0,
    estoqueMinimo: 10,
    posologia: "",
    viaAdministracao: "",
    contraIndicacoes: "",
    efeitosColaterais: "",
    observacoes: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (medicamento) {
      setFormData({
        ...initialFormState,
        ...medicamento
      });
    } else {
      setFormData(initialFormState);
    }
  }, [medicamento]);

  const unidadesDosagem = ["mg", "mcg", "g", "mL", "L", "%", "UI"];
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
    "Supositório",
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
    const { name, value } = e.target;

    // Trata campos numéricos
    if (name === "quantidadeEstoque" || name === "estoqueMinimo") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value)
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

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.principioAtivo?.trim()) {
      newErrors.principioAtivo = "Princípio ativo é obrigatório";
    }

    if (!formData.dosagem?.toString().trim()) {
      newErrors.dosagem = "Dosagem é obrigatória";
    }

    if (!formData.formaFarmaceutica?.trim()) {
      newErrors.formaFarmaceutica = "Forma farmacêutica é obrigatória";
    }

    if (!formData.viaAdministracao?.trim()) {
      newErrors.viaAdministracao = "Via de administração é obrigatória";
    }

    if (formData.quantidadeEstoque < 0) {
      newErrors.quantidadeEstoque = "Quantidade de estoque não pode ser negativa";
    }

    if (formData.estoqueMinimo < 0) {
      newErrors.estoqueMinimo = "Estoque mínimo não pode ser negativo";
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
        Informações Básicas
      </Typography>

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

        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Dosagem"
            name="dosagem"
            type="number"
            value={formData.dosagem}
            onChange={handleChange}
            error={!!errors.dosagem}
            helperText={errors.dosagem}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel>Unidade de Dosagem</InputLabel>
            <Select
              name="unidadeDosagem"
              value={formData.unidadeDosagem}
              onChange={handleChange}
              label="Unidade de Dosagem"
            >
              {unidadesDosagem.map((unidade) => (
                <MenuItem key={unidade} value={unidade}>
                  {unidade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required error={!!errors.formaFarmaceutica}>
            <InputLabel>Forma Farmacêutica</InputLabel>
            <Select
              name="formaFarmaceutica"
              value={formData.formaFarmaceutica}
              onChange={handleChange}
              label="Forma Farmacêutica"
            >
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

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.viaAdministracao}>
            <InputLabel>Via de Administração</InputLabel>
            <Select
              name="viaAdministracao"
              value={formData.viaAdministracao}
              onChange={handleChange}
              label="Via de Administração"
            >
              {viasAdministracao.map((via) => (
                <MenuItem key={via} value={via}>
                  {via}
                </MenuItem>
              ))}
            </Select>
            {errors.viaAdministracao && <FormHelperText>{errors.viaAdministracao}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fabricante"
            name="fabricante"
            value={formData.fabricante}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Estoque
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantidade em Estoque"
            name="quantidadeEstoque"
            type="number"
            value={formData.quantidadeEstoque}
            onChange={handleChange}
            error={!!errors.quantidadeEstoque}
            helperText={errors.quantidadeEstoque}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estoque Mínimo"
            name="estoqueMinimo"
            type="number"
            value={formData.estoqueMinimo}
            onChange={handleChange}
            error={!!errors.estoqueMinimo}
            helperText={errors.estoqueMinimo}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Informações de Uso
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Posologia Recomendada"
            name="posologia"
            value={formData.posologia}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Contra-indicações"
            name="contraIndicacoes"
            value={formData.contraIndicacoes}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Efeitos Colaterais"
            name="efeitosColaterais"
            value={formData.efeitosColaterais}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Observações"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" color="primary" size="large">
          {medicamento ? "Atualizar Medicamento" : "Cadastrar Medicamento"}
        </Button>
      </Box>
    </Box>
  );
};

export default CadastroMedicamentoForm;
