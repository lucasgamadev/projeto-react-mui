import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  DocumentScanner as DocumentScannerIcon,
  Event as EventIcon,
  Healing as HealingIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  ReceiptLong as ReceiptLongIcon,
  Report as ReportIcon,
  Science as ScienceIcon,
  SecurityUpdateWarning as SecurityUpdateWarningIcon
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useProntuario } from "../../contexts/ProntuarioContext";
import ConsultaFormModal from "./ConsultaFormModal";

// Componente de Tab Panel para as abas do prontuário
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`prontuario-tabpanel-${index}`}
      aria-labelledby={`prontuario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

// Componente para exibir dados pessoais do paciente
const DadosPessoais = ({ paciente }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Informações Pessoais
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: 1,
          borderColor: "primary.main",
          bgcolor: "primary.lighter",
          transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: 3
          }
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nome Completo
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.nomePaciente}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              CPF
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.cpf}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data de Nascimento
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.dataNascimento}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Sexo
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.sexo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Estado Civil
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.dadosPessoais.estadoCivil}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Profissão
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.dadosPessoais.profissao}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Endereço
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.dadosPessoais.endereco}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo Sanguíneo
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.dadosPessoais.tipoSanguineo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Convênio
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paciente.dadosPessoais.convenio}
              {paciente.dadosPessoais.numeroConvenio
                ? ` - ${paciente.dadosPessoais.numeroConvenio}`
                : ""}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Contatos
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          border: 1,
          borderColor: "info.main",
          bgcolor: "info.lighter",
          transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: 3
          }
        }}
      >
        <List>
          {paciente.contatos.map((contato, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemText
                primary={contato.valor}
                secondary={contato.tipo}
                primaryTypographyProps={{
                  fontWeight: contato.principal ? "bold" : "medium",
                  color: contato.principal ? "primary" : "initial"
                }}
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
              {contato.principal && (
                <ListItemSecondaryAction>
                  <Chip label="Principal" size="small" color="primary" />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

DadosPessoais.propTypes = {
  paciente: PropTypes.object.isRequired
};

// Componente para exibir histórico médico do paciente
const HistoricoMedico = ({ prontuario }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [consultaModalOpen, setConsultaModalOpen] = useState(false);
  const { carregarConsultasExemplo, loading } = useProntuario();

  const handleExpandClick = (consultaId) => {
    setExpandedItem(expandedItem === consultaId ? null : consultaId);
  };

  const handleAddConsulta = (novaConsulta) => {
    // Aqui você deve implementar a lógica para adicionar a consulta ao prontuário
    // Por enquanto, vamos apenas simular a adição
    console.log("Nova consulta:", novaConsulta);
  };

  const handleCarregarExemplos = async () => {
    try {
      await carregarConsultasExemplo();
      alert("Consultas de exemplo carregadas com sucesso!");
    } catch (error) {
      alert(`Erro ao carregar consultas: ${error.message}`);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Histórico de Consultas</Typography>
        <Box>
          {" "}
          {/* Container para os botões */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setConsultaModalOpen(true)}
            sx={{ mr: 1 }} // Adiciona margem direita para espaçamento
          >
            Nova Consulta
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCarregarExemplos}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Carregar Exemplos"}
          </Button>
        </Box>
      </Box>

      <ConsultaFormModal
        open={consultaModalOpen}
        onClose={() => setConsultaModalOpen(false)}
        onSave={handleAddConsulta}
      />
      {!prontuario.consultas || prontuario.consultas.length === 0 ? (
        <Alert severity="info">Não há consultas registradas para este paciente.</Alert>
      ) : (
        <List>
          {prontuario.consultas.map((consulta) => {
            const isExpanded = expandedItem === consulta.id;

            // Formatar data para exibição
            let dataFormatada, horaFormatada;
            try {
              // Verifica se consulta.data é uma string ou objeto Date
              const dataConsulta =
                typeof consulta.data === "string" ? new Date(consulta.data) : consulta.data;

              dataFormatada = dataConsulta.toLocaleDateString("pt-BR");
              horaFormatada = dataConsulta.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              });
            } catch (error) {
              console.error("Erro ao formatar data:", error);
              dataFormatada = consulta.data || "Data não disponível";
              horaFormatada = "";
            }

            return (
              <Paper
                key={consulta.id}
                elevation={1}
                sx={{ mb: 2, borderLeft: 4, borderColor: "primary.main" }}
              >
                <ListItem
                  button
                  onClick={() => handleExpandClick(consulta.id)}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <MedicalServicesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {consulta.medico || consulta.medicoNome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dataFormatada} {horaFormatada ? `às ${horaFormatada}` : ""}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.primary" component="span">
                          {consulta.especialidade} - {consulta.motivoConsulta || consulta.tipo}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {consulta.hipoteseDiagnostica || consulta.diagnostico || ""}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Queixa Principal
                        </Typography>
                        <Typography variant="body2">{consulta.descricaoQueixa}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Sinais Vitais
                        </Typography>
                        <Grid container spacing={1}>
                          {consulta.sinaisVitais ? (
                            <>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" display="block">
                                  Pressão Arterial
                                </Typography>
                                <Typography variant="body2">
                                  {consulta.sinaisVitais.pressaoArterialSistolica || "-"}/
                                  {consulta.sinaisVitais.pressaoArterialDiastolica || "-"} mmHg
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" display="block">
                                  Freq. Cardíaca
                                </Typography>
                                <Typography variant="body2">
                                  {consulta.sinaisVitais.frequenciaCardiaca || "-"} bpm
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" display="block">
                                  Temperatura
                                </Typography>
                                <Typography variant="body2">
                                  {consulta.sinaisVitais.temperatura || "-"} °C
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" display="block">
                                  SatO2
                                </Typography>
                                <Typography variant="body2">
                                  {consulta.sinaisVitais.saturacaoOxigenio || "-"}%
                                </Typography>
                              </Grid>
                            </>
                          ) : (
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Sinais vitais não registrados
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Hipótese Diagnóstica
                        </Typography>
                        <Typography variant="body2">{consulta.hipoteseDiagnostica}</Typography>
                      </Grid>

                      {consulta.diagnosticoDefinitivo && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Diagnóstico Definitivo
                          </Typography>
                          <Typography variant="body2">{consulta.diagnosticoDefinitivo}</Typography>
                        </Grid>
                      )}

                      {consulta.codigosCID && consulta.codigosCID.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            CID
                          </Typography>
                          <Box display="flex" gap={1}>
                            {consulta.codigosCID.map((cid, index) => (
                              <Chip key={index} label={cid} size="small" />
                            ))}
                          </Box>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Conduta
                        </Typography>
                        <Typography variant="body2">{consulta.conduta}</Typography>
                      </Grid>

                      {consulta.prescricoes && consulta.prescricoes.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Prescrições
                          </Typography>
                          <List dense disablePadding>
                            {consulta.prescricoes.map((prescricao, index) => (
                              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                  <MedicalServicesIcon fontSize="small" color="primary" />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={`${prescricao.medicamento} ${prescricao.concentracao}`}
                                  secondary={prescricao.posologia}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}

                      {consulta.examesSolicitados && consulta.examesSolicitados.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Exames Solicitados
                          </Typography>
                          <List dense disablePadding>
                            {consulta.examesSolicitados.map((exame, index) => (
                              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                  <ScienceIcon fontSize="small" color="primary" />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={exame.exame}
                                  secondary={exame.justificativa}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}

                      {consulta.observacoes && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Observações
                          </Typography>
                          <Typography variant="body2">{consulta.observacoes}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Collapse>
              </Paper>
            );
          })}
        </List>
      )}
    </Box>
  );
};

HistoricoMedico.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir medicamentos do paciente
const Medicamentos = ({ prontuario }) => {
  const { carregarMedicamentosExemplo, loading } = useProntuario();

  const handleCarregarExemplos = async () => {
    try {
      await carregarMedicamentosExemplo();
      alert("Medicamentos de exemplo carregados com sucesso!");
    } catch (error) {
      alert(`Erro ao carregar medicamentos: ${error.message}`);
    }
  };

  // Função para formatar a data de forma segura
  const formatarData = (dataOriginal) => {
    try {
      // Verificar se já é um objeto Date
      if (dataOriginal instanceof Date) {
        return dataOriginal.toLocaleDateString("pt-BR");
      }
      // Se for string, converter para Date
      else if (typeof dataOriginal === "string") {
        return new Date(dataOriginal).toLocaleDateString("pt-BR");
      }
      // Caso não seja possível converter
      return "Data não disponível";
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data não disponível";
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Medicamentos em Uso</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCarregarExemplos}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar Exemplos"}
        </Button>
      </Box>
      {prontuario.medicamentos.length === 0 ? (
        <Alert severity="info">Não há medicamentos registrados para este paciente.</Alert>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {prontuario.medicamentos.map((medicamento) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={medicamento.id} style={{ display: "flex" }}>
                <Paper
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: medicamento.continuo ? "success.main" : "primary.main",
                    bgcolor: medicamento.continuo ? "success.lighter" : "primary.lighter",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 3
                    }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {medicamento.nome}
                    </Typography>
                    <Chip
                      label={medicamento.continuo ? "Contínuo" : "Temporário"}
                      size="small"
                      color={medicamento.continuo ? "success" : "primary"}
                    />
                  </Box>
                  <Typography variant="caption" display="block">
                    {medicamento.principioAtivo} - {medicamento.concentracao}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Posologia:</strong> {medicamento.posologia}
                  </Typography>
                  {medicamento.formaFarmaceutica && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <strong>Forma:</strong> {medicamento.formaFarmaceutica}
                    </Typography>
                  )}
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Início: {formatarData(medicamento.dataInicio)}
                    {!medicamento.continuo && medicamento.dataFim && (
                      <span> • Término: {formatarData(medicamento.dataFim)}</span>
                    )}
                  </Typography>
                  {medicamento.observacoes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Observações:</strong> {medicamento.observacoes}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

Medicamentos.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir alergias e precauções
const AlergiasEPrecaucoes = ({ prontuario }) => {
  const { carregarAlergiasExemplo, loading } = useProntuario();

  const handleCarregarExemplos = async () => {
    try {
      await carregarAlergiasExemplo();
      alert("Alergias de exemplo carregadas com sucesso!");
    } catch (error) {
      alert(`Erro ao carregar alergias: ${error.message}`);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Alergias</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCarregarExemplos}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar Exemplos"}
        </Button>
      </Box>
      {prontuario.alergias.length === 0 ? (
        <Alert severity="info">Não há alergias registradas para este paciente.</Alert>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {prontuario.alergias.map((alergia, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} style={{ display: "flex" }}>
              <Paper
                sx={{
                  p: 2,
                  border: 1,
                  borderColor:
                    alergia.gravidade === "Grave"
                      ? "error.main"
                      : alergia.gravidade === "Moderada"
                        ? "warning.main"
                        : "info.main",
                  bgcolor:
                    alergia.gravidade === "Grave"
                      ? "error.lighter"
                      : alergia.gravidade === "Moderada"
                        ? "warning.lighter"
                        : "info.lighter",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 3
                  }
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {alergia.agente}
                  </Typography>
                  <Chip
                    label={alergia.gravidade}
                    size="small"
                    color={
                      alergia.gravidade === "Grave"
                        ? "error"
                        : alergia.gravidade === "Moderada"
                          ? "warning"
                          : "info"
                    }
                  />
                </Box>
                <Typography variant="caption" display="block">
                  {alergia.tipo}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Reação:</strong> {alergia.reacao}
                </Typography>
                {alergia.observacoes && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <strong>Observações:</strong> {alergia.observacoes}
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Identificada em:{" "}
                  {alergia.dataIdentificacao
                    ? new Date(alergia.dataIdentificacao).toLocaleDateString("pt-BR")
                    : "Data não informada"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

AlergiasEPrecaucoes.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir cirurgias
const Cirurgias = ({ prontuario }) => {
  const { carregarCirurgiasExemplo, loading } = useProntuario();

  const handleCarregarExemplos = async () => {
    try {
      await carregarCirurgiasExemplo();
      alert("Cirurgias de exemplo carregadas com sucesso!");
    } catch (error) {
      alert(`Erro ao carregar cirurgias: ${error.message}`);
    }
  };

  // Função para formatar a data de forma segura
  const formatarData = (dataOriginal) => {
    try {
      // Verificar se já é um objeto Date
      if (dataOriginal instanceof Date) {
        return dataOriginal.toLocaleDateString("pt-BR");
      }
      // Se for string, converter para Date
      else if (typeof dataOriginal === "string") {
        return new Date(dataOriginal).toLocaleDateString("pt-BR");
      }
      // Caso não seja possível converter
      return "Data não disponível";
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data não disponível";
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Histórico de Cirurgias
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCarregarExemplos}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar Exemplos"}
        </Button>
      </Box>
      {prontuario.cirurgias.length === 0 ? (
        <Alert severity="info">Não há cirurgias registradas para este paciente.</Alert>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {prontuario.cirurgias.map((cirurgia, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} style={{ display: "flex" }}>
              <Paper
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "secondary.main",
                  bgcolor: "secondary.lighter",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 3
                  }
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cirurgia.tipo}
                  </Typography>
                  <Chip
                    label={formatarData(cirurgia.data)}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" display="block">
                  {cirurgia.hospital}
                </Typography>
                {cirurgia.descricao && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Descrição:</strong> {cirurgia.descricao}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Médico:</strong> {cirurgia.medicoResponsavel}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Resultado:</strong> {cirurgia.resultado}
                </Typography>
                {cirurgia.complicacoes && cirurgia.complicacoes !== "Nenhuma" && (
                  <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                    <strong>Complicações:</strong> {cirurgia.complicacoes}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

Cirurgias.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir histórico familiar
const HistoricoFamiliar = ({ prontuario }) => {
  const { carregarHistoricoFamiliarExemplo, loading } = useProntuario();

  const handleCarregarExemplos = async () => {
    try {
      await carregarHistoricoFamiliarExemplo();
      alert("Histórico familiar de exemplo carregado com sucesso!");
    } catch (error) {
      alert(`Erro ao carregar histórico familiar: ${error.message}`);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Histórico Familiar
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCarregarExemplos}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar Exemplos"}
        </Button>
      </Box>
      {prontuario.historicoFamiliar.doencas.length === 0 ? (
        <Alert severity="info">Não há doenças familiares registradas para este paciente.</Alert>
      ) : (
        <React.Fragment>
          <Grid container spacing={2} alignItems="stretch">
            {prontuario.historicoFamiliar.doencas.map((doenca, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} style={{ display: "flex" }}>
                <Paper
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "info.main",
                    bgcolor: "info.lighter",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 3
                    }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {doenca.doenca}
                    </Typography>
                    <Chip label={doenca.parentesco} size="small" color="info" />
                  </Box>
                  {doenca.observacoes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Observações:</strong> {doenca.observacoes}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {prontuario.historicoFamiliar.observacoes && (
            <Paper
              sx={{
                mt: 3,
                p: 2,
                border: 1,
                borderColor: "info.main",
                bgcolor: "info.lighter",
                transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: 3
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Observações Gerais
              </Typography>
              <Typography variant="body2">{prontuario.historicoFamiliar.observacoes}</Typography>
            </Paper>
          )}
        </React.Fragment>
      )}
    </Box>
  );
};

HistoricoFamiliar.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir anexos
const Anexos = ({ prontuario }) => {
  const { carregarAnexosExemplo, loading } = useProntuario();

  const handleCarregarExemplos = async () => {
    try {
      await carregarAnexosExemplo();
      alert("Anexos de exemplo carregados com sucesso!");
    } catch (error) {
      alert(`Erro ao carregar anexos: ${error.message}`);
    }
  };

  // Função para formatar a data de forma segura
  const formatarData = (dataOriginal) => {
    try {
      // Verificar se já é um objeto Date
      if (dataOriginal instanceof Date) {
        return dataOriginal.toLocaleDateString("pt-BR");
      }
      // Se for string, converter para Date
      else if (typeof dataOriginal === "string") {
        return new Date(dataOriginal).toLocaleDateString("pt-BR");
      }
      // Caso não seja possível converter
      return "Data não disponível";
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data não disponível";
    }
  };

  // Função para obter o ícone baseado no tipo de documento
  const getIconByFileType = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "exame":
        return <ScienceIcon />;
      case "receita":
        return <MedicalServicesIcon />;
      case "laudo":
        return <ReportIcon />;
      default:
        return <DocumentScannerIcon />;
    }
  };

  // Função para obter a cor de acordo com o tipo de documento
  const getColorByFileType = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "exame":
        return "primary";
      case "receita":
        return "success";
      case "laudo":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Documentos e Anexos
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCarregarExemplos}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar Exemplos"}
        </Button>
      </Box>
      {prontuario.anexos.length === 0 ? (
        <Alert severity="info">Não há anexos disponíveis para este paciente.</Alert>
      ) : (
        <Grid container spacing={2} alignItems="stretch" sx={{ alignContent: "flex-start" }}>
          {prontuario.anexos.map((anexo) => {
            const color = getColorByFileType(anexo.categoria);
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={anexo.id}
                style={{ display: "flex", height: "100%" }}
              >
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    border: 1,
                    borderColor: `${color}.main`,
                    bgcolor: `${color}.lighter`,
                    width: "100%",
                    height: "100%",
                    minHeight: "160px",
                    transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 3
                    }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" alignItems="center" overflow="hidden" flex={1} mr={1}>
                      <Avatar
                        sx={{
                          bgcolor: `${color}.main`,
                          mr: 1.5,
                          width: 32,
                          height: 32,
                          flexShrink: 0
                        }}
                      >
                        {getIconByFileType(anexo.categoria)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          noWrap
                          title={anexo.nome}
                          sx={{ lineHeight: 1.2 }}
                        >
                          {`Arquivo ${anexo.categoria}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={anexo.categoria}
                      size="small"
                      color={color}
                      sx={{ flexShrink: 0 }}
                    />
                  </Box>

                  <Box sx={{ mt: 1.5, flex: 1, minHeight: 0 }}>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}
                      title={anexo.descricao}
                    >
                      {anexo.descricao}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt="auto"
                    pt={1.5}
                    borderTop={1}
                    borderColor="divider"
                  >
                    <Box display="flex" alignItems="center">
                      <EventIcon
                        fontSize="small"
                        sx={{ color: "text.secondary", fontSize: 16, mr: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatarData(anexo.dataUpload)}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      color={color}
                      variant="outlined"
                      startIcon={<ReceiptLongIcon fontSize="small" />}
                      sx={{ height: 28, fontSize: "0.75rem" }}
                    >
                      Visualizar
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

Anexos.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente principal do Prontuário Eletrônico
const ProntuarioDetails = ({ prontuario }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!prontuario) {
    return <Alert severity="warning">Prontuário não encontrado</Alert>;
  }

  console.log("ProntuarioDetails - prontuario:", prontuario);
  console.log("ProntuarioDetails - prontuario.dataCriacao:", prontuario.dataCriacao);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider"
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              {prontuario.nomePaciente.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">{prontuario.nomePaciente}</Typography>
              <Typography variant="body2" color="text.secondary">
                {prontuario.sexo === "M"
                  ? "Masculino"
                  : prontuario.sexo === "F"
                    ? "Feminino"
                    : "Outro"}{" "}
                • {prontuario.dataNascimento} •{" "}
                {prontuario.dadosPessoais.tipoSanguineo || "Tipo sanguíneo não informado"}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Tooltip title="Data de criação do prontuário">
              <Box display="flex" alignItems="center" mr={2}>
                <EventIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Criado em: {new Date(prontuario.dataCriacao).toLocaleDateString("pt-BR")}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Última atualização">
              <Box display="flex" alignItems="center">
                <AccessTimeIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Atualizado em:{" "}
                  {new Date(prontuario.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "error.lighter",
            p: 1,
            borderRadius: 1,
            mb: 2
          }}
        >
          <SecurityUpdateWarningIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="body2" color="error">
            <strong>Alerta de Alergias:</strong>{" "}
            {prontuario.alergias && prontuario.alergias.length > 0
              ? prontuario.alergias
                  .map(
                    (a) =>
                      `${a.agente || "Não especificado"}${
                        a.gravidade ? ` (${a.gravidade})` : ""
                      } - ${a.reacao || "Reação não especificada"}`
                  )
                  .join(", ")
              : "Nenhuma alergia registrada"}
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Abas do prontuário"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<HealingIcon />} label="Dados Pessoais" />
          <Tab icon={<MedicalServicesIcon />} label="Histórico" />
          <Tab icon={<LocalHospitalIcon />} label="Medicamentos" />
          <Tab icon={<SecurityUpdateWarningIcon />} label="Alergias" />
          <Tab icon={<ReportIcon />} label="Cirurgias" />
          <Tab icon={<ScienceIcon />} label="Hist. Familiar" />
          <Tab icon={<DocumentScannerIcon />} label="Anexos" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <DadosPessoais paciente={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <HistoricoMedico prontuario={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Medicamentos prontuario={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AlergiasEPrecaucoes prontuario={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <Cirurgias prontuario={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <HistoricoFamiliar prontuario={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        <Anexos prontuario={prontuario} />
      </TabPanel>
    </Box>
  );
};

ProntuarioDetails.propTypes = {
  prontuario: PropTypes.object.isRequired
};

export default ProntuarioDetails;
