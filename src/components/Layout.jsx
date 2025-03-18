import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  DescriptionOutlined as DocumentIcon,
  Group as GroupIcon,
  MedicalServices as MedicalServicesIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDashboard } from "../contexts/DashboardContext";

// Largura do drawer quando aberto
const drawerWidth = 240;
// Largura do drawer quando minimizado
const miniDrawerWidth = 70;

// Estilizando os componentes para melhorar a aparência
const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateX(5px)"
  },
  ...(selected && {
    backgroundColor: theme.palette.primary.light + "33", // Adicionando transparência
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light + "55",
      transform: "translateX(5px)"
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main
    },
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "25%",
      height: "50%",
      width: 4,
      backgroundColor: theme.palette.primary.main,
      borderRadius: "0 4px 4px 0"
    }
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "space-between",
  ...theme.mixins.toolbar,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}));

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
  { path: "/consultas", name: "Consultas", icon: <MedicalServicesIcon /> },
  { path: "/prontuario", name: "Prontuário", icon: <DocumentIcon /> },
  { path: "/historico-medico", name: "Histórico Médico", icon: <TimelineIcon /> },
  { path: "/users", name: "Usuários", icon: <GroupIcon /> },
  { path: "/perfil", name: "Perfil", icon: <PersonIcon /> },
  { path: "/configuracoes", name: "Configurações", icon: <SettingsIcon /> }
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mobileOpen, desktopOpen, handleDrawerToggle, toggleDesktopDrawer } = useDashboard();

  const getCurrentPageName = () => {
    const currentItem =
      menuItems.find((item) => item.path === location.pathname) ||
      menuItems.find((item) => item.path === "/dashboard");
    return currentItem ? currentItem.name : "Dashboard";
  };

  // Criando o conteúdo do drawer
  const drawer = (
    <div>
      <DrawerHeader>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            padding: theme.spacing(0, 2),
            display: { xs: "block", sm: desktopOpen ? "block" : "none" }
          }}
        >
          App Médico
        </Typography>
        <IconButton
          onClick={window.innerWidth >= 600 ? toggleDesktopDrawer : handleDrawerToggle}
          sx={{ color: "inherit" }}
        >
          {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ padding: theme.spacing(1, 0) }}>
        {menuItems.map((item) => (
          <Tooltip title={!desktopOpen ? item.name : ""} placement="right" key={item.path} arrow>
            <StyledListItem
              button
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                justifyContent: desktopOpen ? "initial" : "center",
                px: 2.5
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: desktopOpen ? 3 : "auto",
                  justifyContent: "center"
                }}
              >
                {item.icon}
              </ListItemIcon>
              {desktopOpen && <ListItemText primary={item.name} />}
            </StyledListItem>
          </Tooltip>
        ))}
      </List>
    </div>
  );

  const currentPageName = getCurrentPageName();
  // Calculando a largura atual com base no estado do drawer
  const currentDrawerWidth = desktopOpen ? drawerWidth : miniDrawerWidth;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          boxShadow: 2,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              "&:hover": {
                transform: "rotate(180deg)",
                transition: "transform 0.3s ease-in-out"
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {currentPageName}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer para dispositivos móveis */}
      <Box component="nav" sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
              transition: theme.transitions.create(["transform", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
              })
            }
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer permanente para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
              })
            }
          }}
          open={desktopOpen}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          marginTop: "64px",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
