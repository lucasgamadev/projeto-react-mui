import {
  Add as AddIcon,
  CalendarToday as CalendarTodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  EventAvailable as EventAvailableIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers/";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addMonths, format, isAfter, isBefore, isSameDay, isToday, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import PropTypes from "prop-types";
import React, { useState } from "react";

// Estilização para o cartão
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column"
}));

// Estilização para o dia do calendário
const StyledDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "hasEvent" && prop !== "isSelected"
})(({ theme, hasEvent, isSelected }) => ({
  ...(hasEvent && {
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      backgroundColor: isSelected ? theme.palette.common.white : theme.palette.primary.main,
      position: "absolute",
      bottom: "2px"
    }
  })
}));

// Estilização para o item de evento
const EventItem = styled(ListItem)(({ theme, isCompleted }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1, 1),
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  },
  ...(isCompleted && {
    opacity: 0.7
  })
}));

// Formatar hora com base na data
const formatarHora = (data) => {
  // Verificar se a data é válida antes de formatar
  try {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "--:--";
    }
    return format(dataObj, "HH:mm");
  } catch (e) {
    console.error("Erro ao formatar hora:", e);
    return "--:--";
  }
};

// Função para formatar datas com segurança
const formatarDataSegura = (data, formatoString, opcoesLocale = {}) => {
  try {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "Data inválida";
    }
    return format(dataObj, formatoString, opcoesLocale);
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return "Data inválida";
  }
};

/**
 * Componente MiniCalendario para exibir um calendário com eventos na dashboard
 */
const MiniCalendario = ({
  eventos = [],
  altura,
  onClickEvento,
  onClickNovo,
  filtrarAntigos = true,
  titulo = "Calendário",
  limiteLista = 3,
  mostrarAdicionar = true
}) => {
  const theme = useTheme();
  const hoje = startOfDay(new Date());

  // Estado para a data selecionada
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [dataCalendario, setDataCalendario] = useState(hoje);
  const [visualizacao, setVisualizacao] = useState("calendario"); // 'calendario' ou 'lista'

  // Filtrar eventos com base na data atual
  const eventosFiltrados = eventos
    .filter((evento) => {
      try {
        const eventoData = new Date(evento.data);
        // Verificar se a data é válida
        if (isNaN(eventoData.getTime())) return false;

        return !filtrarAntigos || !isBefore(eventoData, hoje);
      } catch (e) {
        console.error("Erro ao filtrar evento:", e);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const dataA = new Date(a.data);
        const dataB = new Date(b.data);
        if (isNaN(dataA.getTime()) || isNaN(dataB.getTime())) return 0;
        return dataA - dataB;
      } catch (e) {
        return 0;
      }
    });

  // Eventos do dia selecionado
  const eventosDoDia = eventosFiltrados.filter((evento) => {
    try {
      const eventoData = new Date(evento.data);
      if (isNaN(eventoData.getTime())) return false;
      return isSameDay(eventoData, dataSelecionada);
    } catch (e) {
      return false;
    }
  });

  // Próximos eventos
  const proximosEventos = eventosFiltrados
    .filter((evento) => {
      try {
        const eventoData = new Date(evento.data);
        if (isNaN(eventoData.getTime())) return false;
        return isAfter(eventoData, hoje) || isToday(eventoData);
      } catch (e) {
        return false;
      }
    })
    .slice(0, limiteLista);

  // Verificar se uma data tem eventos
  const verificarDataComEvento = (data) => {
    if (!data || isNaN(new Date(data).getTime())) return false;

    return eventosFiltrados.some((evento) => {
      try {
        const eventoData = new Date(evento.data);
        if (isNaN(eventoData.getTime())) return false;
        return isSameDay(eventoData, data);
      } catch (e) {
        return false;
      }
    });
  };

  // Renderizar o dia customizado
  const renderDiaCustomizado = (date, selectedDates, pickersDayProps) => {
    // Verificar se date é válido antes de tentar acessar getTime
    if (!date) {
      return pickersDayProps ? <PickersDay {...pickersDayProps} /> : null;
    }

    // Verificar se date possui o método getTime
    try {
      if (typeof date.getTime !== "function") {
        return pickersDayProps ? <PickersDay {...pickersDayProps} /> : null;
      }

      if (isNaN(date.getTime())) {
        // Retornar um componente padrão se a data for inválida
        return pickersDayProps ? <PickersDay {...pickersDayProps} /> : null;
      }
    } catch (error) {
      // Se ocorrer qualquer erro, retornar o componente padrão
      return pickersDayProps ? <PickersDay {...pickersDayProps} /> : null;
    }

    const hasEvent = verificarDataComEvento(date);
    return (
      <StyledDay
        {...pickersDayProps}
        hasEvent={hasEvent}
        isSelected={pickersDayProps?.selected || false}
      />
    );
  };

  // Manipular alteração de mês
  const handleProximoMes = () => {
    setDataCalendario(addMonths(dataCalendario, 1));
  };

  const handleMesAnterior = () => {
    setDataCalendario(addMonths(dataCalendario, -1));
  };

  // Manipular clique no evento
  const handleClickEvento = (evento) => {
    if (onClickEvento) {
      onClickEvento(evento);
    }
  };

  // Alternar entre visualizações
  const alternarVisualizacao = () => {
    setVisualizacao(visualizacao === "calendario" ? "lista" : "calendario");
  };

  return (
    <StyledCard sx={{ height: altura }}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "medium" }}>
              {titulo}
            </Typography>
            <Box>
              <Tooltip
                title={visualizacao === "calendario" ? "Ver lista de eventos" : "Ver calendário"}
              >
                <IconButton size="small" onClick={alternarVisualizacao}>
                  {visualizacao === "calendario" ? (
                    <EventIcon fontSize="small" />
                  ) : (
                    <CalendarTodayIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Mais opções">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
      />
      <Divider />
      <CardContent
        sx={{
          flex: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "3px"
          }
        }}
      >
        {visualizacao === "calendario" ? (
          <>
            <Box
              sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <IconButton size="small" onClick={handleMesAnterior}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                {formatarDataSegura(dataCalendario, "MMMM yyyy", { locale: ptBR })}
              </Typography>
              <IconButton size="small" onClick={handleProximoMes}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DateCalendar
                value={dataSelecionada}
                onChange={(novaData) => setDataSelecionada(novaData)}
                slots={{
                  day: renderDiaCustomizado
                }}
                slotProps={{
                  actionBar: { hidden: true },
                  toolbar: { hidden: true }
                }}
                sx={{
                  "& .MuiPickersCalendarHeader-root": { display: "none" },
                  "& .MuiDayCalendar-header": {
                    marginTop: 0,
                    paddingBottom: 1
                  },
                  "& .MuiPickersDay-root": {
                    fontWeight: "normal",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: "bold"
                    }
                  }
                }}
              />
            </LocalizationProvider>
            <Divider />
            <Box sx={{ p: 2, flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  {eventosDoDia.length > 0
                    ? `Eventos em ${formatarDataSegura(dataSelecionada, "dd/MM/yyyy")}`
                    : `Nenhum evento em ${formatarDataSegura(dataSelecionada, "dd/MM/yyyy")}`}
                </Typography>
                {mostrarAdicionar && (
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onClickNovo && onClickNovo(dataSelecionada)}
                    sx={{ textTransform: "none" }}
                  >
                    Novo
                  </Button>
                )}
              </Box>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 1,
                  minHeight: 120,
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider
                }}
              >
                {eventosDoDia.length > 0 ? (
                  <List disablePadding>
                    {eventosDoDia.map((evento) => (
                      <EventItem
                        key={evento.id}
                        button
                        onClick={() => handleClickEvento(evento)}
                        data-is-completed={evento.concluido ? "true" : "false"}
                        sx={{
                          opacity: evento.concluido ? 0.7 : 1
                        }}
                        disablePadding
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: evento.cor || theme.palette.primary.main,
                              color: "#fff"
                            }}
                          >
                            {evento.icone || <EventAvailableIcon fontSize="small" />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "medium",
                                textDecoration: evento.concluido ? "line-through" : "none"
                              }}
                            >
                              {evento.titulo}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="textSecondary">
                              {formatarHora(evento.data)}
                              {evento.local && ` • ${evento.local}`}
                            </Typography>
                          }
                        />
                        {evento.tipo && (
                          <Chip
                            label={evento.tipo}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.7rem",
                              bgcolor: `${evento.cor || theme.palette.primary.main}20`,
                              color: evento.cor || theme.palette.primary.main,
                              fontWeight: "medium"
                            }}
                          />
                        )}
                      </EventItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2
                    }}
                  >
                    <Typography variant="body2" color="textSecondary" align="center">
                      Nenhum evento nesta data
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2, flex: 1 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                {proximosEventos.length > 0 ? "Próximos eventos" : "Nenhum evento próximo"}
              </Typography>
              {mostrarAdicionar && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => onClickNovo && onClickNovo(hoje)}
                  sx={{ textTransform: "none" }}
                >
                  Novo
                </Button>
              )}
            </Box>

            {proximosEventos.length > 0 ? (
              <List disablePadding>
                {proximosEventos.map((evento) => (
                  <React.Fragment key={evento.id}>
                    <EventItem
                      button
                      onClick={() => handleClickEvento(evento)}
                      data-is-completed={evento.concluido ? "true" : "false"}
                      sx={{
                        opacity: evento.concluido ? 0.7 : 1
                      }}
                      disablePadding
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: evento.cor || theme.palette.primary.main,
                            color: "#fff"
                          }}
                        >
                          {evento.icone || <EventAvailableIcon fontSize="small" />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              textDecoration: evento.concluido ? "line-through" : "none"
                            }}
                          >
                            {evento.titulo}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            {formatarDataSegura(new Date(evento.data), "dd/MM/yyyy")} •{" "}
                            {formatarHora(evento.data)}
                            {evento.local && ` • ${evento.local}`}
                          </Typography>
                        }
                      />
                      {evento.tipo && (
                        <Chip
                          label={evento.tipo}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.7rem",
                            bgcolor: `${evento.cor || theme.palette.primary.main}20`,
                            color: evento.cor || theme.palette.primary.main,
                            fontWeight: "medium"
                          }}
                        />
                      )}
                    </EventItem>
                    <Divider variant="inset" component="li" sx={{ my: 0.5 }} />
                  </React.Fragment>
                ))}

                {/* Botão "Ver todos" */}
                {eventosFiltrados.length > limiteLista && (
                  <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => onClickEvento && onClickEvento(null, "todos")}
                      sx={{ textTransform: "none" }}
                    >
                      Ver todos ({eventosFiltrados.length})
                    </Button>
                  </Box>
                )}
              </List>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  height: "80%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography variant="body2" color="textSecondary" align="center">
                  Nenhum evento próximo encontrado
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

MiniCalendario.propTypes = {
  /**
   * Lista de eventos a serem exibidos
   */
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      titulo: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      local: PropTypes.string,
      tipo: PropTypes.string,
      concluido: PropTypes.bool,
      cor: PropTypes.string,
      icone: PropTypes.node
    })
  ).isRequired,
  /**
   * Altura personalizada para o card
   */
  altura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Função chamada ao clicar em um evento
   */
  onClickEvento: PropTypes.func,
  /**
   * Função chamada ao clicar no botão "Novo"
   */
  onClickNovo: PropTypes.func,
  /**
   * Se deve filtrar eventos antigos
   */
  filtrarAntigos: PropTypes.bool,
  /**
   * Título do componente
   */
  titulo: PropTypes.string,
  /**
   * Número máximo de eventos a serem exibidos na lista
   */
  limiteLista: PropTypes.number,
  /**
   * Se deve mostrar o botão para adicionar novo evento
   */
  mostrarAdicionar: PropTypes.bool
};

export default MiniCalendario;
