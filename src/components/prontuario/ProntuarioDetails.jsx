import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  DocumentScanner as DocumentScannerIcon,
  Download as DownloadIcon,
  Event as EventIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Healing as HealingIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  Report as ReportIcon,
  Science as ScienceIcon,
  SecurityUpdateWarning as SecurityUpdateWarningIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
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
import AlergiaFormModal from "./AlergiaFormModal";
import CirurgiaFormModal from "./CirurgiaFormModal";
import ConsultaFormModal from "./ConsultaFormModal";
import HistoricoFamiliarFormModal from "./HistoricoFamiliarFormModal";
import MedicamentoFormModal from "./MedicamentoFormModal";

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
          transition: "box-shadow 0.1s ease-in-out",
          "&:hover": {
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
          transition: "box-shadow 0.1s ease-in-out",
          "&:hover": {
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
  const { loading } = useProntuario();
  // Limita o número de consultas a exibir de uma vez para evitar sobrecarga
  const maxItensRenderizados = 20;

  const handleExpandClick = (consultaId) => {
    setExpandedItem(expandedItem === consultaId ? null : consultaId);
  };

  const handleAddConsulta = (novaConsulta) => {
    // Aqui você deve implementar a lógica para adicionar a consulta ao prontuário
    // Por enquanto, vamos apenas simular a adição
    console.log("Nova consulta:", novaConsulta);
  };

  // Verificação de segurança para garantir que consultas seja um array
  const consultas = Array.isArray(prontuario.consultas) ? prontuario.consultas : [];
  // Limitar o número de consultas a exibir
  const consultasLimitadas = consultas.slice(0, maxItensRenderizados);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Histórico de Consultas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setConsultaModalOpen(true)}
        >
          Nova Consulta
        </Button>
      </Box>

      <ConsultaFormModal
        open={consultaModalOpen}
        onClose={() => setConsultaModalOpen(false)}
        onSave={handleAddConsulta}
      />
      {consultas.length === 0 ? (
        <Alert severity="info">Não há consultas registradas para este paciente.</Alert>
      ) : (
        <>
          <List>
            {consultasLimitadas.map((consulta) => {
              if (!consulta) return null; // Proteção contra consultas nulas

              const isExpanded = expandedItem === consulta.id;
              const consultaId = consulta.id || `consulta-${Math.random()}`;

              // Formatar data para exibição
              let dataFormatada, horaFormatada;
              try {
                // Verifica se consulta.data é uma string ou objeto Date
                const dataConsulta =
                  typeof consulta.data === "string" ? new Date(consulta.data) : consulta.data;

                if (isNaN(dataConsulta?.getTime())) {
                  dataFormatada = "Data inválida";
                  horaFormatada = "";
                } else {
                  dataFormatada = dataConsulta.toLocaleDateString("pt-BR");
                  horaFormatada = dataConsulta.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  });
                }
              } catch (error) {
                console.error("Erro ao formatar data:", error);
                dataFormatada = consulta.data || "Data não disponível";
                horaFormatada = "";
              }

              return (
                <Paper
                  key={consultaId}
                  elevation={1}
                  sx={{ 
                    mb: 2, 
                    borderLeft: 4, 
                    borderColor: "primary.main",
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: isExpanded ? 'background.paper' : 'inherit',
                    '&:hover': {
                      backgroundColor: isExpanded ? 'background.paper' : 'rgba(0, 0, 0, 0.02)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ 
                        bgcolor: 'primary.light', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 45,
                        height: 45
                      }}>
                        <MedicalServicesIcon />
                      </Avatar>
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold" component="div">
                          {consulta.medicoNome || consulta.medico || "Não informado"}
                          {consulta.medicoCRM && ` (CRM: ${consulta.medicoCRM})`}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium" 
                            sx={{
                              color: 'primary.main',
                              display: 'inline-block',
                              mr: 1,
                              borderRadius: '4px',
                              px: 1,
                              py: 0.5,
                              bgcolor: 'primary.50'
                            }}
                          >
                            {consulta.diagnosticoDefinitivo || consulta.hipoteseDiagnostica || consulta.diagnostico || "Diagnóstico não informado"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dataFormatada}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    subheader={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" component="div" sx={{ flexShrink: 0, mr: 1 }}>
                            {consulta.especialidade || "Especialidade não informada"}
                          </Typography>
                          <Box sx={{ mx: 0.5, bgcolor: 'divider', width: '4px', height: '4px', borderRadius: '50%' }} />
                          <Typography variant="body2" color="text.secondary" component="div">
                            {consulta.motivoConsulta || consulta.tipo || "Consulta"}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton onClick={() => handleExpandClick(consultaId)}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                    sx={{ 
                      pb: 0, 
                      cursor: 'pointer',
                      py: 1,
                      display: 'flex',
                      alignItems: 'center',
                      '& .MuiCardHeader-avatar': {
                        marginY: 'auto',
                        marginRight: 2
                      },
                      '& .MuiCardHeader-content': {
                        marginY: 'auto'
                      },
                      '& .MuiCardHeader-action': {
                        marginY: 'auto',
                        alignSelf: 'center'
                      }
                    }}
                    onClick={() => handleExpandClick(consultaId)}
                  />
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{ pt: 1 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        {/* Lado esquerdo: Informações clínicas */}
                        <Grid item xs={12} md={7}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                <Grid container spacing={1}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                      Queixa Principal
                                    </Typography>
                                    <Typography variant="body2" sx={{ pl: 1 }}>
                                      {consulta.descricaoQueixa || (consulta.historico && consulta.historico.queixaPrincipal) || "Não informada"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} sx={{ 
                                    display: 'flex', 
                                    position: 'relative',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      left: { xs: 0, sm: -8 },
                                      top: 0,
                                      height: '100%',
                                      width: '1px',
                                      backgroundColor: 'divider',
                                      display: { xs: 'none', sm: 'block' }
                                    }
                                  }}>
                                    <Box sx={{ width: '100%' }}>
                                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Diagnóstico
                                      </Typography>
                                      <Box sx={{ pl: 1 }}>
                                        <Typography variant="body2" sx={{ display: 'flex' }}>
                                          <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '75px' }}>Hipótese:</Typography>
                                          <Typography component="span" variant="body2">{consulta.hipoteseDiagnostica || consulta.diagnostico || "Não informada"}</Typography>
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', mt: 0.5 }}>
                                          <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '75px' }}>Definitivo:</Typography>
                                          <Typography component="span" variant="body2">{consulta.diagnosticoDefinitivo || "Não informado"}</Typography>
                                        </Typography>
                                        {consulta.codigosCID && consulta.codigosCID.length > 0 && (
                                          <Box display="flex" gap={0.5} mt={0.5} alignItems="center">
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '75px' }}>CID:</Typography>
                                            <Box>
                                              {consulta.codigosCID.map((cid, index) => (
                                                <Chip key={index} label={cid} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                              ))}
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Grid>

                            <Grid item xs={12}>
                              <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Conduta e Observações
                                </Typography>
                                <Box sx={{ pl: 1 }}>
                                  {consulta.conduta && (
                                    <Typography variant="body2" sx={{ display: 'flex', mb: 1 }}>
                                      <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '95px' }}>Conduta:</Typography>
                                      <Typography component="span" variant="body2">{consulta.conduta}</Typography>
                                    </Typography>
                                  )}
                                  {consulta.observacoes && (
                                    <Typography variant="body2" sx={{ display: 'flex', mb: 1 }}>
                                      <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '95px' }}>Observações:</Typography>
                                      <Typography component="span" variant="body2">{consulta.observacoes}</Typography>
                                    </Typography>
                                  )}
                                  {consulta.historico && consulta.historico.planoCuidados && (
                                    <Typography variant="body2" sx={{ display: 'flex', mb: 1 }}>
                                      <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '95px' }}>Plano:</Typography>
                                      <Typography component="span" variant="body2">{consulta.historico.planoCuidados}</Typography>
                                    </Typography>
                                  )}
                                </Box>
                              </Paper>
                            </Grid>

                            <Grid item xs={12}>
                              <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Sinais Vitais
                                </Typography>
                                {consulta.sinaisVitais ? (
                                  <Box sx={{ pl: 1 }}>
                                    <Grid container spacing={0.5}>
                                      <Grid item xs={12} sm={6}>
                                        {consulta.sinaisVitais.pressaoArterialSistolica && consulta.sinaisVitais.pressaoArterialDiastolica && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Pressão Arterial:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.pressaoArterialSistolica}/{consulta.sinaisVitais.pressaoArterialDiastolica} mmHg</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.pressaoArterial && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Pressão Arterial:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.pressaoArterial}</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.frequenciaCardiaca && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>FC:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.frequenciaCardiaca} {!consulta.sinaisVitais.frequenciaCardiaca.includes('bpm') && 'bpm'}</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.frequenciaRespiratoria && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>FR:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.frequenciaRespiratoria} irpm</Typography>
                                          </Typography>
                                        )}
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        {consulta.sinaisVitais.temperatura && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Temperatura:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.temperatura} {!consulta.sinaisVitais.temperatura.includes('°C') && '°C'}</Typography>
                                          </Typography>
                                        )}
                                        {(consulta.sinaisVitais.saturacaoOxigenio || consulta.sinaisVitais.saturacaoO2) && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Sat. O2:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.saturacaoOxigenio || consulta.sinaisVitais.saturacaoO2} {!(consulta.sinaisVitais.saturacaoOxigenio || '').includes('%') && !(consulta.sinaisVitais.saturacaoO2 || '').includes('%') && '%'}</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.peso && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Peso:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.peso} {!consulta.sinaisVitais.peso.includes('kg') && 'kg'}</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.altura && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Altura:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.altura} {consulta.sinaisVitais.altura.includes('m') ? '' : consulta.sinaisVitais.altura.includes('cm') ? '' : 'cm'}</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.imc && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>IMC:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.imc}</Typography>
                                          </Typography>
                                        )}
                                        {consulta.sinaisVitais.glicemia && (
                                          <Typography variant="body2" sx={{ display: 'flex', mb: 0.75 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '105px' }}>Glicemia:</Typography>
                                            <Typography component="span" variant="body2">{consulta.sinaisVitais.glicemia} mg/dL</Typography>
                                          </Typography>
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                                    Sinais vitais não registrados
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>

                            {consulta.historico && consulta.historico.historicoConsulta && (
                              <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Histórico da Consulta
                                  </Typography>
                                  <Typography variant="body2">
                                    {consulta.historico.historicoConsulta}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}

                            {consulta.historico && consulta.historico.exameFisico && (
                              <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Exame Físico
                                  </Typography>
                                  <Typography variant="body2">
                                    {consulta.historico.exameFisico}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>

                        {/* Lado direito: Sinais vitais, prescrições e exames */}
                        <Grid item xs={12} md={5}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Prescrições
                                </Typography>
                                {consulta.prescricoes && consulta.prescricoes.length > 0 ? (
                                  <Box sx={{ pl: 1 }}>
                                    {consulta.prescricoes.map((prescricao, index) => (
                                      <Box key={index} sx={{ mb: index !== consulta.prescricoes.length - 1 ? 1.5 : 0 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          {prescricao.medicamento} {prescricao.concentracao}
                                        </Typography>
                                        <Box sx={{ pl: 1.5 }}>
                                          <Typography variant="body2" sx={{ display: 'flex', mt: 0.5 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '85px' }}>Posologia:</Typography>
                                            <Typography component="span" variant="body2">{prescricao.posologia}</Typography>
                                          </Typography>
                                          {prescricao.duracao && (
                                            <Typography variant="body2" sx={{ display: 'flex', mt: 0.5 }}>
                                              <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '85px' }}>Duração:</Typography>
                                              <Typography component="span" variant="body2">{prescricao.duracao}</Typography>
                                            </Typography>
                                          )}
                                        </Box>
                                        {index !== consulta.prescricoes.length - 1 && <Divider sx={{ my: 1 }} />}
                                      </Box>
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                                    Nenhuma prescrição registrada
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>

                            {consulta.examesSolicitados && consulta.examesSolicitados.length > 0 && (
                              <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Exames Solicitados
                                  </Typography>
                                  <Box sx={{ pl: 1, mt: 1 }}>
                                    {consulta.examesSolicitados.map((exame, index) => (
                                      <Box key={index} sx={{ mb: index !== consulta.examesSolicitados.length - 1 ? 1.5 : 0 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          {exame.exame}
                                        </Typography>
                                        {exame.justificativa && (
                                          <Typography variant="body2" sx={{ display: 'flex', mt: 0.5 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '95px' }}>Justificativa:</Typography>
                                            <Typography component="span" variant="body2">{exame.justificativa}</Typography>
                                          </Typography>
                                        )}
                                        {exame.preparos && (
                                          <Typography variant="body2" sx={{ display: 'flex', mt: 0.5 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', width: '95px' }}>Preparos:</Typography>
                                            <Typography component="span" variant="body2">{exame.preparos}</Typography>
                                          </Typography>
                                        )}
                                        {index !== consulta.examesSolicitados.length - 1 && <Divider sx={{ my: 1 }} />}
                                      </Box>
                                    ))}
                                  </Box>
                                </Paper>
                              </Grid>
                            )}

                            {((consulta.encaminhamentos && consulta.encaminhamentos.length > 0) || 
                              (consulta.historico && consulta.historico.encaminhamentos && consulta.historico.encaminhamentos.length > 0)) && (
                              <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Encaminhamentos
                                  </Typography>
                                  <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                                    {consulta.encaminhamentos && consulta.encaminhamentos.map((encaminhamento, index) => (
                                      <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                                        {encaminhamento}
                                      </Typography>
                                    ))}
                                    {consulta.historico && consulta.historico.encaminhamentos && consulta.historico.encaminhamentos.map((encaminhamento, index) => (
                                      <Typography component="li" variant="body2" key={`historico-${index}`} sx={{ mb: 0.5 }}>
                                        {encaminhamento}
                                      </Typography>
                                    ))}
                                  </Box>
                                </Paper>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Paper>
              );
            })}
          </List>
          {consultas.length > maxItensRenderizados && (
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Exibindo {maxItensRenderizados} de {consultas.length} consultas.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

HistoricoMedico.propTypes = {
  prontuario: PropTypes.object.isRequired
};

// Componente para exibir medicamentos do paciente
const Medicamentos = ({ prontuario }) => {
  const { loading, adicionarMedicamento } = useProntuario();
  const [openMedicamentoModal, setOpenMedicamentoModal] = useState(false);

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

  const handleOpenMedicamentoModal = () => {
    setOpenMedicamentoModal(true);
  };

  const handleCloseMedicamentoModal = () => {
    setOpenMedicamentoModal(false);
  };

  const handleSaveMedicamento = (medicamento) => {
    adicionarMedicamento(prontuario.id, medicamento);
    handleCloseMedicamentoModal();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Medicamentos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenMedicamentoModal}
        >
          Novo Medicamento
        </Button>
      </Box>
      <MedicamentoFormModal
        open={openMedicamentoModal}
        onClose={handleCloseMedicamentoModal}
        onSave={handleSaveMedicamento}
        prontuarioId={prontuario.id}
      />

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
                    transition: "box-shadow 0.1s ease-in-out",
                    "&:hover": {
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
  const { loading, adicionarAlergia } = useProntuario();
  const [openAlergiaModal, setOpenAlergiaModal] = useState(false);

  const handleOpenAlergiaModal = () => {
    setOpenAlergiaModal(true);
  };

  const handleCloseAlergiaModal = () => {
    setOpenAlergiaModal(false);
  };

  const handleSaveAlergia = (alergia) => {
    adicionarAlergia(alergia);
    handleCloseAlergiaModal();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Alergias e Precauções</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAlergiaModal}
        >
          Nova Alergia
        </Button>
      </Box>
      <AlergiaFormModal
        open={openAlergiaModal}
        onClose={handleCloseAlergiaModal}
        onSave={handleSaveAlergia}
        prontuarioId={prontuario.id}
      />
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
                  transition: "box-shadow 0.1s ease-in-out",
                  "&:hover": {
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
  const { loading, adicionarCirurgia } = useProntuario();
  const [cirurgiaModalOpen, setCirurgiaModalOpen] = useState(false);

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

  const handleAddCirurgia = (novaCirurgia) => {
    // Adicionar a nova cirurgia ao prontuário
    try {
      adicionarCirurgia(novaCirurgia);
    } catch (error) {
      console.error("Erro ao adicionar cirurgia:", error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Procedimentos Cirúrgicos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCirurgiaModalOpen(true)}
        >
          Nova Cirurgia
        </Button>
      </Box>

      <CirurgiaFormModal
        open={cirurgiaModalOpen}
        onClose={() => setCirurgiaModalOpen(false)}
        onSave={handleAddCirurgia}
      />

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
                  transition: "box-shadow 0.1s ease-in-out",
                  "&:hover": {
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
  const { loading } = useProntuario();
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);

  // Função para garantir que o parentesco seja exibido corretamente
  const obterParentesco = (doenca) => {
    // Parentescos padrão para doenças específicas
    const parentescosPadrao = {
      Hipertensão: "Pai",
      "Diabetes Tipo 2": "Avô",
      "Câncer de Mama": "Tia"
    };

    // Verificar se é uma doença conhecida e forçar o parentesco padrão
    if (parentescosPadrao[doenca.doenca]) {
      return parentescosPadrao[doenca.doenca];
    }

    // Se não for uma doença conhecida, usar o parentesco registrado ou um valor padrão
    return doenca.parentesco && doenca.parentesco !== "Não informado"
      ? doenca.parentesco
      : "Familiar";
  };

  // Função para adicionar um novo histórico familiar
  const handleAddHistoricoFamiliar = (novoHistorico) => {
    // Aqui você deve implementar a lógica para adicionar o histórico ao prontuário
    // Por enquanto, vamos apenas simular a adição
    console.log("Novo histórico familiar:", novoHistorico);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Histórico Familiar</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setHistoricoModalOpen(true)}
        >
          Adicionar Histórico
        </Button>
      </Box>

      <HistoricoFamiliarFormModal
        open={historicoModalOpen}
        onClose={() => setHistoricoModalOpen(false)}
        onSave={handleAddHistoricoFamiliar}
      />
      {prontuario.historicoFamiliar.doencas.length === 0 ? (
        <Alert severity="info">Não há doenças familiares registradas para este paciente.</Alert>
      ) : (
        <React.Fragment>
          <Grid container spacing={2} alignItems="stretch">
            {prontuario.historicoFamiliar.doencas.map((doenca, index) => {
              // Garantir que o parentesco seja sempre exibido
              const parentescoExibir = obterParentesco(doenca);

              return (
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
                      transition: "box-shadow 0.1s ease-in-out",
                      "&:hover": {
                        boxShadow: 3
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {doenca.doenca}
                      </Typography>
                      <Chip label={parentescoExibir} size="small" color="info" />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Parentesco:</strong> {parentescoExibir}
                    </Typography>
                    {doenca.observacoes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Observações:</strong> {doenca.observacoes}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {prontuario.historicoFamiliar.observacoes && (
            <Paper
              sx={{
                mt: 3,
                p: 2,
                border: 1,
                borderColor: "info.main",
                bgcolor: "info.lighter",
                transition: "box-shadow 0.1s ease-in-out",
                "&:hover": {
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
  const { loading, abrirModalAnexarDocumento } = useProntuario();
  // Limita o número de anexos a exibir de uma vez para evitar sobrecarga
  const maxItensRenderizados = 20;

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
    const tipoDocumento = tipo?.toLowerCase() || "";
    switch (tipoDocumento) {
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
    const tipoDocumento = tipo?.toLowerCase() || "";
    switch (tipoDocumento) {
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

  // Verificação de segurança para garantir que anexos seja um array
  const anexos = Array.isArray(prontuario.anexos) ? prontuario.anexos : [];
  // Limitar o número de anexos a exibir
  const anexosLimitados = anexos.slice(0, maxItensRenderizados);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Anexos e Documentos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AttachFileIcon />}
          onClick={abrirModalAnexarDocumento}
        >
          Anexar Documento
        </Button>
      </Box>
      {anexos.length === 0 ? (
        <Alert severity="info">Não há anexos disponíveis para este paciente.</Alert>
      ) : (
        <>
          <Grid container spacing={2} alignItems="stretch" sx={{ alignContent: "flex-start" }}>
            {anexosLimitados.map((anexo) => {
              if (!anexo) return null; // Proteção contra anexos nulos

              // Usar tipo como fallback para categoria
              const tipoAnexo = anexo.categoria || anexo.tipo || "Documento";
              const nomeAnexo = anexo.nome || `Arquivo ${tipoAnexo}`;
              const descricaoAnexo = anexo.descricao || `${nomeAnexo} (${tipoAnexo})`;
              const dataAnexo = anexo.dataUpload || anexo.data;
              const dataFormatada = dataAnexo ? formatarData(dataAnexo) : "Data não disponível";
              const color = getColorByFileType(tipoAnexo);

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={anexo.id || `anexo-${Math.random()}`}
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
                      transition: "box-shadow 0.1s ease-in-out",
                      "&:hover": {
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
                          {getIconByFileType(tipoAnexo)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            noWrap
                            title={nomeAnexo}
                            sx={{ lineHeight: 1.2 }}
                          >
                            {nomeAnexo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Adicionado em: {dataFormatada}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label={tipoAnexo} size="small" color={color} sx={{ flexShrink: 0 }} />
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
                        title={descricaoAnexo}
                      >
                        {descricaoAnexo}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: "auto",
                        pt: 2
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color={color}
                        startIcon={<VisibilityIcon />}
                        onClick={() => alert(`Visualizando arquivo: ${nomeAnexo}`)}
                      >
                        Visualizar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color={color}
                        startIcon={<DownloadIcon />}
                        onClick={() => alert(`Download iniciado: ${nomeAnexo}`)}
                      >
                        Baixar
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          {anexos.length > maxItensRenderizados && (
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Exibindo {maxItensRenderizados} de {anexos.length} anexos.
              </Typography>
            </Box>
          )}
        </>
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
  const [carregandoAba, setCarregandoAba] = useState(false);
  const {
    carregarConsultasExemplo,
    carregarMedicamentosExemplo,
    carregarAlergiasExemplo,
    carregarCirurgiasExemplo,
    carregarHistoricoFamiliarExemplo,
    carregarAnexosExemplo,
    verificarExemploJaCarregado
  } = useProntuario();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Carregar dados sob demanda quando o usuário seleciona uma aba específica
    carregarDadosDaAba(newValue);
  };

  // Função para carregar dados específicos de cada aba quando necessário
  const carregarDadosDaAba = async (abaIndex) => {
    try {
      setCarregandoAba(true);
      switch (abaIndex) {
        case 1: // Histórico
          if (
            !verificarExemploJaCarregado("consultas") &&
            (!prontuario.consultas || prontuario.consultas.length === 0)
          ) {
            await carregarConsultasExemplo();
          }
          break;
        case 2: // Medicamentos
          if (
            !verificarExemploJaCarregado("medicamentos") &&
            (!prontuario.medicamentos || prontuario.medicamentos.length === 0)
          ) {
            await carregarMedicamentosExemplo();
          }
          break;
        case 3: // Alergias
          if (
            !verificarExemploJaCarregado("alergias") &&
            (!prontuario.alergias || prontuario.alergias.length === 0)
          ) {
            await carregarAlergiasExemplo();
          }
          break;
        case 4: // Cirurgias
          if (
            !verificarExemploJaCarregado("cirurgias") &&
            (!prontuario.cirurgias || prontuario.cirurgias.length === 0)
          ) {
            await carregarCirurgiasExemplo();
          }
          break;
        case 5: // Hist. Familiar
          if (
            !verificarExemploJaCarregado("historicoFamiliar") &&
            (!prontuario.historicoFamiliar ||
              !prontuario.historicoFamiliar.doencas ||
              prontuario.historicoFamiliar.doencas.length === 0)
          ) {
            await carregarHistoricoFamiliarExemplo();
          }
          break;
        case 6: // Anexos
          if (
            !verificarExemploJaCarregado("anexos") &&
            (!prontuario.anexos || prontuario.anexos.length === 0)
          ) {
            await carregarAnexosExemplo();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Erro ao carregar dados da aba:", error);
    } finally {
      setCarregandoAba(false);
    }
  };

  if (!prontuario) {
    return <Alert severity="warning">Prontuário não encontrado</Alert>;
  }

  // Função para formatação segura de datas
  const formatarDataSegura = (dataString) => {
    try {
      if (!dataString) return "Data não disponível";

      const data = new Date(dataString);
      if (isNaN(data.getTime())) return "Data inválida";

      return data.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data não disponível";
    }
  };

  // Formatar alergias de forma segura para exibição
  const formatarAlergias = () => {
    try {
      if (
        !prontuario.alergias ||
        !Array.isArray(prontuario.alergias) ||
        prontuario.alergias.length === 0
      ) {
        return "Nenhuma alergia registrada";
      }

      // Limitar para as 3 primeiras alergias para evitar textos muito longos
      const primeirasTresAlergias = prontuario.alergias.slice(0, 3);

      const textoAlergias = primeirasTresAlergias
        .map((a) => {
          if (!a) return "Alergia não especificada";

          const agente = a.agente || "Agente não especificado";
          const gravidade = a.gravidade ? ` (${a.gravidade})` : "";
          const reacao = a.reacao ? ` - ${a.reacao}` : "";

          return `${agente}${gravidade}${reacao}`;
        })
        .join(", ");

      if (prontuario.alergias.length > 3) {
        return `${textoAlergias} e mais ${prontuario.alergias.length - 3} alergia(s)`;
      }

      return textoAlergias;
    } catch (error) {
      console.error("Erro ao formatar alergias:", error);
      return "Erro ao processar alergias";
    }
  };

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
              {prontuario.nomePaciente?.charAt(0) || "P"}
            </Avatar>
            <Box>
              <Typography variant="h5">{prontuario.nomePaciente || "Paciente"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {prontuario.sexo === "M"
                  ? "Masculino"
                  : prontuario.sexo === "F"
                    ? "Feminino"
                    : "Outro"}{" "}
                • {prontuario.dataNascimento || "Data não informada"} •{" "}
                {prontuario.dadosPessoais?.tipoSanguineo || "Tipo sanguíneo não informado"}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Tooltip title="Data de criação do prontuário">
              <Box display="flex" alignItems="center" mr={2}>
                <EventIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Criado em: {formatarDataSegura(prontuario.dataCriacao)}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Última atualização">
              <Box display="flex" alignItems="center">
                <AccessTimeIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Atualizado em: {formatarDataSegura(prontuario.ultimaAtualizacao)}
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
            px: 2,
            borderRadius: 1,
            my: 1
          }}
        >
          <SecurityUpdateWarningIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="body2" color="error">
            <strong>Alerta de Alergias:</strong> {formatarAlergias()}
          </Typography>
        </Box>

        <Divider />

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
          <Tab icon={<FamilyRestroomIcon />} label="Hist. Familiar" />
          <Tab icon={<DocumentScannerIcon />} label="Anexos" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <DadosPessoais paciente={prontuario} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {carregandoAba ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <HistoricoMedico prontuario={prontuario} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {carregandoAba ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Medicamentos prontuario={prontuario} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {carregandoAba ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <AlergiasEPrecaucoes prontuario={prontuario} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        {carregandoAba ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Cirurgias prontuario={prontuario} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        {carregandoAba ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <HistoricoFamiliar prontuario={prontuario} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        {carregandoAba ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Anexos prontuario={prontuario} />
        )}
      </TabPanel>
    </Box>
  );
};

ProntuarioDetails.propTypes = {
  prontuario: PropTypes.object.isRequired
};

export default ProntuarioDetails;
