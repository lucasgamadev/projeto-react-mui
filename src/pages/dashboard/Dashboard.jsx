import {
  BarChart as BarChartIcon,
  EventAvailable as EventAvailableIcon,
  Favorite as FavoriteIcon,
  LocalHospital as LocalHospitalIcon,
  Paid as PaidIcon,
  People as PeopleIcon
} from "@mui/icons-material";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import CardEstatistico from "../../components/CardEstatistico";
import GraficoEstatistico from "../../components/GraficoEstatistico";
import ListaAtividades from "../../components/ListaAtividades";
import MiniCalendario from "../../components/MiniCalendario";
import TarefasPendentes from "../../components/TarefasPendentes";

const Dashboard = () => {
  // Estado para tarefas pendentes
  const [tarefas, setTarefas] = useState([
    { id: 1, titulo: "Revisar prontuários pendentes", concluida: false, prioridade: "alta" },
    { id: 2, titulo: "Atualizar sistema de agenda", concluida: true, prioridade: "media" },
    { id: 3, titulo: "Preparar relatório mensal", concluida: false, prioridade: "media" },
    { id: 4, titulo: "Reunião com equipe médica", concluida: false, prioridade: "alta" },
    { id: 5, titulo: "Verificar estoque de medicamentos", concluida: false, prioridade: "baixa" }
  ]);

  // Dados de exemplo para estatísticas
  const estatisticas = [
    {
      titulo: "Pacientes Atendidos",
      valor: "158",
      subtitulo: "Total no mês",
      icone: <PeopleIcon />,
      cor: "#1976d2",
      diferenca: 12
    },
    {
      titulo: "Consultas Agendadas",
      valor: "32",
      subtitulo: "Próximos 7 dias",
      icone: <EventAvailableIcon />,
      cor: "#8e24aa",
      diferenca: 5
    },
    {
      titulo: "Faturamento",
      valor: "R$ 42.500",
      subtitulo: "Este mês",
      icone: <PaidIcon />,
      cor: "#2e7d32",
      diferenca: 8
    },
    {
      titulo: "Taxa de Ocupação",
      valor: "75%",
      subtitulo: "Leitos ocupados",
      icone: <FavoriteIcon />,
      cor: "#d32f2f",
      diferenca: -3,
      progresso: 75,
      mostrarProgresso: true
    }
  ];

  // Dados de exemplo para atividades recentes
  const atividades = [
    {
      id: 1,
      titulo: "Novo paciente cadastrado",
      descricao: "Maria Silva foi cadastrada no sistema.",
      data: new Date(Date.now() - 1000 * 60 * 15),
      avatar: <PeopleIcon />,
      corAvatar: "#1976d2"
    },
    {
      id: 2,
      titulo: "Consulta agendada",
      descricao: "Dr. Carlos agendou consulta com paciente João.",
      data: new Date(Date.now() - 1000 * 60 * 60 * 2),
      avatar: <EventAvailableIcon />,
      corAvatar: "#8e24aa"
    },
    {
      id: 3,
      titulo: "Faturamento atualizado",
      descricao: "O relatório de faturamento foi atualizado.",
      data: new Date(Date.now() - 1000 * 60 * 60 * 5),
      avatar: <PaidIcon />,
      corAvatar: "#2e7d32"
    },
    {
      id: 4,
      titulo: "Indicadores revisados",
      descricao: "Os indicadores de desempenho foram atualizados.",
      data: new Date(Date.now() - 1000 * 60 * 60 * 8),
      avatar: <BarChartIcon />,
      corAvatar: "#ed6c02"
    }
  ];

  // Dados de exemplo para eventos
  const eventos = [
    {
      id: 1,
      titulo: "Reunião com equipe médica",
      data: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // Amanhã
      local: "Sala 101",
      tipo: "Reunião",
      concluido: false,
      cor: "#1976d2",
      icone: <PeopleIcon fontSize="small" />
    },
    {
      id: 2,
      titulo: "Palestra sobre saúde preventiva",
      data: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 dias depois
      local: "Auditório",
      tipo: "Evento",
      concluido: false,
      cor: "#8e24aa",
      icone: <EventAvailableIcon fontSize="small" />
    },
    {
      id: 3,
      titulo: "Treinamento de novos médicos",
      data: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 dias depois
      local: "Sala de treinamento",
      tipo: "Treinamento",
      concluido: false,
      cor: "#2e7d32",
      icone: <LocalHospitalIcon fontSize="small" />
    },
    {
      id: 4,
      titulo: "Manutenção de equipamentos",
      data: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias depois
      local: "Ala Leste",
      tipo: "Manutenção",
      concluido: false,
      cor: "#d32f2f"
    },
    {
      id: 5,
      titulo: "Consulta - Ana Oliveira",
      data: new Date(Date.now() + 1000 * 60 * 60 * 2), // Hoje, em 2 horas
      local: "Consultório 5",
      tipo: "Consulta",
      concluido: false,
      cor: "#00796b"
    }
  ];

  // Dados de exemplo para o gráfico de atendimentos
  const dadosAtendimentos = [
    { nome: "Jan", valor: 125, meta: 100 },
    { nome: "Fev", valor: 130, meta: 100 },
    { nome: "Mar", valor: 140, meta: 110 },
    { nome: "Abr", valor: 135, meta: 110 },
    { nome: "Mai", valor: 150, meta: 120 },
    { nome: "Jun", valor: 145, meta: 120 }
  ];

  // Dados de exemplo para o gráfico de faturamento
  const dadosFaturamento = [
    { nome: "Jan", Consultas: 35000, Procedimentos: 20000, Exames: 15000 },
    { nome: "Fev", Consultas: 38000, Procedimentos: 22000, Exames: 18000 },
    { nome: "Mar", Consultas: 42000, Procedimentos: 24000, Exames: 20000 },
    { nome: "Abr", Consultas: 40000, Procedimentos: 25000, Exames: 22000 },
    { nome: "Mai", Consultas: 45000, Procedimentos: 28000, Exames: 24000 },
    { nome: "Jun", Consultas: 48000, Procedimentos: 30000, Exames: 25000 }
  ];

  // Dados de exemplo para o gráfico de distribuição
  const dadosDistribuicao = [
    { nome: "Consultas", valor: 45, cor: "#1976d2" },
    { nome: "Procedimentos", valor: 30, cor: "#8e24aa" },
    { nome: "Exames", valor: 25, cor: "#2e7d32" }
  ];

  // Opções de período para os gráficos
  const opcoesPeriodo = [
    { valor: "ultimos7dias", label: "Últimos 7 dias" },
    { valor: "ultimos30dias", label: "Últimos 30 dias" },
    { valor: "ultimos3meses", label: "Últimos 3 meses" },
    { valor: "ultimos6meses", label: "Últimos 6 meses" },
    { valor: "ultimo1ano", label: "Último ano" }
  ];

  // Alternar estado de conclusão das tarefas
  const handleTarefaToggle = (tarefaId) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === tarefaId ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  // Adicionar nova tarefa
  const handleAddTarefa = (novaTarefa) => {
    const newId = Math.max(...tarefas.map((t) => t.id), 0) + 1;
    setTarefas([...tarefas, { ...novaTarefa, id: newId }]);
  };

  // Séries para o gráfico de linha
  const seriesAtendimentos = [
    { dataKey: "valor", nome: "Atendimentos", cor: "#1976d2" },
    { dataKey: "meta", nome: "Meta", cor: "#f57c00" }
  ];

  // Séries para o gráfico de barras
  const seriesFaturamento = [
    { dataKey: "Consultas", nome: "Consultas", cor: "#1976d2" },
    { dataKey: "Procedimentos", nome: "Procedimentos", cor: "#8e24aa" },
    { dataKey: "Exames", nome: "Exames", cor: "#2e7d32" }
  ];

  // Handlers para eventos do calendário
  const handleClickEvento = (evento) => {
    console.log("Evento clicado:", evento);
    // Aqui você pode implementar ações ao clicar em um evento
  };

  const handleClickNovoEvento = (data) => {
    console.log("Novo evento em:", data);
    // Aqui você pode implementar a criação de um novo evento
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Cabeçalho de boas-vindas */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundImage:
                  "linear-gradient(90deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)",
                boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)"
              }}
            >
              <Typography variant="h5" component="h1" gutterBottom>
                Bem-vindo ao Dashboard
              </Typography>
              <Typography variant="body1">
                Este é o seu painel de controle. Aqui você pode gerenciar suas informações e
                configurações.
              </Typography>
            </Paper>
          </Grid>

          {/* Cards Estatísticos */}
          {estatisticas.map((estatistica, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CardEstatistico
                titulo={estatistica.titulo}
                valor={estatistica.valor}
                subtitulo={estatistica.subtitulo}
                icone={estatistica.icone}
                cor={estatistica.cor}
                diferenca={estatistica.diferenca}
                progresso={estatistica.progresso}
                mostrarProgresso={estatistica.mostrarProgresso}
              />
            </Grid>
          ))}

          {/* Gráfico de Linha - Atendimentos */}
          <Grid item xs={12} md={8}>
            <GraficoEstatistico
              titulo="Evolução de Atendimentos"
              descricao="Número de atendimentos realizados ao longo do tempo"
              dados={dadosAtendimentos}
              tipo="linha"
              series={seriesAtendimentos}
              altura={350}
              categoriaX="nome"
              opcoesPeriodo={opcoesPeriodo}
              periodoSelecionado="ultimos6meses"
            />
          </Grid>

          {/* Gráfico de Pizza - Distribuição */}
          <Grid item xs={12} md={4}>
            <GraficoEstatistico
              titulo="Distribuição por Tipo"
              descricao="Distribuição de atendimentos por tipo"
              dados={dadosDistribuicao}
              tipo="pizza"
              altura={350}
              categoriaX="nome"
              categoriaY="valor"
            />
          </Grid>

          {/* Calendário de Eventos */}
          <Grid item xs={12} md={5}>
            <MiniCalendario
              eventos={eventos}
              altura={400}
              onClickEvento={handleClickEvento}
              onClickNovo={handleClickNovoEvento}
              titulo="Agenda e Eventos"
            />
          </Grid>

          {/* Lista de Tarefas Pendentes */}
          <Grid item xs={12} md={7}>
            <TarefasPendentes
              tarefas={tarefas}
              onTarefaToggle={handleTarefaToggle}
              onAddTarefa={handleAddTarefa}
              titulo="Tarefas Pendentes"
              altura={400}
            />
          </Grid>

          {/* Gráfico de Barras - Faturamento */}
          <Grid item xs={12} md={7}>
            <GraficoEstatistico
              titulo="Faturamento por Categoria"
              descricao="Composição do faturamento mensal"
              dados={dadosFaturamento}
              tipo="barra"
              series={seriesFaturamento}
              altura={350}
              categoriaX="nome"
            />
          </Grid>

          {/* Lista de Atividades Recentes */}
          <Grid item xs={12} md={5}>
            <ListaAtividades
              atividades={atividades}
              titulo="Atividades Recentes"
              maxExibir={6}
              altura={350}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
