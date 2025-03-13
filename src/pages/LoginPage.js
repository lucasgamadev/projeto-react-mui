import {
  EmailOutlined,
  LockOutlined,
  LoginOutlined,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
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
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

// Esquema de validação
const validationSchema = yup.object({
  email: yup.string("Digite seu email").email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string("Digite sua senha")
    .min(5, "Senha deve ter no mínimo 5 caracteres")
    .required("Senha é obrigatória")
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Simulando carregamento
      setLoading(true);
      setTimeout(() => {
        // Verificação de credenciais
        if (values.email === "lucas@admin.com" && values.password === "admin") {
          console.log("Login bem-sucedido");
          navigate("/home");
        } else {
          console.log("Credenciais inválidas");
          alert("Email ou senha incorretos");
        }
        setLoading(false);
      }, 800);
    }
  });

  // Background abstrato com gradiente
  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
    opacity: 0.9,
    zIndex: -1
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
      maxWidth="lg"
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: 0
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
          height: "100%",
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
            backdropFilter: "blur(10px)"
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

                <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Digite seu email"
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined color="primary" />
                        </InputAdornment>
                      )
                    }}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined color="primary" />
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
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
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
                      ou
                    </Typography>
                  </Divider>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 0 },
                      alignItems: "center"
                    }}
                  >
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => navigate("/forgot-password")}
                      sx={{
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                          textDecoration: "underline"
                        }
                      }}
                    >
                      Esqueceu a senha?
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/register")}
                      sx={{
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        fontWeight: 500,
                        "&:hover": {
                          transform: "scale(1.05)",
                          borderWidth: "2px"
                        }
                      }}
                    >
                      Criar conta
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export default LoginPage;
