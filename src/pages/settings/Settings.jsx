import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export const Settings = () => {
  const { isDarkMode, setDarkMode } = useTheme();
  const [showFeedback, setShowFeedback] = useState(false);

  const [settings, setSettings] = useState({
    darkMode: isDarkMode,
    notifications: true,
    emailNotifications: true,
    language: "pt-BR"
  });

  // Atualiza as configurações quando o tema muda
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  const handleChange = (event) => {
    const { name, checked, value } = event.target;

    // Atualiza o estado local
    setSettings((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));

    // Se for o modo escuro, atualiza também o contexto de tema
    if (name === "darkMode") {
      setDarkMode(checked);
    }
  };

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    console.log("Configurações salvas:", settings);
    setShowFeedback(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aparência
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={settings.darkMode} onChange={handleChange} name="darkMode" />
              }
              label="Modo Escuro"
            />
          </FormGroup>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notificações
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleChange}
                  name="notifications"
                />
              }
              label="Notificações Push"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  name="emailNotifications"
                />
              }
              label="Notificações por Email"
            />
          </FormGroup>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Idioma
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="language-select-label">Idioma</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={settings.language}
              name="language"
              label="Idioma"
              onChange={handleChange}
            >
              <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
              <MenuItem value="en-US">English (United States)</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ px: 4 }}>
            Salvar
          </Button>
        </Box>
      </Stack>

      <Snackbar
        open={showFeedback}
        autoHideDuration={3000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFeedback} severity="success" sx={{ width: "100%" }}>
          Configurações salvas com sucesso!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
