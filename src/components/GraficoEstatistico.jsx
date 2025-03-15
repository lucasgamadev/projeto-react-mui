import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

// Cartão estilizado para o gráfico
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "visible"
}));

// Menu de opções estilizado
const OptionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center"
}));

/**
 * Componente para renderizar diferentes tipos de gráficos estatísticos
 */
const GraficoEstatistico = ({
  titulo,
  descricao,
  dados,
  tipo = "linha",
  cores,
  altura = 300,
  series = [],
  categoriaX = "nome",
  categoriaY = "valor",
  mostrarGrade = true,
  mostrarLegenda = true,
  onRefresh,
  opcoesPeriodo,
  periodoSelecionado,
  onPeriodoChange
}) => {
  const theme = useTheme();
  // Adicionar uma referência para o container do gráfico
  const graficoContainerRef = useRef(null);

  // Configurar cores padrão se não forem fornecidas
  const coresPadrao = cores || [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  // Função para baixar o gráfico como imagem (PNG)
  const handleDownload = () => {
    // Usar a referência para acessar o container específico deste gráfico
    if (!graficoContainerRef.current) {
      console.error("Container do gráfico não encontrado");
      return;
    }

    // Buscar o SVG apenas dentro do container referenciado
    const svg = graficoContainerRef.current.querySelector("svg");
    if (!svg) {
      console.error("SVG não encontrado no container");
      return;
    }

    try {
      // Clonar o SVG para não afetar o original
      const clonedSvg = svg.cloneNode(true);

      // Obter as dimensões do SVG - com verificação de segurança
      const svgWidth =
        svg.width && svg.width.baseVal ? svg.width.baseVal.value : svg.viewBox.baseVal.width;
      const svgHeight =
        svg.height && svg.height.baseVal ? svg.height.baseVal.value : svg.viewBox.baseVal.height;

      if (!svgWidth || !svgHeight) {
        console.error("Dimensões do SVG não disponíveis");
        return;
      }

      // Definir dimensões explícitas no SVG clonado
      clonedSvg.setAttribute("width", svgWidth);
      clonedSvg.setAttribute("height", svgHeight);

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Configurar dimensões do canvas com verificação
      canvas.width = svgWidth || 600; // Valor padrão se a largura for zero
      canvas.height = svgHeight || 400; // Valor padrão se a altura for zero

      const img = new Image();
      img.onload = () => {
        // Desenhar fundo branco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar o SVG no canvas
        ctx.drawImage(img, 0, 0);

        // Converter para PNG e baixar
        const a = document.createElement("a");
        a.download = `${titulo.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      };

      // Tratamento de erros para a conversão Base64
      try {
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
      } catch (error) {
        console.error("Erro ao converter SVG para Base64:", error);
        // Alternativa sem Base64
        img.src = `data:image/svg+xml,${encodeURIComponent(svgData)}`;
      }
    } catch (error) {
      console.error("Erro ao processar o download da imagem:", error);
    }
  };

  // Renderizar o tipo de gráfico selecionado
  const renderGrafico = () => {
    switch (tipo) {
      case "barra":
        return (
          <ResponsiveContainer width="100%" height={altura}>
            <BarChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {mostrarGrade && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              <XAxis
                dataKey={categoriaX}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)"
                }}
              />
              {mostrarLegenda && <Legend />}
              {series.length > 0 ? (
                series.map((serie, index) => (
                  <Bar
                    key={serie.dataKey || index}
                    dataKey={serie.dataKey || categoriaY}
                    name={serie.nome || serie.dataKey || categoriaY}
                    fill={serie.cor || coresPadrao[index % coresPadrao.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))
              ) : (
                <Bar dataKey={categoriaY} fill={coresPadrao[0]} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case "linha":
        return (
          <ResponsiveContainer width="100%" height={altura}>
            <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {mostrarGrade && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              <XAxis
                dataKey={categoriaX}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)"
                }}
              />
              {mostrarLegenda && <Legend />}
              {series.length > 0 ? (
                series.map((serie, index) => (
                  <Line
                    key={serie.dataKey || index}
                    type="monotone"
                    dataKey={serie.dataKey || categoriaY}
                    name={serie.nome || serie.dataKey || categoriaY}
                    stroke={serie.cor || coresPadrao[index % coresPadrao.length]}
                    strokeWidth={2}
                    dot={{
                      stroke: serie.cor || coresPadrao[index % coresPadrao.length],
                      strokeWidth: 2,
                      r: 4,
                      fill: "#fff"
                    }}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={categoriaY}
                  stroke={coresPadrao[0]}
                  strokeWidth={2}
                  dot={{ stroke: coresPadrao[0], strokeWidth: 2, r: 4, fill: "#fff" }}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={altura}>
            <AreaChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {mostrarGrade && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              <XAxis
                dataKey={categoriaX}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)"
                }}
              />
              {mostrarLegenda && <Legend />}
              {series.length > 0 ? (
                series.map((serie, index) => (
                  <Area
                    key={serie.dataKey || index}
                    type="monotone"
                    dataKey={serie.dataKey || categoriaY}
                    name={serie.nome || serie.dataKey || categoriaY}
                    stroke={serie.cor || coresPadrao[index % coresPadrao.length]}
                    fill={`${serie.cor || coresPadrao[index % coresPadrao.length]}20`}
                    strokeWidth={2}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey={categoriaY}
                  stroke={coresPadrao[0]}
                  fill={`${coresPadrao[0]}20`}
                  strokeWidth={2}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pizza":
        return (
          <ResponsiveContainer width="100%" height={altura}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={altura / 3}
                innerRadius={altura / 6}
                dataKey={categoriaY}
                nameKey={categoriaX}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {dados.map((entrada, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entrada.cor || coresPadrao[index % coresPadrao.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)"
                }}
                formatter={(value, name) => [
                  `${value} (${((value / dados.reduce((sum, entry) => sum + entry[categoriaY], 0)) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              {mostrarLegenda && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: altura,
              backgroundColor: "#f9f9f9",
              borderRadius: 2
            }}
          >
            <Typography color="textSecondary">Tipo de gráfico não suportado: {tipo}</Typography>
          </Box>
        );
    }
  };

  return (
    <StyledCard>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: "medium" }}>
            {titulo}
          </Typography>
        }
        subheader={
          descricao && (
            <Typography variant="body2" color="textSecondary">
              {descricao}
            </Typography>
          )
        }
        action={
          <OptionsContainer>
            {opcoesPeriodo && (
              <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                <Select
                  value={periodoSelecionado || ""}
                  onChange={(e) => onPeriodoChange && onPeriodoChange(e.target.value)}
                  sx={{
                    height: 32,
                    fontSize: "0.875rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider
                    }
                  }}
                >
                  {opcoesPeriodo.map((opcao) => (
                    <MenuItem key={opcao.valor} value={opcao.valor}>
                      {opcao.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {onRefresh && (
              <Tooltip title="Atualizar dados">
                <IconButton size="small" onClick={onRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Baixar como imagem">
              <IconButton size="small" onClick={handleDownload}>
                <FileDownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Mais opções">
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </OptionsContainer>
        }
      />
      <Divider />
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          position: "relative",
          "&:last-child": { pb: 2 }
        }}
      >
        <Box
          ref={graficoContainerRef}
          className="grafico-container"
          sx={{
            flex: 1,
            minHeight: altura
          }}
        >
          {renderGrafico()}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

GraficoEstatistico.propTypes = {
  /**
   * Título do gráfico
   */
  titulo: PropTypes.string.isRequired,
  /**
   * Descrição ou subtítulo opcional
   */
  descricao: PropTypes.string,
  /**
   * Dados para o gráfico
   */
  dados: PropTypes.array.isRequired,
  /**
   * Tipo de gráfico (linha, barra, area, pizza)
   */
  tipo: PropTypes.oneOf(["linha", "barra", "area", "pizza"]),
  /**
   * Cores personalizadas para o gráfico
   */
  cores: PropTypes.array,
  /**
   * Altura do gráfico em pixels
   */
  altura: PropTypes.number,
  /**
   * Séries de dados para gráficos com múltiplas séries
   */
  series: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      nome: PropTypes.string,
      cor: PropTypes.string
    })
  ),
  /**
   * Nome da propriedade a ser usada como categoria do eixo X
   */
  categoriaX: PropTypes.string,
  /**
   * Nome da propriedade a ser usada como valor do eixo Y
   */
  categoriaY: PropTypes.string,
  /**
   * Se deve mostrar as linhas de grade
   */
  mostrarGrade: PropTypes.bool,
  /**
   * Se deve mostrar a legenda
   */
  mostrarLegenda: PropTypes.bool,
  /**
   * Função a ser chamada ao clicar no botão de atualizar
   */
  onRefresh: PropTypes.func,
  /**
   * Opções de período para filtragem
   */
  opcoesPeriodo: PropTypes.arrayOf(
    PropTypes.shape({
      valor: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  /**
   * Valor selecionado nas opções de período
   */
  periodoSelecionado: PropTypes.string,
  /**
   * Função a ser chamada quando o período selecionado mudar
   */
  onPeriodoChange: PropTypes.func
};

export default GraficoEstatistico;
