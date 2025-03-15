import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

// Estilização para o card
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  borderRadius: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column"
}));

// Estilização para o item da lista
const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  transition: "background-color 0.3s",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));

// Formatação da data relativa
const formatarDataRelativa = (data) => {
  const agora = new Date();
  const dataAtividade = new Date(data);
  const diffMs = agora - dataAtividade;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return diffDay === 1 ? "Ontem" : `${diffDay} dias atrás`;
  } else if (diffHour > 0) {
    return `${diffHour} hora${diffHour > 1 ? "s" : ""} atrás`;
  } else if (diffMin > 0) {
    return `${diffMin} minuto${diffMin > 1 ? "s" : ""} atrás`;
  } else {
    return "Agora mesmo";
  }
};

/**
 * Componente para exibir uma lista de atividades recentes na dashboard
 */
const ListaAtividades = ({ atividades, titulo = "Atividades Recentes", maxExibir = 5, altura }) => {
  // Exibir apenas o número máximo de atividades
  const atividadesFiltradas = atividades.slice(0, maxExibir);

  return (
    <StyledCard sx={{ height: altura }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: "medium" }}>
            {titulo}
          </Typography>
        }
        action={
          <Tooltip title="Mais opções">
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <Divider />
      <CardContent
        sx={{
          p: 0,
          flex: 1,
          overflowY: atividades.length > 4 ? "auto" : "visible",
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
        {atividadesFiltradas.length > 0 ? (
          <List disablePadding>
            {atividadesFiltradas.map((atividade, index) => (
              <React.Fragment key={atividade.id || index}>
                <StyledListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: atividade.corAvatar || "primary.main",
                        color: "#fff"
                      }}
                    >
                      {atividade.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                          {atividade.titulo}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatarDataRelativa(atividade.data)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        {atividade.descricao}
                      </Typography>
                    }
                  />
                </StyledListItem>
                {index < atividadesFiltradas.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
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
              Nenhuma atividade recente encontrada
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

ListaAtividades.propTypes = {
  /**
   * Lista de atividades a serem exibidas
   */
  atividades: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      titulo: PropTypes.string.isRequired,
      descricao: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      avatar: PropTypes.node.isRequired,
      corAvatar: PropTypes.string
    })
  ).isRequired,
  /**
   * Título do componente
   */
  titulo: PropTypes.string,
  /**
   * Número máximo de atividades a serem exibidas
   */
  maxExibir: PropTypes.number,
  /**
   * Altura personalizada para o card
   */
  altura: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ListaAtividades;
