import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { ProntuarioProvider } from "./contexts/ProntuarioContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <ProntuarioProvider>
              <DashboardProvider>
                <AppRoutes />
              </DashboardProvider>
            </ProntuarioProvider>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
