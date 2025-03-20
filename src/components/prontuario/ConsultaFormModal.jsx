import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import { useState } from "react";

const ConsultaFormModal = ({ open, onClose, onSave }) => {
  const [consulta, setConsulta] = useState({
    data: new Date(),
    medicoNome: "",
    medicoCRM: "",
    especialidade: "",
    motivoConsulta: "",
    descricaoQueixa: "",
    sinaisVitais: {
      pressaoArterialSistolica: "",
      pressaoArterialDiastolica: "",
      frequenciaCardiaca: "",
      frequenciaRespiratoria: "",
      temperatura: "",
      saturacaoOxigenio: "",
      peso: "",
      altura: "",
      glicemia: ""
    },
    hipoteseDiagnostica: "",
    diagnosticoDefinitivo: "",
    codigosCID: [],
    conduta: "",
    prescricoes: [],
    examesSolicitados: [],
    encaminhamentos: [],
    procedimentos: [],
    observacoes: ""
  });

  const [novoPrescricao, setNovoPrescricao] = useState({
    medicamento: "",
    concentracao: "",
    posologia: "",
    duracao: "",
    continuo: false,
    observacoes: ""
  });

  const [novoExame, setNovoExame] = useState({
    exame: "",
    justificativa: "",
    preparos: "",
    prazoRecomendado: new Date()
  });

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setConsulta((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setConsulta((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddPrescricao = () => {
    if (novoPrescricao.medicamento && novoPrescricao.posologia) {
      setConsulta((prev) => ({
        ...prev,
        prescricoes: [...prev.prescricoes, { ...novoPrescricao }]
      }));
      setNovoPrescricao({
        medicamento: "",
        concentracao: "",
        posologia: "",
        duracao: "",
        continuo: false,
        observacoes: ""
      });
    }
  };

  const handleRemovePrescricao = (index) => {
    setConsulta((prev) => ({
      ...prev,
      prescricoes: prev.prescricoes.filter((_, i) => i !== index)
    }));
  };

  const handleAddExame = () => {
    if (novoExame.exame) {
      setConsulta((prev) => ({
        ...prev,
        examesSolicitados: [...prev.examesSolicitados, { ...novoExame }]
      }));
      setNovoExame({
        exame: "",
        justificativa: "",
        preparos: "",
        prazoRecomendado: new Date()
      });
    }
  };

  const handleRemoveExame = (index) => {
    setConsulta((prev) => ({
      ...prev,
      examesSolicitados: prev.examesSolicitados.filter((_, i) => i !== index)
    }));
  };

  const handleAddCID = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const novoCID = event.target.value.toUpperCase();
      if (!consulta.codigosCID.includes(novoCID)) {
        setConsulta((prev) => ({
          ...prev,
          codigosCID: [...prev.codigosCID, novoCID]
        }));
        event.target.value = "";
      }
    }
  };

  const handleRemoveCID = (cid) => {
    setConsulta((prev) => ({
      ...prev,
      codigosCID: prev.codigosCID.filter((c) => c !== cid)
    }));
  };

  const handleSave = () => {
    // Calcula o IMC se peso e altura estiverem preenchidos
    if (consulta.sinaisVitais.peso && consulta.sinaisVitais.altura) {
      const peso = parseFloat(consulta.sinaisVitais.peso);
      const altura = parseFloat(consulta.sinaisVitais.altura) / 100; // Convertendo cm para m
      const imc = peso / (altura * altura);
      consulta.sinaisVitais.imc = imc.toFixed(1);
    }

    onSave(consulta);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nova Consulta</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Data e Hora */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DateTimePicker
                label="Data e Hora"
                value={consulta.data}
                onChange={(newValue) => {
                  setConsulta((prev) => ({ ...prev, data: newValue }));
                }}
                slots={{
                  textField: (params) => <TextField {...params} fullWidth required />
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Médico */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome do Médico"
              value={consulta.medicoNome}
              onChange={(e) => handleChange("medicoNome", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="CRM"
              value={consulta.medicoCRM}
              onChange={(e) => handleChange("medicoCRM", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Especialidade"
              value={consulta.especialidade}
              onChange={(e) => handleChange("especialidade", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Motivo e Queixa */}
          <Grid item xs={12}>
            <TextField
              label="Motivo da Consulta"
              value={consulta.motivoConsulta}
              onChange={(e) => handleChange("motivoConsulta", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descrição da Queixa"
              value={consulta.descricaoQueixa}
              onChange={(e) => handleChange("descricaoQueixa", e.target.value)}
              multiline
              rows={3}
              fullWidth
              required
            />
          </Grid>

          {/* Sinais Vitais */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Sinais Vitais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="PA Sistólica"
                  type="number"
                  value={consulta.sinaisVitais.pressaoArterialSistolica}
                  onChange={(e) =>
                    handleChange("sinaisVitais.pressaoArterialSistolica", e.target.value)
                  }
                  fullWidth
                  InputProps={{ endAdornment: "mmHg" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="PA Diastólica"
                  type="number"
                  value={consulta.sinaisVitais.pressaoArterialDiastolica}
                  onChange={(e) =>
                    handleChange("sinaisVitais.pressaoArterialDiastolica", e.target.value)
                  }
                  fullWidth
                  InputProps={{ endAdornment: "mmHg" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Freq. Cardíaca"
                  type="number"
                  value={consulta.sinaisVitais.frequenciaCardiaca}
                  onChange={(e) => handleChange("sinaisVitais.frequenciaCardiaca", e.target.value)}
                  fullWidth
                  InputProps={{ endAdornment: "bpm" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Freq. Respiratória"
                  type="number"
                  value={consulta.sinaisVitais.frequenciaRespiratoria}
                  onChange={(e) =>
                    handleChange("sinaisVitais.frequenciaRespiratoria", e.target.value)
                  }
                  fullWidth
                  InputProps={{ endAdornment: "irpm" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Temperatura"
                  type="number"
                  value={consulta.sinaisVitais.temperatura}
                  onChange={(e) => handleChange("sinaisVitais.temperatura", e.target.value)}
                  fullWidth
                  InputProps={{ endAdornment: "°C" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Saturação O2"
                  type="number"
                  value={consulta.sinaisVitais.saturacaoOxigenio}
                  onChange={(e) => handleChange("sinaisVitais.saturacaoOxigenio", e.target.value)}
                  fullWidth
                  InputProps={{ endAdornment: "%" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Peso"
                  type="number"
                  value={consulta.sinaisVitais.peso}
                  onChange={(e) => handleChange("sinaisVitais.peso", e.target.value)}
                  fullWidth
                  InputProps={{ endAdornment: "kg" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Altura"
                  type="number"
                  value={consulta.sinaisVitais.altura}
                  onChange={(e) => handleChange("sinaisVitais.altura", e.target.value)}
                  fullWidth
                  InputProps={{ endAdornment: "cm" }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Glicemia"
                  type="number"
                  value={consulta.sinaisVitais.glicemia}
                  onChange={(e) => handleChange("sinaisVitais.glicemia", e.target.value)}
                  fullWidth
                  InputProps={{ endAdornment: "mg/dL" }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Diagnóstico */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Diagnóstico
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Hipótese Diagnóstica"
                  value={consulta.hipoteseDiagnostica}
                  onChange={(e) => handleChange("hipoteseDiagnostica", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Diagnóstico Definitivo"
                  value={consulta.diagnosticoDefinitivo}
                  onChange={(e) => handleChange("diagnosticoDefinitivo", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Códigos CID (Pressione Enter para adicionar)"
                  onKeyPress={handleAddCID}
                  fullWidth
                />
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {consulta.codigosCID.map((cid) => (
                    <Chip
                      key={cid}
                      label={cid}
                      onDelete={() => handleRemoveCID(cid)}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Conduta */}
          <Grid item xs={12}>
            <TextField
              label="Conduta"
              value={consulta.conduta}
              onChange={(e) => handleChange("conduta", e.target.value)}
              multiline
              rows={3}
              fullWidth
              required
            />
          </Grid>

          {/* Prescrições */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Prescrições
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Medicamento"
                  value={novoPrescricao.medicamento}
                  onChange={(e) =>
                    setNovoPrescricao((prev) => ({ ...prev, medicamento: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Concentração"
                  value={novoPrescricao.concentracao}
                  onChange={(e) =>
                    setNovoPrescricao((prev) => ({ ...prev, concentracao: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Posologia"
                  value={novoPrescricao.posologia}
                  onChange={(e) =>
                    setNovoPrescricao((prev) => ({ ...prev, posologia: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duração"
                  value={novoPrescricao.duracao}
                  onChange={(e) =>
                    setNovoPrescricao((prev) => ({ ...prev, duracao: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddPrescricao}
                  disabled={!novoPrescricao.medicamento || !novoPrescricao.posologia}
                >
                  Adicionar Prescrição
                </Button>
              </Grid>
            </Grid>

            {consulta.prescricoes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {consulta.prescricoes.map((prescricao, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">
                        {prescricao.medicamento} {prescricao.concentracao}
                      </Typography>
                      <IconButton size="small" onClick={() => handleRemovePrescricao(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2">{prescricao.posologia}</Typography>
                    {prescricao.duracao && (
                      <Typography variant="caption" display="block">
                        Duração: {prescricao.duracao}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Exames */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Exames Solicitados
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Exame"
                  value={novoExame.exame}
                  onChange={(e) => setNovoExame((prev) => ({ ...prev, exame: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Justificativa"
                  value={novoExame.justificativa}
                  onChange={(e) =>
                    setNovoExame((prev) => ({ ...prev, justificativa: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Preparos"
                  value={novoExame.preparos}
                  onChange={(e) => setNovoExame((prev) => ({ ...prev, preparos: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddExame}
                  disabled={!novoExame.exame}
                >
                  Adicionar Exame
                </Button>
              </Grid>
            </Grid>

            {consulta.examesSolicitados.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {consulta.examesSolicitados.map((exame, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{exame.exame}</Typography>
                      <IconButton size="small" onClick={() => handleRemoveExame(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    {exame.justificativa && (
                      <Typography variant="body2">Justificativa: {exame.justificativa}</Typography>
                    )}
                    {exame.preparos && (
                      <Typography variant="caption" display="block">
                        Preparos: {exame.preparos}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Observações */}
          <Grid item xs={12}>
            <TextField
              label="Observações"
              value={consulta.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar Consulta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConsultaFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ConsultaFormModal;
