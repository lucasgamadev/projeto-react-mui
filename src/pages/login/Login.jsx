import { AccountCircle, Lock, LoginOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Pequeno atraso para mostrar o estado de carregamento
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Usuário ou senha inválidos");
      }
      setLoading(false);
    }, 800);
  };

  // Background abstrato com gradiente
  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
    opacity: 0.9,
    zIndex: -1,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed"
  };

  // Círculos decorativos para o fundo
  const circles = [
    { size: "150px", top: "10%", left: "10%", delay: 0 },
    { size: "100px", top: "50%", right: "15%", delay: 0.2 },
    { size: "200px", bottom: "10%", left: "30%", delay: 0.4 },
    { size: "120px", top: "30%", right: "30%", delay: 0.6 }
  ];

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        minHeight: "100vh",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        padding: 0,
        margin: 0,
        width: "100%"
      }}
    >
      {/* Background com gradiente */}
      <Box sx={backgroundStyle} />

      {/* Círculos decorativos */}
      {circles.map((circle, index) => (
        <Fade key={index} in={true} timeout={1000} style={{ transitionDelay: `${circle.delay}s` }}>
          <Box
            sx={{
              position: "absolute",
              width: circle.size,
              height: circle.size,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(5px)",
              top: circle.top,
              left: circle.left,
              right: circle.right,
              bottom: circle.bottom,
              zIndex: -1
            }}
          />
        </Fade>
      ))}

      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, sm: 4 }
        }}
      >
        <Card
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: "1000px",
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          {/* Área de ilustração/informação (lado esquerdo ou topo) */}
          <Box
            sx={{
              flex: isMobile ? "none" : 1,
              padding: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: "white",
              minHeight: isMobile ? "200px" : "auto",
              textAlign: "center"
            }}
          >
            <Fade in={true} timeout={800}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Bem-vindo de volta!
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: "80%", mx: "auto" }}>
                  Entre com suas credenciais para acessar todos os recursos exclusivos da
                  plataforma.
                </Typography>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    margin: "auto",
                    mb: 2
                  }}
                >
                  <LoginOutlined fontSize="large" />
                </Avatar>
              </Box>
            </Fade>
          </Box>

          {/* Formulário de login (lado direito ou embaixo) */}
          <Box
            sx={{
              flex: isMobile ? "none" : 1,
              padding: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Fade in={true} timeout={800} style={{ transitionDelay: "200ms" }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ mb: 1, fontWeight: "bold", color: theme.palette.primary.main }}
                >
                  Login
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Preencha os campos abaixo para continuar
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Usuário"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle color="primary" />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
                      },
                      "&:active": {
                        transform: "translateY(0)"
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        transition: "all 0.5s ease"
                      },
                      "&:hover::after": {
                        left: "100%"
                      }
                    }}
                  >
                    {loading ? "Entrando..." : "ENTRAR"}
                  </Button>

                  <Divider sx={{ my: 2, opacity: 0.7 }}>
                    <Typography variant="body2" color="text.secondary">
                      Informações
                    </Typography>
                  </Divider>

                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Use as credenciais: <b>admin</b> / <b>admin</b>
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
