import { Edit as EditIcon } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Grid, Paper, Typography, styled } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

const InfoItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "&:last-child": {
    marginBottom: 0
  }
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: theme.spacing(0.5)
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 400
}));

const ProfileView = ({ user, onEdit }) => {
  // Em produção, essas informações viriam da API/backend
  // Por enquanto, usamos dados mockados para demonstração
  const profileData = {
    username: user?.username || "admin",
    nome: "Administrador",
    email: "admin@exemplo.com.br",
    cargo: "Gerente",
    departamento: "TI",
    dataRegistro: "01/01/2024",
    telefone: "(11) 99999-9999",
    endereco: "Av. Paulista, 1000, São Paulo - SP"
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.02)"
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 4 },
            border: "4px solid white",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          {profileData.nome.charAt(0)}
        </Avatar>
        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            {profileData.nome}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {profileData.cargo} • {profileData.departamento}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Membro desde {profileData.dataRegistro}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          Editar Perfil
        </Button>
      </Paper>

      <Box sx={{ px: 3, pb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom mb={3}>
          Informações do Usuário
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <InfoItem>
              <InfoLabel variant="subtitle2">Nome de Usuário</InfoLabel>
              <InfoValue variant="body1">{profileData.username}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel variant="subtitle2">Email</InfoLabel>
              <InfoValue variant="body1">{profileData.email}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel variant="subtitle2">Telefone</InfoLabel>
              <InfoValue variant="body1">{profileData.telefone}</InfoValue>
            </InfoItem>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoItem>
              <InfoLabel variant="subtitle2">Cargo</InfoLabel>
              <InfoValue variant="body1">{profileData.cargo}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel variant="subtitle2">Departamento</InfoLabel>
              <InfoValue variant="body1">{profileData.departamento}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel variant="subtitle2">Endereço</InfoLabel>
              <InfoValue variant="body1">{profileData.endereco}</InfoValue>
            </InfoItem>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" color="primary" onClick={onEdit}>
            Editar Informações
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

ProfileView.propTypes = {
  user: PropTypes.object,
  onEdit: PropTypes.func.isRequired
};

export default ProfileView;
