import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import React, { createContext, useContext, useState } from "react";
import baseTheme from "../theme";

// Chave para armazenar o tema no localStorage
const THEME_MODE_KEY = "app-theme-mode";

// Contexto para gerenciar o tema
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Verifica se há um modo de tema salvo no localStorage
  const [mode, setMode] = useState(
    localStorage.getItem(THEME_MODE_KEY) === "dark" ? "dark" : "light"
  );

  // Criar tema com base no modo (claro ou escuro)
  const theme = React.useMemo(() => {
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode,
        ...(mode === "dark" && {
          background: {
            default: "#121212",
            paper: "#1e1e1e"
          },
          text: {
            primary: "#fff",
            secondary: "rgba(255, 255, 255, 0.7)"
          }
        })
      }
    });
  }, [mode]);

  // Alternar entre os modos claro e escuro
  const toggleThemeMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
  };

  // Definir modo escuro
  const setDarkMode = (enabled) => {
    const newMode = enabled ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
  };

  return (
    <ThemeContext.Provider
      value={{ mode, isDarkMode: mode === "dark", toggleThemeMode, setDarkMode }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};
