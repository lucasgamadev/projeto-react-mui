import { Close as CloseIcon, Photo as PhotoIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ptBR from "date-fns/locale/pt-BR";
import React, { useRef, useState } from "react";

const EventFormModal = ({ open, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [event, setEvent] = useState({
    title: "",
    date: null,
    location: "",
    image: "/images/events/default.svg" // Imagem padrão
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [errors, setErrors] = useState({
    title: false,
    date: false,
    location: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
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

  const handleDateChange = (newDate) => {
    setEvent({
      ...event,
      date: newDate
    });

    // Limpar erro quando o usuário selecionar uma data
    if (errors.date) {
      setErrors({
        ...errors,
        date: false
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Criar URL para preview da imagem
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const validate = () => {
    const newErrors = {
      title: !event.title,
      date: !event.date,
      location: !event.location
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validate()) {
      // Formatar a data para o formato BR
      const formattedDate = event.date
        ? `${event.date.getDate().toString().padStart(2, "0")}/${(event.date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${event.date.getFullYear()}`
        : "";

      onSave({
        ...event,
        date: formattedDate,
        // Usar a imagem selecionada ou a padrão
        image: previewImage || event.image,
        id: Date.now() // ID temporário, em uma aplicação real seria gerado pelo backend
      });

      // Limpar formulário
      setEvent({
        title: "",
        date: null,
        location: "",
        image: "/images/events/default.svg"
      });
      setSelectedImage(null);
      setPreviewImage("");

      onClose();
    }
  };

  const handleCancel = () => {
    // Limpar formulário ao cancelar
    setEvent({
      title: "",
      date: null,
      location: "",
      image: "/images/events/default.svg"
    });
    setSelectedImage(null);
    setPreviewImage("");
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
          <Typography variant="h6">Adicionar Novo Evento</Typography>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Título do Evento"
              value={event.title}
              onChange={handleChange}
              fullWidth
              required
              error={errors.title}
              helperText={errors.title ? "Título é obrigatório" : ""}
              margin="normal"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data do Evento"
                value={event.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={errors.date}
                    helperText={errors.date ? "Data é obrigatória" : ""}
                    margin="normal"
                  />
                )}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: errors.date,
                    helperText: errors.date ? "Data é obrigatória" : "",
                    margin: "normal"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="location"
              label="Local"
              value={event.location}
              onChange={handleChange}
              fullWidth
              required
              error={errors.location}
              helperText={errors.location ? "Local é obrigatório" : ""}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Imagem do Evento (opcional)
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 2
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 180,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                  borderRadius: 1,
                  overflow: "hidden",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <img
                    src={event.image}
                    alt="Imagem padrão"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                )}
              </Box>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Button
                variant="outlined"
                onClick={handleSelectImage}
                startIcon={<PhotoIcon />}
                sx={{ mb: 1 }}
              >
                Selecionar Imagem
              </Button>
              <FormHelperText>
                {selectedImage
                  ? `Arquivo selecionado: ${selectedImage.name}`
                  : "Nenhuma imagem selecionada. Uma imagem padrão será usada."}
              </FormHelperText>
            </Box>
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

export default EventFormModal;
