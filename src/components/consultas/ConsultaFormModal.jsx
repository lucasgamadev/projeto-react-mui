import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ptBR from "date-fns/locale/pt-BR";
import { useEffect, useRef, useState } from "react";

// Lista de médicos para o sistema (em um sistema real, seria buscado do banco de dados)
const medicos = [
  { id: 1, nome: "Dr. João Cardoso", especialidade: "Cardiologia" },
  { id: 2, nome: "Dra. Ana Pereira", especialidade: "Dermatologia" },
  { id: 3, nome: "Dr. Roberto Santos", especialidade: "Ortopedia" },
  { id: 4, nome: "Dra. Mariana Lima", especialidade: "Pediatria" }
];

// Status possíveis para a consulta
const statusOptions = ["Agendada", "Confirmada", "Cancelada", "Realizada"];

const ConsultaFormModal = ({ open, onClose, onSave }) => {
  const pacienteInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Pequeno delay para garantir que o modal esteja completamente renderizado
      setTimeout(() => {
        pacienteInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const [consulta, setConsulta] = useState({
    paciente: "",
    data: null,
    horario: null,
    medico: "",
    especialidade: "",
    status: "Agendada" // Status padrão
  });

  const [errors, setErrors] = useState({
    paciente: false,
    data: false,
    horario: false,
    medico: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsulta({
      ...consulta,
      [name]: value
    });

    // Atualiza a especialidade conforme o médico selecionado
    if (name === "medico") {
      const medicoSelecionado = medicos.find((m) => m.nome === value);
      if (medicoSelecionado) {
        setConsulta((prev) => ({
          ...prev,
          especialidade: medicoSelecionado.especialidade
        }));
      }
    }

    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleDateChange = (newDate) => {
    setConsulta({
      ...consulta,
      data: newDate
    });

    // Limpar erro quando o usuário selecionar uma data
    if (errors.data) {
      setErrors({
        ...errors,
        data: false
      });
    }
  };

  const handleTimeChange = (newTime) => {
    setConsulta({
      ...consulta,
      horario: newTime
    });

    // Limpar erro quando o usuário selecionar um horário
    if (errors.horario) {
      setErrors({
        ...errors,
        horario: false
      });
    }
  };

  const validate = () => {
    const newErrors = {
      paciente: !consulta.paciente,
      data: !consulta.data,
      horario: !consulta.horario,
      medico: !consulta.medico
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validate()) {
      // Formatar a data para o formato BR
      const formattedDate = consulta.data
        ? `${consulta.data.getDate().toString().padStart(2, "0")}/${(consulta.data.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${consulta.data.getFullYear()}`
        : "";

      // Formatar horário como HH:MM
      const formattedTime = consulta.horario
        ? `${consulta.horario.getHours().toString().padStart(2, "0")}:${consulta.horario
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        : "";

      onSave({
        ...consulta,
        data: formattedDate,
        horario: formattedTime,
        id: Date.now() // ID temporário, em uma aplicação real seria gerado pelo backend
      });

      // Limpar formulário
      setConsulta({
        paciente: "",
        data: null,
        horario: null,
        medico: "",
        especialidade: "",
        status: "Agendada"
      });

      onClose();
    }
  };

  const handleCancel = () => {
    // Limpar formulário ao cancelar
    setConsulta({
      paciente: "",
      data: null,
      horario: null,
      medico: "",
      especialidade: "",
      status: "Agendada"
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
          <Typography variant="h6">Agendar Nova Consulta</Typography>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              inputRef={pacienteInputRef}
              name="paciente"
              label="Nome do Paciente"
              value={consulta.paciente}
              onChange={handleChange}
              fullWidth
              required
              error={errors.paciente}
              helperText={errors.paciente ? "Nome do paciente é obrigatório" : ""}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data da Consulta"
                value={consulta.data}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: errors.data,
                    helperText: errors.data ? "Data é obrigatória" : "",
                    margin: "normal"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <TimePicker
                label="Horário"
                value={consulta.horario}
                onChange={handleTimeChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: errors.horario,
                    helperText: errors.horario ? "Horário é obrigatório" : "",
                    margin: "normal"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required error={errors.medico} margin="normal">
              <InputLabel id="medico-label">Médico</InputLabel>
              <Select
                labelId="medico-label"
                id="medico"
                name="medico"
                value={consulta.medico}
                label="Médico"
                onChange={handleChange}
              >
                {medicos.map((medico) => (
                  <MenuItem key={medico.id} value={medico.nome}>
                    {medico.nome} - {medico.especialidade}
                  </MenuItem>
                ))}
              </Select>
              {errors.medico && <FormHelperText>Médico é obrigatório</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="especialidade"
              label="Especialidade"
              value={consulta.especialidade}
              disabled
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={consulta.status}
                label="Status"
                onChange={handleChange}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleCancel} color="inherit" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Agendar Consulta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultaFormModal;
