import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

// Estilização para o item de tarefa
const StyledListItem = styled(ListItem)(({ theme, completed }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  transition: "background-color 0.2s",
  position: "relative",
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  },
  ...(completed && {
    opacity: 0.7
  })
}));

// Status da tarefa com cores
const statusConfig = {
  alta: { cor: "#f44336", texto: "Alta" },
  media: { cor: "#ff9800", texto: "Média" },
  baixa: { cor: "#4caf50", texto: "Baixa" }
};

/**
 * Componente para exibir e gerenciar tarefas pendentes na dashboard
 */
const TarefasPendentes = ({
  tarefas = [],
  onTarefaToggle,
  onAddTarefa,
  titulo = "Tarefas Pendentes",
  altura,
  mostrarProgresso = true,
  mostrarAdicionar = true
}) => {
  // Estado para novas tarefas
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtroAnchorEl, setFiltroAnchorEl] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  // Calcular progresso total
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const percentualConcluido = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  // Filtrar tarefas
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "todas") return true;
    if (filtro === "concluidas") return tarefa.concluida;
    if (filtro === "pendentes") return !tarefa.concluida;
    if (["alta", "media", "baixa"].includes(filtro)) return tarefa.prioridade === filtro;
    return true;
  });

  // Manipular adição de nova tarefa
  const handleAddTarefa = () => {
    if (novaTarefa.trim() === "") return;
    if (onAddTarefa) {
      onAddTarefa({
        titulo: novaTarefa,
        concluida: false,
        prioridade: "media"
      });
      setNovaTarefa("");
    }
  };

  // Manipular eventos de tecla para o campo de texto
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTarefa();
    }
  };

  // Abrir menu de filtro
  const handleOpenFiltro = (event) => {
    setFiltroAnchorEl(event.currentTarget);
  };

  // Fechar menu de filtro
  const handleCloseFiltro = () => {
    setFiltroAnchorEl(null);
  };

  // Selecionar filtro
  const handleSelectFiltro = (filtroSelecionado) => {
    setFiltro(filtroSelecionado);
    handleCloseFiltro();
  };

  return (
    <StyledCard sx={{ height: altura }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: "medium" }}>
            {titulo}
          </Typography>
        }
        action={
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Filtrar tarefas">
              <IconButton size="small" onClick={handleOpenFiltro}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filtroAnchorEl}
              open={Boolean(filtroAnchorEl)}
              onClose={handleCloseFiltro}
            >
              <MenuItem onClick={() => handleSelectFiltro("todas")}>Todas</MenuItem>
              <MenuItem onClick={() => handleSelectFiltro("pendentes")}>Pendentes</MenuItem>
              <MenuItem onClick={() => handleSelectFiltro("concluidas")}>Concluídas</MenuItem>
              <Divider />
              <MenuItem onClick={() => handleSelectFiltro("alta")}>
                <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: statusConfig.alta.cor,
                      mr: 1
                    }}
                  />
                  Prioridade Alta
                </Box>
              </MenuItem>
              <MenuItem onClick={() => handleSelectFiltro("media")}>
                <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: statusConfig.media.cor,
                      mr: 1
                    }}
                  />
                  Prioridade Média
                </Box>
              </MenuItem>
              <MenuItem onClick={() => handleSelectFiltro("baixa")}>
                <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: statusConfig.baixa.cor,
                      mr: 1
                    }}
                  />
                  Prioridade Baixa
                </Box>
              </MenuItem>
            </Menu>
            <Tooltip title="Mais opções">
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      {mostrarProgresso && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="textSecondary">
              Progresso
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {percentualConcluido}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentualConcluido}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "rgba(0,0,0,0.08)"
            }}
          />
        </Box>
      )}

      <Divider />

      <CardContent
        sx={{
          p: 0,
          flex: 1,
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
        {tarefasFiltradas.length > 0 ? (
          <List sx={{ p: 0 }}>
            {tarefasFiltradas.map((tarefa) => {
              const { cor, texto } = statusConfig[tarefa.prioridade] || statusConfig.media;

              return (
                <StyledListItem
                  key={tarefa.id}
                  disablePadding
                  completed={tarefa.concluida}
                  secondaryAction={
                    <Chip
                      label={texto}
                      size="small"
                      sx={{
                        bgcolor: `${cor}20`,
                        color: cor,
                        fontWeight: "medium",
                        fontSize: "0.7rem"
                      }}
                    />
                  }
                >
                  <ListItemButton
                    onClick={() => onTarefaToggle && onTarefaToggle(tarefa.id)}
                    dense
                    sx={{
                      borderRadius: 1,
                      py: 1,
                      px: 1.5
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={tarefa.concluida}
                        sx={{
                          color: cor,
                          "&.Mui-checked": {
                            color: cor
                          }
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: tarefa.concluida ? "line-through" : "none",
                            color: tarefa.concluida ? "text.secondary" : "text.primary",
                            fontWeight: tarefa.concluida ? "normal" : "medium"
                          }}
                        >
                          {tarefa.titulo}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </StyledListItem>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 3
            }}
          >
            <Typography variant="body2" color="textSecondary" align="center">
              {filtro === "todas"
                ? "Nenhuma tarefa encontrada"
                : `Nenhuma tarefa ${filtro === "concluidas" ? "concluída" : filtro} encontrada`}
            </Typography>
          </Box>
        )}
      </CardContent>

      {mostrarAdicionar && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: "flex" }}>
            <TextField
              fullWidth
              placeholder="Adicionar nova tarefa"
              variant="outlined"
              size="small"
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 1, borderRadius: 2, minWidth: "auto" }}
              onClick={handleAddTarefa}
            >
              <AddIcon />
            </Button>
          </Box>
        </>
      )}
    </StyledCard>
  );
};

TarefasPendentes.propTypes = {
  /**
   * Lista de tarefas a serem exibidas
   */
  tarefas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      titulo: PropTypes.string.isRequired,
      concluida: PropTypes.bool.isRequired,
      prioridade: PropTypes.oneOf(["alta", "media", "baixa"])
    })
  ).isRequired,
  /**
   * Função chamada quando uma tarefa é marcada/desmarcada
   */
  onTarefaToggle: PropTypes.func,
  /**
   * Função chamada quando uma nova tarefa é adicionada
   */
  onAddTarefa: PropTypes.func,
  /**
   * Título do componente
   */
  titulo: PropTypes.string,
  /**
   * Altura personalizada para o card
   */
  altura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Se deve mostrar a barra de progresso
   */
  mostrarProgresso: PropTypes.bool,
  /**
   * Se deve mostrar o input para adicionar tarefas
   */
  mostrarAdicionar: PropTypes.bool
};

export default TarefasPendentes;
