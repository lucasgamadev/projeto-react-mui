import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";

const UserFormModal = ({ open, onClose, onSave }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    role: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });

    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const validate = () => {
    const newErrors = {
      name: !user.name,
      email: !user.email || !/^\S+@\S+\.\S+$/.test(user.email),
      role: !user.role
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        ...user,
        id: Date.now() // ID temporário, em uma aplicação real seria gerado pelo backend
      });

      // Limpar formulário
      setUser({
        name: "",
        email: "",
        role: ""
      });

      onClose();
    }
  };

  const handleCancel = () => {
    // Limpar formulário ao cancelar
    setUser({
      name: "",
      email: "",
      role: ""
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Adicionar Novo Usuário</Typography>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Nome"
              value={user.name}
              onChange={handleChange}
              fullWidth
              required
              error={errors.name}
              helperText={errors.name ? "Nome é obrigatório" : ""}
              margin="normal"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
              required
              error={errors.email}
              helperText={errors.email ? "Email válido é obrigatório" : ""}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required error={errors.role} margin="normal">
              <InputLabel>Função</InputLabel>
              <Select name="role" value={user.role} onChange={handleChange} label="Função">
                <MenuItem value="Admin">Administrador</MenuItem>
                <MenuItem value="User">Usuário</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  Selecione uma função
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleCancel} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;
