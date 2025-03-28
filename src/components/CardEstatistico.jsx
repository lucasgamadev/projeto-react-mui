import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Tooltip,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

// Estilização para o card
const StyledCard = styled(Card)(({ theme, color }) => ({
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  borderRadius: theme.spacing(2),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 25px 0 rgba(0, 0, 0, 0.1)"
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: color || theme.palette.primary.main
  }
}));

// Estilização para o ícone
const IconContainer = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: color ? `${color}20` : `${theme.palette.primary.main}20`,
  color: color || theme.palette.primary.main,
  width: 56,
  height: 56,
  boxShadow: `0 4px 10px 0 ${color ? `${color}40` : `${theme.palette.primary.main}40`}`
}));

// Estilização para a comparação (mudança percentual)
const Difference = styled(Typography)(({ theme, isPositive }) => ({
  backgroundColor: isPositive ? theme.palette.success.light : theme.palette.error.light,
  color: isPositive ? theme.palette.success.dark : theme.palette.error.dark,
  padding: "2px 8px",
  borderRadius: 12,
  fontSize: "0.75rem",
  fontWeight: 600,
  display: "inline-block",
  marginLeft: theme.spacing(1)
}));

/**
 * Componente de Card Estatístico para exibir informações de estatísticas na dashboard
 */
const CardEstatistico = ({
  titulo,
  valor,
  subtitulo,
  icone,
  cor,
  diferenca,
  mostrarDiferenca = true,
  progresso,
  mostrarProgresso = false
}) => {
  // Determina se a diferença é positiva (para a cor)
  const isPositive = diferenca && diferenca > 0;

  return (
    <StyledCard color={cor}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {titulo}
            </Typography>
            <Box display="flex" alignItems="center" mb={0.5}>
              <Typography variant="h4" color="textPrimary" sx={{ fontWeight: "bold" }}>
                {valor}
              </Typography>
              {mostrarDiferenca && diferenca && (
                <Tooltip
                  title={`${isPositive ? "Aumento" : "Diminuição"} de ${Math.abs(diferenca)}%`}
                >
                  <Difference
                    data-is-positive={isPositive ? "true" : "false"}
                    sx={{ "&": isPositive ? {} : {} }}
                  >
                    {isPositive ? "+" : ""}
                    {diferenca}%
                  </Difference>
                </Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="textSecondary">
              {subtitulo}
            </Typography>
            {mostrarProgresso && progresso !== undefined && (
              <Box mt={2}>
                <LinearProgress
                  variant="determinate"
                  value={progresso}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${cor || "#1976d2"}20`,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: cor || "#1976d2"
                    }
                  }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {progresso}% Completo
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconContainer color={cor}>{icone}</IconContainer>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

CardEstatistico.propTypes = {
  /**
   * Título do card estatístico
   */
  titulo: PropTypes.string.isRequired,
  /**
   * Valor principal a ser exibido
   */
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /**
   * Subtítulo ou descrição adicional
   */
  subtitulo: PropTypes.string,
  /**
   * Ícone do Material-UI a ser exibido
   */
  icone: PropTypes.node.isRequired,
  /**
   * Cor personalizada (código hexadecimal ou nome de cor)
   */
  cor: PropTypes.string,
  /**
   * Diferença percentual (para mostrar aumento/diminuição)
   */
  diferenca: PropTypes.number,
  /**
   * Se deve mostrar a diferença percentual
   */
  mostrarDiferenca: PropTypes.bool,
  /**
   * Valor de progresso (0-100)
   */
  progresso: PropTypes.number,
  /**
   * Se deve mostrar a barra de progresso
   */
  mostrarProgresso: PropTypes.bool
};

export default CardEstatistico;
