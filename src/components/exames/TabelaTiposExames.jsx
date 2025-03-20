import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import ExameModel from "../../models/ExameModel";

const TabelaTiposExames = ({ onEdit, onDelete, onView }) => {
  const [tiposExames, setTiposExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarTiposExames();
  }, []);

  const carregarTiposExames = async () => {
    try {
      setLoading(true);
      const tipos = await ExameModel.listarTiposExames();
      setTiposExames(tipos);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar tipos de exames:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeFiltro = (event) => {
    setFiltro(event.target.value);
    setPage(0);
  };

  const tiposFiltrados = tiposExames.filter(
    (tipo) =>
      tipo.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      tipo.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
      tipo.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  const tiposPaginados = tiposFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar tipo de exame..."
          value={filtro}
          onChange={handleChangeFiltro}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Preparo Necessário</TableCell>
              <TableCell>Parâmetros</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Carregando tipos de exames...
                </TableCell>
              </TableRow>
            ) : tiposPaginados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum tipo de exame encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tiposPaginados.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {tipo.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tipo.descricao}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={tipo.categoria} size="small" />
                  </TableCell>
                  <TableCell>{tipo.preparoNecessario || "Nenhum"}</TableCell>
                  <TableCell>
                    {tipo.valoresReferencia ? Object.keys(tipo.valoresReferencia).length : 0}{" "}
                    parâmetros
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar detalhes">
                      <IconButton onClick={() => onView && onView(tipo)} size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => onEdit && onEdit(tipo)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => onDelete && onDelete(tipo)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tiposFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>
    </Box>
  );
};

export default TabelaTiposExames;
