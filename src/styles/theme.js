import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff"
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff"
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828"
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100"
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b"
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20"
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121"
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
      dark: "#1a2027"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)"
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
      lineHeight: 1.2
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 300,
      lineHeight: 1.2
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 400,
      lineHeight: 1.2
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.2
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 400,
      lineHeight: 1.2
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "uppercase"
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: "uppercase"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        },
        containedPrimary: {
          boxShadow: "0 4px 6px rgba(25, 118, 210, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 10px rgba(25, 118, 210, 0.35)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.07)"
        },
        elevation2: {
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.06), 0px 6px 10px rgba(0, 0, 0, 0.08)"
        },
        elevation3: {
          boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.07), 0px 8px 14px rgba(0, 0, 0, 0.1)"
        },
        rounded: {
          borderRadius: 12
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.07)"
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 500,
          backgroundColor: "rgba(25, 118, 210, 0.05)"
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  },
  mixins: {
    toolbar: {
      minHeight: 64
    }
  }
});

export default theme;
