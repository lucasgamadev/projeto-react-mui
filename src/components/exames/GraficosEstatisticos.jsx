import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import ExameModel from "../../models/ExameModel";

const CORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const GraficosEstatisticos = () => {
  const [dadosExames, setDadosExames] = useState([]);
  const [dadosStatus, setDadosStatus] = useState([]);
  const [dadosTipos, setDadosTipos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);

      // Carregar todos os exames
      const exames = await ExameModel.listarExames();
      setDadosExames(exames);

      // Dados para gráfico de status
      const statusCount = {};
      exames.forEach((exame) => {
        statusCount[exame.status] = (statusCount[exame.status] || 0) + 1;
      });

      const dadosStatusFormatados = Object.keys(statusCount).map((status) => ({
        name: status,
        value: statusCount[status]
      }));
      setDadosStatus(dadosStatusFormatados);

      // Dados para gráfico de tipos de exame
      const tiposExames = await ExameModel.listarTiposExame();
      const examesPorTipo = {};

      tiposExames.forEach((tipo) => {
        const quantidade = exames.filter((exame) => exame.tipoExameId === tipo.id).length;
        if (quantidade > 0) {
          examesPorTipo[tipo.nome] = quantidade;
        }
      });

      const dadosTiposFormatados = Object.keys(examesPorTipo)
        .map((nome) => ({
          name: nome,
          quantidade: examesPorTipo[nome]
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5); // Limitar aos 5 mais comuns

      setDadosTipos(dadosTiposFormatados);

      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar dados para gráficos:", error);
      setCarregando(false);
    }
  };

  const calcularPercentualConcluido = () => {
    if (dadosExames.length === 0) return 0;

    const examesConcluidos = dadosExames.filter((exame) => exame.status === "Concluído").length;
    return Math.round((examesConcluidos / dadosExames.length) * 100);
  };

  if (carregando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Status dos Exames"
            subheader={`Total de exames: ${dadosExames.length}`}
          />
          <Divider />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} exames`, "Quantidade"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box mt={2} textAlign="center">
              <Typography variant="subtitle1">
                Taxa de conclusão: {calcularPercentualConcluido()}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Tipos de Exame Mais Solicitados"
            subheader="Top 5 exames mais frequentes"
          />
          <Divider />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosTipos}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                  barSize={20}
                >
                  <XAxis
                    dataKey="name"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} exames`, "Quantidade"]} />
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="quantidade" name="Quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default GraficosEstatisticos;
