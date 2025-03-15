import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VpnKey as VpnKeyIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  Typography
} from "@mui/material";
import React, { useState } from "react";

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    // Limpar erros ao digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }

    // Validar confirmação de senha em tempo real
    if (name === "confirmPassword" || (name === "newPassword" && passwordData.confirmPassword)) {
      if (
        (name === "confirmPassword" && value !== passwordData.newPassword) ||
        (name === "newPassword" && value !== passwordData.confirmPassword)
      ) {
        setErrors({
          ...errors,
          confirmPassword: "As senhas não coincidem"
        });
      } else {
        const { confirmPassword, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "A senha atual é obrigatória";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "A nova senha é obrigatória";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "A senha deve ter pelo menos 6 caracteres";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (passwordData.currentPassword === passwordData.newPassword && passwordData.currentPassword) {
      newErrors.newPassword = "A nova senha deve ser diferente da senha atual";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    // Simulando chamada de API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setOpenSnackbar(true);

      // Limpar formulário após sucesso
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Resetar estado de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.02)"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <VpnKeyIcon color="primary" sx={{ mr: 2 }} />
          <Typography variant="h6" component="h3">
            Alterar Senha
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Para sua segurança, escolha uma senha forte que você não use em outro lugar. Recomendamos
          uma combinação de letras, números e símbolos.
        </Typography>
      </Paper>

      <Box component="form" onSubmit={handleSubmit} sx={{ px: 3, pb: 3 }}>
        <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.currentPassword}>
          <InputLabel htmlFor="current-password">Senha Atual</InputLabel>
          <OutlinedInput
            id="current-password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => togglePasswordVisibility("current")}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="Senha Atual"
          />
          {errors.currentPassword && (
            <FormHelperText error>{errors.currentPassword}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.newPassword}>
          <InputLabel htmlFor="new-password">Nova Senha</InputLabel>
          <OutlinedInput
            id="new-password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => togglePasswordVisibility("new")}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="Nova Senha"
          />
          {errors.newPassword ? (
            <FormHelperText error>{errors.newPassword}</FormHelperText>
          ) : (
            <FormHelperText>
              Use pelo menos 6 caracteres com uma combinação de letras, números e símbolos.
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.confirmPassword}>
          <InputLabel htmlFor="confirm-password">Confirmar Nova Senha</InputLabel>
          <OutlinedInput
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => togglePasswordVisibility("confirm")}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirmar Nova Senha"
          />
          {errors.confirmPassword && (
            <FormHelperText error>{errors.confirmPassword}</FormHelperText>
          )}
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || success}
            sx={{ minWidth: 180 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : success ? (
              "Senha Alterada"
            ) : (
              "Alterar Senha"
            )}
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Sua senha foi alterada com sucesso!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ChangePassword;
