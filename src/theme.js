import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Azul Material Design
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#9c27b0", // Roxo Material Design
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#ffffff"
    },
    background: {
      default: "#f4f4f4",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: "2.5rem"
    },
    h2: {
      fontWeight: 500,
      fontSize: "2rem"
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.75rem"
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem"
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem"
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem"
    },
    button: {
      textTransform: "none",
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }
      }
    }
  }
});

export default theme;
