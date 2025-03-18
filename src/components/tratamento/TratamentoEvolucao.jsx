import {
  Box,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import React from "react";

const TratamentoEvolucao = ({ tratamento }) => {
  const formatarData = (data) => {
    if (!data) return "Não definido";
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Evolução do Tratamento
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Etapas do Tratamento
      </Typography>
      {tratamento.etapas.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Nenhuma etapa definida.
        </Typography>
      ) : (
        <List dense disablePadding>
          {tratamento.etapas.map((etapa, index) => (
            <ListItem key={index} sx={{ bgcolor: "background.paper", mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight="medium">
                      {etapa.numero}. {etapa.nome}
                    </Typography>
                    <Chip
                      label={etapa.status}
                      size="small"
                      color={etapa.status === "concluída" ? "success" : "default"}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <Box mt={0.5}>
                    {etapa.descricao && (
                      <Typography variant="body2" color="textSecondary">
                        {etapa.descricao}
                      </Typography>
                    )}
                    <Grid container spacing={1} mt={0.5}>
                      <Grid item>
                        <Typography variant="caption" color="textSecondary">
                          Início: {formatarData(etapa.dataInicio)}
                        </Typography>
                      </Grid>
                      {etapa.dataFim && (
                        <Grid item>
                          <Typography variant="caption" color="textSecondary">
                            Término previsto: {formatarData(etapa.dataFim)}
                          </Typography>
                        </Grid>
                      )}
                      {etapa.dataConclusao && (
                        <Grid item>
                          <Typography variant="caption" color="textSecondary">
                            Concluído em: {formatarData(etapa.dataConclusao)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Avaliações de Progresso
      </Typography>
      {tratamento.avaliacoes.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Nenhuma avaliação registrada.
        </Typography>
      ) : (
        <List dense disablePadding>
          {tratamento.avaliacoes.map((avaliacao, index) => (
            <ListItem key={index} sx={{ bgcolor: "background.paper", mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" fontWeight="medium">
                      Avaliação de {formatarData(avaliacao.data)}
                    </Typography>
                    <Chip
                      label={`${avaliacao.progresso}% de progresso`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                }
                secondary={
                  <Box mt={0.5}>
                    <Typography variant="body2" color="textSecondary">
                      {avaliacao.descricao}
                    </Typography>
                    {avaliacao.medicoNome && (
                      <Typography variant="caption" display="block" color="textSecondary">
                        Médico: {avaliacao.medicoNome}
                      </Typography>
                    )}
                    {avaliacao.evolucao && (
                      <Typography variant="caption" display="block" color="textSecondary">
                        Evolução: {avaliacao.evolucao}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

TratamentoEvolucao.propTypes = {
  tratamento: PropTypes.object.isRequired
};

export default TratamentoEvolucao;
