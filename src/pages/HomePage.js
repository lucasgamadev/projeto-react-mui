import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const HomePage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userName = "Lucas Gama"; // Exemplo estático


  const handleLogout = () => {
    // Aqui você pode adicionar lógica de logout se necessário
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Usuários', icon: <PeopleIcon /> },
    { text: 'Eventos', icon: <EventIcon /> },
    { text: 'Configurações', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box 
      sx={{ 
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }} 
      role="presentation"
    >
        <List>
        {menuItems.map((item, index) => (
          <ListItem button key={item.text}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          </ListItem>
        ))}
        </List>
        <Divider />
        <Box sx={{ marginTop: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Sair
        </Button>
        </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
            >
            <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Windsurf Dashboard
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" sx={{ mr: 1 }}>
              {userName}
              </Typography>
                <Avatar 
                sx={{ 
                  bgcolor: 'secondary.main',
                  width: 40,
                  height: 40
                }}
                >
                {userName.split(' ').map(name => name[0]).join('')}
                </Avatar>
              </Stack>
            </Toolbar>
            </AppBar>


        <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        >
        {drawerContent}
        </Drawer>

      {/* Dashboard Content */}
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Card 1 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <DashboardIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="div">
                  Visão Geral
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe suas estatísticas e progresso
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <PeopleIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="div">
                  Usuários
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gerencie usuários e permissões
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <EventIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="div">
                  Eventos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calendário de eventos e atividades
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
