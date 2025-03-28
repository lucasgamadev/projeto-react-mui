import {
  Add as AddIcon,
  LocalHospital as HospitalIcon,
  Info as InfoIcon,
  WarningAmber as WarningIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { classificarRisco, criteriosClassificacaoRisco } from "../../models/TriagemModel";

// Objeto com as cores para cada classificação de risco
const coresClassificacao = {
  vermelho: "#e53935", // Vermelho - Emergência
  laranja: "#fb8c00", // Laranja - Muito Urgente
  amarelo: "#fdd835", // Amarelo - Urgente
  verde: "#43a047", // Verde - Pouco Urgente
  azul: "#1e88e5" // Azul - Não Urgente
};

// Opções para o nível de consciência (AVPU)
const niveisConsciencia = ["Alerta", "Voz", "Dor", "Inconsciente"];

/**
 * Componente de formulário para triagem de pacientes
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.paciente - Dados do paciente
 * @param {Object} props.triagem - Dados da triagem (quando em edição)
 * @param {Function} props.onSubmit - Função chamada ao submeter o formulário
 */
const FormularioTriagem = ({ paciente, triagem, onSubmit }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    pacienteId: paciente?.id || "",
    nomePaciente: paciente?.nome || "",
    motivoAtendimento: triagem?.motivoAtendimento || "",
    queixaPrincipal: triagem?.queixaPrincipal || "",
    sintomas: triagem?.sintomas || [],
    sinaisVitais: {
      pressaoArterialSistolica: triagem?.sinaisVitais?.pressaoArterialSistolica || "",
      pressaoArterialDiastolica: triagem?.sinaisVitais?.pressaoArterialDiastolica || "",
      frequenciaCardiaca: triagem?.sinaisVitais?.frequenciaCardiaca || "",
      frequenciaRespiratoria: triagem?.sinaisVitais?.frequenciaRespiratoria || "",
      temperatura: triagem?.sinaisVitais?.temperatura || "",
      saturacaoOxigenio: triagem?.sinaisVitais?.saturacaoOxigenio || "",
      glicemia: triagem?.sinaisVitais?.glicemia || "",
      nivelConsciencia: triagem?.sinaisVitais?.nivelConsciencia || "Alerta",
      escalaGlasgow: triagem?.sinaisVitais?.escalaGlasgow || 15,
      escalaDor: triagem?.sinaisVitais?.escalaDor || 0
    },
    historicoRelevante: {
      alergias: triagem?.historicoRelevante?.alergias || [],
      medicamentosEmUso: triagem?.historicoRelevante?.medicamentosEmUso || [],
      doencasPrevias: triagem?.historicoRelevante?.doencasPrevias || [],
      cirurgias: triagem?.historicoRelevante?.cirurgias || [],
      gestante: triagem?.historicoRelevante?.gestante || false,
      semanasGestacao: triagem?.historicoRelevante?.semanasGestacao || "",
      condicoesRelevantes: triagem?.historicoRelevante?.condicoesRelevantes || []
    },
    observacoesEnfermagem: triagem?.observacoesEnfermagem || "",
    localAtendimento: triagem?.localAtendimento || ""
  });

  // Estado para armazenar novos sintomas e outros campos de lista
  const [novoItem, setNovoItem] = useState({
    sintoma: "",
    alergia: "",
    medicamento: "",
    doenca: "",
    cirurgia: "",
    condicao: ""
  });

  // Estado para a classificação de risco calculada
  const [classificacao, setClassificacao] = useState("");
  const [criteriosAtendidos, setCriteriosAtendidos] = useState([]);

  // Efeito para calcular a classificação de risco quando os sinais vitais mudam
  useEffect(() => {
    if (
      formData.sinaisVitais.pressaoArterialSistolica &&
      formData.sinaisVitais.frequenciaCardiaca &&
      formData.sinaisVitais.temperatura
    ) {
      const classificacaoCalculada = classificarRisco({
        sinaisVitais: formData.sinaisVitais,
        sintomas: formData.sintomas,
        queixaPrincipal: formData.queixaPrincipal
      });

      setClassificacao(classificacaoCalculada);

      // Define os critérios atendidos
      setCriteriosAtendidos(
        criteriosClassificacaoRisco[classificacaoCalculada].filter((criterio) => {
          // Lógica simplificada para verificar critérios
          // Em um sistema real, essa lógica seria mais complexa e específica
          return (
            formData.queixaPrincipal.toLowerCase().includes(criterio.toLowerCase()) ||
            formData.sintomas.some((s) => criterio.toLowerCase().includes(s.toLowerCase()))
          );
        })
      );
    }
  }, [formData.sinaisVitais, formData.sintomas, formData.queixaPrincipal]);

  // Handler para mudanças em campos simples
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Verifica se o campo está em sinaisVitais
    if (name.includes("sinaisVitais.")) {
      const campo = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        sinaisVitais: {
          ...prev.sinaisVitais,
          [campo]: value
        }
      }));
    }
    // Verifica se o campo está em historicoRelevante
    else if (name.includes("historicoRelevante.")) {
      const campo = name.split(".")[1];

      // Para o Switch de gestante, value é um boolean
      if (campo === "gestante") {
        setFormData((prev) => ({
          ...prev,
          historicoRelevante: {
            ...prev.historicoRelevante,
            [campo]: e.target.checked
          }
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          historicoRelevante: {
            ...prev.historicoRelevante,
            [campo]: value
          }
        }));
      }
    }
    // Campo simples no nível principal
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handler para sliders
  const handleSliderChange = (name, value) => {
    if (name === "escalaGlasgow" || name === "escalaDor") {
      setFormData((prev) => ({
        ...prev,
        sinaisVitais: {
          ...prev.sinaisVitais,
          [name]: value
        }
      }));
    }
  };

  // Handlers para adicionar itens a listas
  const handleAdicionarItem = (tipo) => {
    const valor = novoItem[tipo];

    if (!valor.trim()) return;

    let campoDestino;
    switch (tipo) {
      case "sintoma":
        campoDestino = "sintomas";
        break;
      case "alergia":
        campoDestino = "historicoRelevante.alergias";
        break;
      case "medicamento":
        campoDestino = "historicoRelevante.medicamentosEmUso";
        break;
      case "doenca":
        campoDestino = "historicoRelevante.doencasPrevias";
        break;
      case "cirurgia":
        campoDestino = "historicoRelevante.cirurgias";
        break;
      case "condicao":
        campoDestino = "historicoRelevante.condicoesRelevantes";
        break;
      default:
        return;
    }

    if (campoDestino.includes("historicoRelevante")) {
      const campo = campoDestino.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        historicoRelevante: {
          ...prev.historicoRelevante,
          [campo]: [...prev.historicoRelevante[campo], valor]
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [campoDestino]: [...prev[campoDestino], valor]
      }));
    }

    // Limpa o campo de entrada
    setNovoItem((prev) => ({
      ...prev,
      [tipo]: ""
    }));
  };

  // Handler para remover itens de listas
  const handleRemoverItem = (tipo, index) => {
    let campoDestino;
    switch (tipo) {
      case "sintoma":
        campoDestino = "sintomas";
        break;
      case "alergia":
        campoDestino = "historicoRelevante.alergias";
        break;
      case "medicamento":
        campoDestino = "historicoRelevante.medicamentosEmUso";
        break;
      case "doenca":
        campoDestino = "historicoRelevante.doencasPrevias";
        break;
      case "cirurgia":
        campoDestino = "historicoRelevante.cirurgias";
        break;
      case "condicao":
        campoDestino = "historicoRelevante.condicoesRelevantes";
        break;
      default:
        return;
    }

    if (campoDestino.includes("historicoRelevante")) {
      const campo = campoDestino.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        historicoRelevante: {
          ...prev.historicoRelevante,
          [campo]: prev.historicoRelevante[campo].filter((_, i) => i !== index)
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [campoDestino]: prev[campoDestino].filter((_, i) => i !== index)
      }));
    }
  };

  // Handler para enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você pode adicionar validações adicionais antes de enviar

    // Chama a função onSubmit passando os dados do formulário e a classificação
    if (onSubmit) {
      onSubmit(formData, classificacao);
    }
  };

  // Renderização do componente de lista de itens (sintomas, alergias, etc.)
  const renderListaItens = (items, tipo, label, placeholder) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}:
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          value={novoItem[tipo]}
          onChange={(e) => setNovoItem((prev) => ({ ...prev, [tipo]: e.target.value }))}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAdicionarItem(tipo))}
        />
        <Button
          variant="outlined"
          sx={{ ml: 1, minWidth: 36, width: 36, height: 36, p: 0 }}
          onClick={() => handleAdicionarItem(tipo)}
        >
          <AddIcon />
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum item cadastrado
          </Typography>
        ) : (
          items.map((item, index) => (
            <Chip
              key={index}
              label={item}
              onDelete={() => handleRemoverItem(tipo, index)}
              size="small"
            />
          ))
        )}
      </Box>
    </Box>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
          <Box display="flex" alignItems="center">
            <HospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">TRIAGEM DO PACIENTE</Typography>
          </Box>
          <IconButton size="small" onClick={() => window.history.back()}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" gutterBottom>
          Dados do Paciente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do Paciente"
              value={formData.nomePaciente}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID do Paciente"
              value={formData.pacienteId}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Motivo do Atendimento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Motivo do Atendimento"
              name="motivoAtendimento"
              value={formData.motivoAtendimento}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Queixa Principal"
              name="queixaPrincipal"
              value={formData.queixaPrincipal}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={12}>
            {renderListaItens(formData.sintomas, "sintoma", "Sintomas", "Adicionar sintoma")}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          Sinais Vitais
          <Tooltip title="Os sinais vitais são fundamentais para a classificação de risco">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pressão Arterial Sistólica"
              name="sinaisVitais.pressaoArterialSistolica"
              value={formData.sinaisVitais.pressaoArterialSistolica}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">mmHg</InputAdornment>
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pressão Arterial Diastólica"
              name="sinaisVitais.pressaoArterialDiastolica"
              value={formData.sinaisVitais.pressaoArterialDiastolica}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">mmHg</InputAdornment>
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Frequência Cardíaca"
              name="sinaisVitais.frequenciaCardiaca"
              value={formData.sinaisVitais.frequenciaCardiaca}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">bpm</InputAdornment>
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Frequência Respiratória"
              name="sinaisVitais.frequenciaRespiratoria"
              value={formData.sinaisVitais.frequenciaRespiratoria}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">irpm</InputAdornment>
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Temperatura"
              name="sinaisVitais.temperatura"
              value={formData.sinaisVitais.temperatura}
              onChange={handleChange}
              type="number"
              inputProps={{ step: "0.1" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">°C</InputAdornment>
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Saturação de Oxigênio"
              name="sinaisVitais.saturacaoOxigenio"
              value={formData.sinaisVitais.saturacaoOxigenio}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Glicemia"
              name="sinaisVitais.glicemia"
              value={formData.sinaisVitais.glicemia}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">mg/dL</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="nivel-consciencia-label">Nível de Consciência (AVPU)</InputLabel>
              <Select
                labelId="nivel-consciencia-label"
                name="sinaisVitais.nivelConsciencia"
                value={formData.sinaisVitais.nivelConsciencia}
                onChange={handleChange}
                label="Nível de Consciência (AVPU)"
                required
              >
                {niveisConsciencia.map((nivel) => (
                  <MenuItem key={nivel} value={nivel}>
                    {nivel}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                A: Alerta, V: Responde à Voz, P: Responde à Dor, U: Inconsciente
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography id="glasgow-slider" gutterBottom>
              Escala de Glasgow: {formData.sinaisVitais.escalaGlasgow}
            </Typography>
            <Slider
              value={formData.sinaisVitais.escalaGlasgow}
              onChange={(_, value) => handleSliderChange("escalaGlasgow", value)}
              aria-labelledby="glasgow-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={3}
              max={15}
            />
            <FormHelperText>3 = Coma Profundo, 15 = Normal</FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography id="dor-slider" gutterBottom>
              Escala de Dor: {formData.sinaisVitais.escalaDor}
            </Typography>
            <Slider
              value={formData.sinaisVitais.escalaDor}
              onChange={(_, value) => handleSliderChange("escalaDor", value)}
              aria-labelledby="dor-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
            <FormHelperText>0 = Sem Dor, 10 = Dor Máxima</FormHelperText>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Histórico Relevante
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderListaItens(
              formData.historicoRelevante.alergias,
              "alergia",
              "Alergias",
              "Adicionar alergia"
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderListaItens(
              formData.historicoRelevante.medicamentosEmUso,
              "medicamento",
              "Medicamentos em Uso",
              "Adicionar medicamento"
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderListaItens(
              formData.historicoRelevante.doencasPrevias,
              "doenca",
              "Doenças Prévias",
              "Adicionar doença"
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderListaItens(
              formData.historicoRelevante.cirurgias,
              "cirurgia",
              "Cirurgias",
              "Adicionar cirurgia"
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.historicoRelevante.gestante}
                  onChange={handleChange}
                  name="historicoRelevante.gestante"
                />
              }
              label="Gestante"
            />
            {formData.historicoRelevante.gestante && (
              <TextField
                fullWidth
                label="Semanas de Gestação"
                name="historicoRelevante.semanasGestacao"
                value={formData.historicoRelevante.semanasGestacao}
                onChange={handleChange}
                type="number"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderListaItens(
              formData.historicoRelevante.condicoesRelevantes,
              "condicao",
              "Outras Condições Relevantes",
              "Adicionar condição"
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Observações e Local de Atendimento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações de Enfermagem"
              name="observacoesEnfermagem"
              value={formData.observacoesEnfermagem}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Local de Atendimento"
              name="localAtendimento"
              value={formData.localAtendimento}
              onChange={handleChange}
              placeholder="Ex: Consultório 3, Sala de Emergência, etc."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Exibição da classificação de risco calculada */}
      {classificacao && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderLeft: `10px solid ${coresClassificacao[classificacao]}`,
            backgroundColor: `${coresClassificacao[classificacao]}22`
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <HospitalIcon
              sx={{
                mr: 1,
                color: coresClassificacao[classificacao],
                fontSize: 30
              }}
            />
            <Typography variant="h6">
              Classificação de Risco: <strong>{classificacao.toUpperCase()}</strong>
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Critérios atendidos:
          </Typography>

          {criteriosAtendidos.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {criteriosAtendidos.map((criterio, index) => (
                <Chip
                  key={index}
                  label={criterio}
                  size="small"
                  color="primary"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Classificação baseada nos sinais vitais e sintomas gerais.
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ mr: 1, color: "warning.main" }} />
            <Typography variant="body2" color="text.secondary">
              Esta classificação é calculada automaticamente com base nos dados inseridos. A decisão
              final deve ser validada pelo profissional de saúde.
            </Typography>
          </Box>
        </Paper>
      )}

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button type="button" color="inherit" sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={!classificacao}>
          Concluir Triagem
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioTriagem;
