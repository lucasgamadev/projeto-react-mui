import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import UserFormModal from "../../components/users/UserFormModal";

// Mock data - você pode substituir isso por dados reais depois
const initialMockUsers = [
  { id: 1, name: "João Silva", email: "joao@email.com", role: "Admin" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", role: "User" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", role: "User" }
];

export const Users = () => {
  const [users, setUsers] = useState(initialMockUsers);
  const [openModal, setOpenModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    setAlertMessage("Usuário adicionado com sucesso!");
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Usuários
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Função</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para adicionar usuário */}
      <UserFormModal open={openModal} onClose={handleCloseModal} onSave={handleAddUser} />

      {/* Alerta de sucesso */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity="success" variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Users;
