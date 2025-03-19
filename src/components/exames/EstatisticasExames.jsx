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
import ExameModel from "../../models/ExameModel";

// Simulando os dados para os gráficos
// Em uma implementação real, esses dados viriam do backend
const gerarDadosExamesPorCategoria = () => {
  const categorias = ["Hematologia", "Bioquímica", "Imagem", "Urinálise", "Microbiologia"];
  return categorias.map((categoria) => ({
    categoria,
    solicitados: Math.floor(Math.random() * 30) + 5,
    concluidos: Math.floor(Math.random() * 20) + 3
  }));
};

const gerarDadosExamesPorStatus = () => {
  return [
    { status: "Solicitado", quantidade: 12 },
    { status: "Em Andamento", quantidade: 8 },
    { status: "Concluído", quantidade: 25 },
    { status: "Cancelado", quantidade: 3 }
  ];
};

const gerarDadosExamesPorPrioridade = () => {
  return [
    { prioridade: "Baixa", quantidade: 10 },
    { prioridade: "Normal", quantidade: 20 },
    { prioridade: "Alta", quantidade: 12 },
    { prioridade: "Urgente", quantidade: 5 }
  ];
};

const EstatisticasExames = ({ periodo = "mes" }) => {
  const [loading, setLoading] = useState(true);
  const [dadosExames, setDadosExames] = useState({
    totalSolicitados: 0,
    totalConcluidos: 0,
    totalEmAndamento: 0,
    totalCancelados: 0,
    examesPorCategoria: [],
    examesPorStatus: [],
    examesPorPrioridade: []
  });

  useEffect(() => {
    carregarEstatisticas();
  }, [periodo]);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);

      // Carregar estatísticas do modelo
      const estatisticas = await ExameModel.obterEstatisticas();

      // Encontrar quantidades por status
      const totalSolicitados =
        estatisticas.examesPorStatus.find((e) => e.status === "Solicitado")?.quantidade || 0;

      const totalConcluidos =
        estatisticas.examesPorStatus.find((e) => e.status === "Concluído")?.quantidade || 0;

      const totalEmAndamento =
        estatisticas.examesPorStatus.find((e) => e.status === "Em Andamento")?.quantidade || 0;

      const totalCancelados =
        estatisticas.examesPorStatus.find((e) => e.status === "Cancelado")?.quantidade || 0;

      setDadosExames({
        totalSolicitados,
        totalConcluidos,
        totalEmAndamento,
        totalCancelados,
        examesPorCategoria: estatisticas.examesPorCategoria,
        examesPorStatus: estatisticas.examesPorStatus,
        examesPorPrioridade: estatisticas.examesPorPrioridade
      });

      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar estatísticas de exames:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Cards de resumo */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Total Solicitados
              </Typography>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {dadosExames.totalSolicitados}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Em Andamento
              </Typography>
              <Typography variant="h3" align="center" sx={{ my: 2, color: "warning.main" }}>
                {dadosExames.totalEmAndamento}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Concluídos
              </Typography>
              <Typography variant="h3" align="center" sx={{ my: 2, color: "success.main" }}>
                {dadosExames.totalConcluidos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Cancelados
              </Typography>
              <Typography variant="h3" align="center" sx={{ my: 2, color: "error.light" }}>
                {dadosExames.totalCancelados}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráficos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Exames por Categoria" />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* Visualização simplificada dos dados */}
                {dadosExames.examesPorCategoria.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      width: "100%",
                      mb: 1,
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Typography sx={{ width: "30%" }}>{item.categoria}</Typography>
                    <Box
                      sx={{
                        width: "70%",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Box
                        sx={{
                          height: 24,
                          backgroundColor: "primary.main",
                          width: `${Math.min(item.solicitados * 5, 60)}%`
                        }}
                      />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {item.solicitados} solicitados / {item.concluidos} concluídos
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Exames por Status" />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {/* Visualização simplificada dos dados de status */}
                <Box sx={{ display: "flex", width: "100%", height: 200, mt: 2 }}>
                  {dadosExames.examesPorStatus.map((item, index) => {
                    // Definir cores para cada status
                    const cores = {
                      Solicitado: "info.main",
                      "Em Andamento": "warning.main",
                      Concluído: "success.main",
                      Cancelado: "error.main"
                    };

                    const total = dadosExames.examesPorStatus.reduce(
                      (sum, stat) => sum + stat.quantidade,
                      0
                    );

                    const largura = `${Math.max((item.quantidade / total) * 100, 5)}%`;

                    return (
                      <Box
                        key={index}
                        sx={{
                          width: largura,
                          height: "100%",
                          backgroundColor: cores[item.status] || "grey.400",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          px: 1
                        }}
                      >
                        <Typography variant="body2" color="white" align="center">
                          {item.quantidade}
                        </Typography>
                        <Typography variant="caption" color="white" align="center">
                          {item.status}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Exames por Prioridade" />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* Visualização simplificada dos dados de prioridade */}
                <Box sx={{ width: "100%", px: 4 }}>
                  {dadosExames.examesPorPrioridade.map((item, index) => {
                    // Definir cores para cada prioridade
                    const cores = {
                      Baixa: "info.light",
                      Normal: "info.main",
                      Alta: "warning.main",
                      Urgente: "error.main"
                    };

                    const maxValor = Math.max(
                      ...dadosExames.examesPorPrioridade.map((p) => p.quantidade)
                    );

                    return (
                      <Box key={index} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ width: "15%", mr: 2 }}>
                          {item.prioridade}:
                        </Typography>
                        <Box
                          sx={{
                            height: 28,
                            backgroundColor: cores[item.prioridade] || "grey.400",
                            width: `${Math.max((item.quantidade / maxValor) * 80, 5)}%`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            pr: 2
                          }}
                        >
                          <Typography variant="body2" color="white">
                            {item.quantidade}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EstatisticasExames;
