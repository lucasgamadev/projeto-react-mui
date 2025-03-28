import { Close as CloseIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useRef, useState } from 'react';
import { MedicalServices as MedicalServicesIcon } from "@mui/icons-material";

// Lista de médicos para o sistema (em um sistema real, seria buscado do banco de dados)
const medicos = [
  { id: 1, nome: 'Dr. João Cardoso', especialidade: 'Cardiologia' },
  { id: 2, nome: 'Dra. Ana Pereira', especialidade: 'Dermatologia' },
  { id: 3, nome: 'Dr. Roberto Santos', especialidade: 'Ortopedia' },
  { id: 4, nome: 'Dra. Mariana Lima', especialidade: 'Pediatria' }
];

// Status possíveis para a consulta
const statusOptions = ['Agendada', 'Confirmada', 'Cancelada', 'Realizada'];

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
    paciente: '',
    data: null,
    horario: null,
    medicoId: '',
    status: 'Agendada',
    observacoes: ''
  });

  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const newErrors = {};
    if (!consulta.paciente) newErrors.paciente = 'Campo obrigatório';
    if (!consulta.data) newErrors.data = 'Campo obrigatório';
    if (!consulta.horario) newErrors.horario = 'Campo obrigatório';
    if (!consulta.medicoId) newErrors.medicoId = 'Campo obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(consulta);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <MedicalServicesIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">NOVA CONSULTA</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Paciente"
              value={consulta.paciente}
              onChange={(e) => setConsulta({ ...consulta, paciente: e.target.value })}
              error={!!errors.paciente}
              helperText={errors.paciente}
              inputRef={pacienteInputRef}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <DatePicker
                label="Data"
                value={consulta.data}
                onChange={(newValue) => setConsulta({ ...consulta, data: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.data}
                    helperText={errors.data}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
              <TimePicker
                label="Horário"
                value={consulta.horario}
                onChange={(newValue) => setConsulta({ ...consulta, horario: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.horario}
                    helperText={errors.horario}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.medicoId}>
              <InputLabel>Médico</InputLabel>
              <Select
                value={consulta.medicoId}
                label="Médico"
                onChange={(e) => setConsulta({ ...consulta, medicoId: e.target.value })}
              >
                {medicos.map((medico) => (
                  <MenuItem key={medico.id} value={medico.id}>
                    {medico.nome} - {medico.especialidade}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.medicoId}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              value={consulta.observacoes}
              onChange={(e) => setConsulta({ ...consulta, observacoes: e.target.value })}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={consulta.status}
                label="Status"
                onChange={(e) => setConsulta({ ...consulta, status: e.target.value })}
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
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultaFormModal;
