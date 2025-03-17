import {
  AccessTime as AccessTimeIcon,
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
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
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
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informações Pessoais
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nome Completo
            </Typography>
            <Typography variant="body1">{paciente.nomePaciente}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              CPF
            </Typography>
            <Typography variant="body1">{paciente.cpf}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data de Nascimento
            </Typography>
            <Typography variant="body1">{paciente.dataNascimento}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Sexo
            </Typography>
            <Typography variant="body1">{paciente.sexo}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Estado Civil
            </Typography>
            <Typography variant="body1">{paciente.dadosPessoais.estadoCivil}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Profissão
            </Typography>
            <Typography variant="body1">{paciente.dadosPessoais.profissao}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Endereço
            </Typography>
            <Typography variant="body1">{paciente.dadosPessoais.endereco}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo Sanguíneo
            </Typography>
            <Typography variant="body1">{paciente.dadosPessoais.tipoSanguineo}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Convênio
            </Typography>
            <Typography variant="body1">
              {paciente.dadosPessoais.convenio}
              {paciente.dadosPessoais.numeroConvenio
                ? ` - ${paciente.dadosPessoais.numeroConvenio}`
                : ""}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Contatos
        </Typography>
        <List>
          {paciente.contatos.map((contato, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={contato.valor}
                secondary={contato.tipo}
                primaryTypographyProps={{ fontWeight: contato.principal ? "bold" : "normal" }}
              />
              {contato.principal && (
                <ListItemSecondaryAction>
                  <Chip label="Principal" size="small" color="primary" />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

DadosPessoais.propTypes = {
  paciente: PropTypes.object.isRequired
};

// Componente para exibir histórico médico do paciente
const HistoricoMedico = ({ prontuario }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleExpandClick = (consultaId) => {
    setExpandedItem(expandedItem === consultaId ? null : consultaId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Consultas
      </Typography>
      {prontuario.consultas.length === 0 ? (
        <Alert severity="info">Não há consultas registradas para este paciente.</Alert>
      ) : (
        <List>
          {prontuario.consultas.map((consulta) => {
            const isExpanded = expandedItem === consulta.id;

            // Formatar data para exibição
            const dataFormatada = consulta.data.toLocaleDateString("pt-BR");
            const horaFormatada = consulta.data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit"
            });

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
                        <Typography variant="subtitle1">{consulta.medicoNome}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dataFormatada} às {horaFormatada}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.primary" component="span">
                          {consulta.especialidade} - {consulta.motivoConsulta}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {consulta.hipoteseDiagnostica}
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
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" display="block">
                              Pressão Arterial
                            </Typography>
                            <Typography variant="body2">
                              {consulta.sinaisVitais.pressaoArterialSistolica}/
                              {consulta.sinaisVitais.pressaoArterialDiastolica} mmHg
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" display="block">
                              Freq. Cardíaca
                            </Typography>
                            <Typography variant="body2">
                              {consulta.sinaisVitais.frequenciaCardiaca} bpm
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" display="block">
                              Temperatura
                            </Typography>
                            <Typography variant="body2">
                              {consulta.sinaisVitais.temperatura} °C
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" display="block">
                              SatO2
                            </Typography>
                            <Typography variant="body2">
                              {consulta.sinaisVitais.saturacaoOxigenio}%
                            </Typography>
                          </Grid>
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

                      {consulta.codigosCID.length > 0 && (
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

                      {consulta.prescricoes.length > 0 && (
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

                      {consulta.examesSolicitados.length > 0 && (
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
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Medicamentos em Uso
      </Typography>
      {prontuario.medicamentos.length === 0 ? (
        <Alert severity="info">Não há medicamentos registrados para este paciente.</Alert>
      ) : (
        <Grid container spacing={2}>
          {prontuario.medicamentos.map((medicamento) => (
            <Grid item xs={12} md={6} key={medicamento.id}>
              <Card sx={{ display: "flex", height: "100%" }}>
                <Box
                  sx={{
                    width: 8,
                    bgcolor: medicamento.continuo ? "success.main" : "primary.main"
                  }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">{medicamento.nome}</Typography>
                    <Chip
                      label={medicamento.continuo ? "Contínuo" : "Temporário"}
                      size="small"
                      color={medicamento.continuo ? "success" : "primary"}
                    />
                  </Box>
                  <Typography color="text.secondary" variant="subtitle2">
                    {medicamento.principioAtivo} - {medicamento.concentracao}
                  </Typography>
                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    <strong>Posologia:</strong> {medicamento.posologia}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Forma:</strong> {medicamento.formaFarmaceutica}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block">
                      <strong>Início:</strong> {medicamento.dataInicio.toLocaleDateString("pt-BR")}
                    </Typography>
                    {!medicamento.continuo && medicamento.dataFim && (
                      <Typography variant="caption" display="block">
                        <strong>Término:</strong> {medicamento.dataFim.toLocaleDateString("pt-BR")}
                      </Typography>
                    )}
                  </Box>
                  {medicamento.observacoes && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      <strong>Obs:</strong> {medicamento.observacoes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
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
  return (
    <Box>
      <Typography variant="h6" gutterBottom color="error">
        Alergias e Reações Adversas
      </Typography>
      {prontuario.alergias.length === 0 ? (
        <Alert severity="info">Não há alergias registradas para este paciente.</Alert>
      ) : (
        <Grid container spacing={2}>
          {prontuario.alergias.map((alergia, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                        : "info.lighter"
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
                  Identificada em: {alergia.dataIdentificacao.toLocaleDateString("pt-BR")}
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
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Cirurgias
      </Typography>
      {prontuario.cirurgias.length === 0 ? (
        <Alert severity="info">Não há cirurgias registradas para este paciente.</Alert>
      ) : (
        <List>
          {prontuario.cirurgias.map((cirurgia, index) => (
            <Paper elevation={1} sx={{ mb: 2 }} key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <LocalHospitalIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle1">{cirurgia.tipo}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cirurgia.data.toLocaleDateString("pt-BR")}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.primary">
                        {cirurgia.descricao}
                      </Typography>
                      <Typography variant="caption" display="block">
                        <strong>Hospital:</strong> {cirurgia.hospital}
                      </Typography>
                      <Typography variant="caption" display="block">
                        <strong>Médico:</strong> {cirurgia.medicoResponsavel}
                      </Typography>
                      <Typography variant="caption" display="block">
                        <strong>Resultado:</strong> {cirurgia.resultado}
                      </Typography>
                      {cirurgia.complicacoes && cirurgia.complicacoes !== "Nenhuma" && (
                        <Typography variant="caption" display="block" color="error">
                          <strong>Complicações:</strong> {cirurgia.complicacoes}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

Cirurgias.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir histórico familiar
const HistoricoFamiliar = ({ prontuario }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico Familiar
      </Typography>
      {prontuario.historicoFamiliar.doencas.length === 0 ? (
        <Alert severity="info">Não há doenças familiares registradas para este paciente.</Alert>
      ) : (
        <React.Fragment>
          <List>
            {prontuario.historicoFamiliar.doencas.map((doenca, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "info.light" }}>
                    <HealingIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={doenca.doenca}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.primary">
                        Parentesco: {doenca.parentesco}
                      </Typography>
                      {doenca.observacoes && (
                        <Typography variant="caption" display="block">
                          {doenca.observacoes}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
          {prontuario.historicoFamiliar.observacoes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Observações Gerais:</Typography>
              <Typography variant="body2">{prontuario.historicoFamiliar.observacoes}</Typography>
            </Box>
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
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Documentos e Anexos
      </Typography>
      {prontuario.anexos.length === 0 ? (
        <Alert severity="info">Não há anexos disponíveis para este paciente.</Alert>
      ) : (
        <Grid container spacing={2}>
          {prontuario.anexos.map((anexo) => (
            <Grid item xs={12} sm={6} md={4} key={anexo.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <DocumentScannerIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">{anexo.nome}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {anexo.descricao}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip label={anexo.categoria} size="small" />
                    <Typography variant="caption">
                      {anexo.dataUpload.toLocaleDateString("pt-BR")}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <IconButton size="small" color="primary">
                      <Tooltip title="Visualizar documento">
                        <ReceiptLongIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
                  Criado em: {prontuario.dataCriacao.toLocaleDateString("pt-BR")}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Última atualização">
              <Box display="flex" alignItems="center">
                <AccessTimeIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Atualizado em: {prontuario.ultimaAtualizacao.toLocaleDateString("pt-BR")}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {prontuario.alergias.length > 0 && (
          <Box
            sx={{
              bgcolor: "error.lighter",
              p: 1,
              display: "flex",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider"
            }}
          >
            <SecurityUpdateWarningIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body2" color="error">
              <strong>Alerta de Alergias:</strong>{" "}
              {prontuario.alergias
                .map((a) => a.agente + (a.gravidade === "Grave" ? " (Grave)" : ""))
                .join(", ")}
            </Typography>
          </Box>
        )}

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
