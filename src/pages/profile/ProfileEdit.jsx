import { PhotoCamera as PhotoCameraIcon, Save as SaveIcon } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ProfileEdit = ({ user, onCancel, onSave }) => {
  // Em produção, essas informações viriam da API/backend
  // Por enquanto, usamos dados mockados para demonstração
  const initialData = {
    username: user?.username || "admin",
    nome: "Administrador",
    email: "admin@exemplo.com.br",
    cargo: "Gerente",
    departamento: "TI",
    telefone: "(11) 99999-9999",
    endereco: "Av. Paulista, 1000, São Paulo - SP"
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user: authUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validação simples
    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setErrors({ ...errors, email: "Email inválido" });
    } else if (name === "email") {
      const { email, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação do formulário
    let formErrors = {};

    if (!formData.nome) {
      formErrors.nome = "Nome é obrigatório";
    }

    if (!formData.email) {
      formErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email inválido";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Em produção, aqui enviaríamos os dados para a API
    console.log("Dados do perfil atualizados:", formData);
    setOpenSnackbar(true);

    // Simulando atualização bem sucedida
    setTimeout(() => {
      onSave();
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.02)"
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mb: { xs: 2, sm: 0 },
              mr: { xs: 0, sm: 4 },
              border: "4px solid white",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          >
            {formData.nome.charAt(0)}
          </Avatar>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{
              position: "absolute",
              bottom: { xs: 10, sm: 5 },
              right: { xs: "calc(50% - 75px)", sm: 0 },
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f5f5f5" }
            }}
          >
            <input hidden accept="image/*" type="file" />
            <PhotoCameraIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
          <TextField
            label="Nome Completo"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
            error={!!errors.nome}
            helperText={errors.nome}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { fontWeight: "bold" }
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box sx={{ px: 3, pb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom mb={3}>
          Informações do Usuário
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} disabled>
              <InputLabel htmlFor="username-input">Nome de Usuário</InputLabel>
              <OutlinedInput
                id="username-input"
                name="username"
                value={formData.username}
                label="Nome de Usuário"
                endAdornment={
                  <InputAdornment position="end">
                    <Typography variant="caption" color="text.secondary">
                      Não editável
                    </Typography>
                  </InputAdornment>
                }
              />
              <FormHelperText>O nome de usuário não pode ser alterado</FormHelperText>
            </FormControl>

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Endereço"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="inherit" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
            Salvar Alterações
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Perfil atualizado com sucesso!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

ProfileEdit.propTypes = {
  user: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ProfileEdit;
