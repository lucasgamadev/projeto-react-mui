import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import ExameModel from "../../models/ExameModel";

const TipoExameForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preparoNecessario: "",
    categoria: "Geral"
  });

  const [parametros, setParametros] = useState([]);
  const [novoParametro, setNovoParametro] = useState({
    nome: "",
    minimo: "",
    maximo: "",
    unidade: ""
  });
  const [alerta, setAlerta] = useState({ aberto: false, tipo: "success", mensagem: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleParametroChange = (e) => {
    const { name, value } = e.target;
    setNovoParametro({
      ...novoParametro,
      [name]: value
    });
  };

  const adicionarParametro = () => {
    if (!novoParametro.nome) return;

    setParametros([...parametros, { ...novoParametro }]);
    setNovoParametro({ nome: "", minimo: "", maximo: "", unidade: "" });
  };

  const removerParametro = (index) => {
    const novosParametros = [...parametros];
    novosParametros.splice(index, 1);
    setParametros(novosParametros);
  };

  const fecharAlerta = () => {
    setAlerta({ ...alerta, aberto: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Converter array de parâmetros para objeto de valores de referência
      const valoresReferencia = {};
      parametros.forEach((parametro) => {
        valoresReferencia[parametro.nome] = {
          minimo: parametro.minimo,
          maximo: parametro.maximo,
          unidade: parametro.unidade
        };
      });

      const tipoExame = {
        ...formData,
        valoresReferencia
      };

      await ExameModel.cadastrarTipoExame(tipoExame);

      setAlerta({
        aberto: true,
        tipo: "success",
        mensagem: "Tipo de exame cadastrado com sucesso!"
      });

      // Limpar formulário
      setFormData({
        nome: "",
        descricao: "",
        preparoNecessario: "",
        categoria: "Geral"
      });
      setParametros([]);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao cadastrar tipo de exame:", error);
      setAlerta({
        aberto: true,
        tipo: "error",
        mensagem: "Erro ao cadastrar tipo de exame. Tente novamente."
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Cadastro de Tipo de Exame" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Exame"
                name="nome"
                onChange={handleChange}
                required
                value={formData.nome}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Categoria"
                name="categoria"
                onChange={handleChange}
                value={formData.categoria}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                onChange={handleChange}
                required
                value={formData.descricao}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preparo Necessário"
                name="preparoNecessario"
                onChange={handleChange}
                value={formData.preparoNecessario}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Valores de Referência
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Nome do Parâmetro"
                      name="nome"
                      value={novoParametro.nome}
                      onChange={handleParametroChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Valor Mínimo"
                      name="minimo"
                      type="number"
                      value={novoParametro.minimo}
                      onChange={handleParametroChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Valor Máximo"
                      name="maximo"
                      type="number"
                      value={novoParametro.maximo}
                      onChange={handleParametroChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Unidade"
                      name="unidade"
                      value={novoParametro.unidade}
                      onChange={handleParametroChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={adicionarParametro}
                      disabled={!novoParametro.nome}
                    >
                      Adicionar
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {parametros.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Parâmetros Adicionados:
                  </Typography>

                  {parametros.map((parametro, index) => (
                    <Chip
                      key={index}
                      label={`${parametro.nome} (${parametro.minimo} - ${parametro.maximo} ${parametro.unidade})`}
                      onDelete={() => removerParametro(index)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button color="primary" variant="contained" type="submit">
            Cadastrar Tipo de Exame
          </Button>
        </Box>
      </Card>

      <Snackbar open={alerta.aberto} autoHideDuration={6000} onClose={fecharAlerta}>
        <Alert onClose={fecharAlerta} severity={alerta.tipo} sx={{ width: "100%" }}>
          {alerta.mensagem}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default TipoExameForm;
