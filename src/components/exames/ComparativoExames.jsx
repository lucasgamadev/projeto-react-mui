import {
  DateRange as DateRangeIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme
} from "@mui/material";
import { format, parseISO, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Dados de exemplo para histórico de exames
const historicoExamesExemplo = {
  Hemoglobina: [
    { data: "2023-10-15", valor: 13.8, unidade: "g/dL", referencia: { min: 12.0, max: 16.0 } },
    { data: "2023-12-10", valor: 13.5, unidade: "g/dL", referencia: { min: 12.0, max: 16.0 } },
    { data: "2024-01-22", valor: 13.2, unidade: "g/dL", referencia: { min: 12.0, max: 16.0 } },
    { data: "2024-03-12", valor: 14.5, unidade: "g/dL", referencia: { min: 12.0, max: 16.0 } }
  ],
  "Glicemia de jejum": [
    { data: "2023-10-15", valor: 105, unidade: "mg/dL", referencia: { min: 70, max: 99 } },
    { data: "2023-12-10", valor: 112, unidade: "mg/dL", referencia: { min: 70, max: 99 } },
    { data: "2024-01-22", valor: 108, unidade: "mg/dL", referencia: { min: 70, max: 99 } },
    { data: "2024-03-12", valor: 110, unidade: "mg/dL", referencia: { min: 70, max: 99 } }
  ],
  "Colesterol Total": [
    { data: "2023-10-15", valor: 210, unidade: "mg/dL", referencia: { min: 0, max: 200 } },
    { data: "2023-12-10", valor: 205, unidade: "mg/dL", referencia: { min: 0, max: 200 } },
    { data: "2024-01-22", valor: 195, unidade: "mg/dL", referencia: { min: 0, max: 200 } },
    { data: "2024-03-12", valor: 188, unidade: "mg/dL", referencia: { min: 0, max: 200 } }
  ],
  Triglicérides: [
    { data: "2023-10-15", valor: 180, unidade: "mg/dL", referencia: { min: 0, max: 150 } },
    { data: "2023-12-10", valor: 165, unidade: "mg/dL", referencia: { min: 0, max: 150 } },
    { data: "2024-01-22", valor: 155, unidade: "mg/dL", referencia: { min: 0, max: 150 } },
    { data: "2024-03-12", valor: 145, unidade: "mg/dL", referencia: { min: 0, max: 150 } }
  ],
  HDL: [
    { data: "2023-10-15", valor: 42, unidade: "mg/dL", referencia: { min: 40, max: 60 } },
    { data: "2023-12-10", valor: 45, unidade: "mg/dL", referencia: { min: 40, max: 60 } },
    { data: "2024-01-22", valor: 48, unidade: "mg/dL", referencia: { min: 40, max: 60 } },
    { data: "2024-03-12", valor: 50, unidade: "mg/dL", referencia: { min: 40, max: 60 } }
  ],
  LDL: [
    { data: "2023-10-15", valor: 130, unidade: "mg/dL", referencia: { min: 0, max: 130 } },
    { data: "2023-12-10", valor: 125, unidade: "mg/dL", referencia: { min: 0, max: 130 } },
    { data: "2024-01-22", valor: 115, unidade: "mg/dL", referencia: { min: 0, max: 130 } },
    { data: "2024-03-12", valor: 110, unidade: "mg/dL", referencia: { min: 0, max: 130 } }
  ],
  TSH: [
    { data: "2023-10-15", valor: 2.8, unidade: "µUI/mL", referencia: { min: 0.4, max: 4.0 } },
    { data: "2023-12-10", valor: 2.5, unidade: "µUI/mL", referencia: { min: 0.4, max: 4.0 } },
    { data: "2024-01-22", valor: 2.6, unidade: "µUI/mL", referencia: { min: 0.4, max: 4.0 } },
    { data: "2024-03-12", valor: 2.5, unidade: "µUI/mL", referencia: { min: 0.4, max: 4.0 } }
  ]
};

/**
 * Componente para exibir histórico comparativo de resultados de exames
 *
 * @param {Object} props Propriedades do componente
 * @param {Object} props.historicoExames Objeto com histórico de exames por tipo
 * @param {Function} props.onExportarDados Função para exportar dados do comparativo
 */
const ComparativoExames = ({
  historicoExames = historicoExamesExemplo,
  onExportarDados = () => {}
}) => {
  const theme = useTheme();
  // Estados
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState(Object.keys(historicoExames)[0]);
  const [tipoGrafico, setTipoGrafico] = useState("linha");
  const [periodoAnalise, setPeriodoAnalise] = useState("12");
  const [dadosFormatados, setDadosFormatados] = useState([]);

  // Cores para o gráfico
  const coresPrimarias = {
    normal: theme.palette.primary.main,
    abaixo: theme.palette.error.main,
    acima: theme.palette.warning.main
  };

  // Processar dados para exibição no gráfico
  useEffect(() => {
    if (tipoExameSelecionado && historicoExames[tipoExameSelecionado]) {
      const dadosExame = historicoExames[tipoExameSelecionado];

      // Filtrar por período
      const dataLimite = subMonths(new Date(), parseInt(periodoAnalise));
      const dadosFiltrados = dadosExame.filter((item) => parseISO(item.data) >= dataLimite);

      // Formatar dados para o gráfico
      const dados = dadosFiltrados.map((item) => {
        const { min, max } = item.referencia;
        const status = item.valor < min ? "abaixo" : item.valor > max ? "acima" : "normal";

        return {
          data: format(parseISO(item.data), "dd/MM/yyyy", { locale: ptBR }),
          valor: item.valor,
          min,
          max,
          status,
          dataOriginal: item.data
        };
      });

      // Ordenar por data
      dados.sort((a, b) => parseISO(a.dataOriginal) - parseISO(b.dataOriginal));

      setDadosFormatados(dados);
    }
  }, [tipoExameSelecionado, periodoAnalise, historicoExames]);

  // Formatar tooltip para o gráfico
  const formatarTooltip = (value, name) => {
    if (name === "valor") {
      const exame = historicoExames[tipoExameSelecionado][0];
      return [value, exame.unidade];
    }
    if (name === "min" || name === "max") {
      return [value, "Referência"];
    }
    return [value, name];
  };

  // Renderizar o tipo de gráfico selecionado
  const renderizarGrafico = () => {
    const exameAtual = historicoExames[tipoExameSelecionado][0];
    const unidade = exameAtual.unidade;
    const { min, max } = exameAtual.referencia;

    switch (tipoGrafico) {
      case "linha":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosFormatados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" tick={{ fill: theme.palette.text.secondary }} tickMargin={10} />
              <YAxis
                domain={[
                  (dataMin) => Math.floor(Math.min(min, dataMin) * 0.9),
                  (dataMax) => Math.ceil(Math.max(max, dataMax) * 1.1)
                ]}
                unit={` ${unidade}`}
                tick={{ fill: theme.palette.text.secondary }}
                width={80}
              />
              <Tooltip
                formatter={formatarTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}
              />
              <Legend />
              <ReferenceLine
                y={min}
                stroke={theme.palette.info.main}
                strokeDasharray="3 3"
                label="Min"
              />
              <ReferenceLine
                y={max}
                stroke={theme.palette.info.main}
                strokeDasharray="3 3"
                label="Max"
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={theme.palette.primary.main}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{
                  fill: (entry) =>
                    entry.status === "normal"
                      ? coresPrimarias.normal
                      : entry.status === "abaixo"
                        ? coresPrimarias.abaixo
                        : coresPrimarias.acima,
                  stroke: "white",
                  strokeWidth: 2,
                  r: 5
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dadosFormatados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" tick={{ fill: theme.palette.text.secondary }} tickMargin={10} />
              <YAxis
                domain={[
                  (dataMin) => Math.floor(Math.min(min, dataMin) * 0.9),
                  (dataMax) => Math.ceil(Math.max(max, dataMax) * 1.1)
                ]}
                unit={` ${unidade}`}
                tick={{ fill: theme.palette.text.secondary }}
                width={80}
              />
              <Tooltip
                formatter={formatarTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}
              />
              <Legend />
              <ReferenceLine
                y={min}
                stroke={theme.palette.info.main}
                strokeDasharray="3 3"
                label="Min"
              />
              <ReferenceLine
                y={max}
                stroke={theme.palette.info.main}
                strokeDasharray="3 3"
                label="Max"
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.light}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "barra":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dadosFormatados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" tick={{ fill: theme.palette.text.secondary }} tickMargin={10} />
              <YAxis
                domain={[
                  (dataMin) => Math.floor(Math.min(min, dataMin) * 0.9),
                  (dataMax) => Math.ceil(Math.max(max, dataMax) * 1.1)
                ]}
                unit={` ${unidade}`}
                tick={{ fill: theme.palette.text.secondary }}
                width={80}
              />
              <Tooltip
                formatter={formatarTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}
              />
              <Legend />
              <ReferenceLine
                y={min}
                stroke={theme.palette.info.main}
                strokeDasharray="3 3"
                label="Min"
              />
              <ReferenceLine
                y={max}
                stroke={theme.palette.info.main}
                strokeDasharray="3 3"
                label="Max"
              />
              <Bar
                dataKey="valor"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  // Obter estatísticas sobre o histórico do exame selecionado
  const obterEstatisticas = () => {
    if (!dadosFormatados.length) return null;

    const valores = dadosFormatados.map((item) => item.valor);
    const atual = valores[valores.length - 1];
    const anterior = valores.length > 1 ? valores[valores.length - 2] : null;
    const variacao = anterior ? ((atual - anterior) / anterior) * 100 : 0;
    const media = valores.reduce((acc, val) => acc + val, 0) / valores.length;
    const maximo = Math.max(...valores);
    const minimo = Math.min(...valores);
    const exameAtual = historicoExames[tipoExameSelecionado][0];
    const { min, max } = exameAtual.referencia;

    const statusAtual = atual < min ? "abaixo" : atual > max ? "acima" : "normal";

    return {
      atual,
      anterior,
      variacao,
      media: media.toFixed(2),
      maximo,
      minimo,
      unidade: exameAtual.unidade,
      status: statusAtual
    };
  };

  const estatisticas = obterEstatisticas();

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <ShowChartIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Histórico Comparativo de Exames</Typography>
          </Box>
        }
        action={
          <Button
            variant="outlined"
            size="small"
            startIcon={<TimelineIcon />}
            onClick={() => onExportarDados(tipoExameSelecionado, dadosFormatados)}
          >
            Exportar Dados
          </Button>
        }
      />
      <Divider />

      <CardContent>
        {/* Filtros e controles */}
        <Box mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Exame</InputLabel>
                <Select
                  value={tipoExameSelecionado}
                  onChange={(e) => setTipoExameSelecionado(e.target.value)}
                  label="Exame"
                >
                  {Object.keys(historicoExames).map((exame) => (
                    <MenuItem key={exame} value={exame}>
                      {exame}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Gráfico</InputLabel>
                <Select
                  value={tipoGrafico}
                  onChange={(e) => setTipoGrafico(e.target.value)}
                  label="Tipo de Gráfico"
                >
                  <MenuItem value="linha">Linha</MenuItem>
                  <MenuItem value="area">Área</MenuItem>
                  <MenuItem value="barra">Barras</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Período</InputLabel>
                <Select
                  value={periodoAnalise}
                  onChange={(e) => setPeriodoAnalise(e.target.value)}
                  label="Período"
                  startAdornment={<DateRangeIcon fontSize="small" sx={{ mr: 1, ml: -0.5 }} />}
                >
                  <MenuItem value="3">Últimos 3 meses</MenuItem>
                  <MenuItem value="6">Últimos 6 meses</MenuItem>
                  <MenuItem value="12">Último ano</MenuItem>
                  <MenuItem value="24">Últimos 2 anos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Estatísticas resumidas */}
        {estatisticas && (
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  sx={{
                    p: 1.5,
                    textAlign: "center",
                    bgcolor:
                      estatisticas.status === "normal"
                        ? theme.palette.success.light
                        : estatisticas.status === "abaixo"
                          ? theme.palette.error.light
                          : theme.palette.warning.light,
                    color:
                      estatisticas.status === "normal"
                        ? theme.palette.success.contrastText
                        : estatisticas.status === "abaixo"
                          ? theme.palette.error.contrastText
                          : theme.palette.warning.contrastText
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    Valor Atual
                  </Typography>
                  <Typography variant="h6">
                    {estatisticas.atual} {estatisticas.unidade}
                  </Typography>
                  {estatisticas.variacao !== 0 && estatisticas.anterior && (
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          estatisticas.variacao > 0
                            ? theme.palette.success.dark
                            : theme.palette.error.dark
                      }}
                    >
                      {estatisticas.variacao > 0 ? "↑" : "↓"}{" "}
                      {Math.abs(estatisticas.variacao).toFixed(1)}%
                    </Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 1.5, textAlign: "center" }}>
                  <Typography variant="body2" gutterBottom>
                    Média
                  </Typography>
                  <Typography variant="h6">
                    {estatisticas.media} {estatisticas.unidade}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 1.5, textAlign: "center" }}>
                  <Typography variant="body2" gutterBottom>
                    Mínimo
                  </Typography>
                  <Typography variant="h6">
                    {estatisticas.minimo} {estatisticas.unidade}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper sx={{ p: 1.5, textAlign: "center" }}>
                  <Typography variant="body2" gutterBottom>
                    Máximo
                  </Typography>
                  <Typography variant="h6">
                    {estatisticas.maximo} {estatisticas.unidade}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <Paper sx={{ p: 1.5 }}>
                  <Typography variant="body2" gutterBottom>
                    Interpretação
                  </Typography>
                  <Typography variant="body1">
                    {estatisticas.status === "normal"
                      ? "Valor dentro dos parâmetros normais de referência"
                      : estatisticas.status === "abaixo"
                        ? "Valor abaixo do limite inferior de referência"
                        : "Valor acima do limite superior de referência"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Gráfico */}
        <Box>
          {dadosFormatados.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                Não há dados suficientes para exibir o histórico
              </Typography>
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ p: 2 }}>
              {renderizarGrafico()}
            </Paper>
          )}
        </Box>

        {/* Legenda */}
        <Box mt={2}>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Legenda:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.main,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">Valor medido</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: theme.palette.info.main,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">Limites de referência</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: theme.palette.warning.main,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">Valor fora da referência</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ComparativoExames;
