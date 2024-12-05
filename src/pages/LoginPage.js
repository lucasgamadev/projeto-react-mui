import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  IconButton, 
  InputAdornment 
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined, 
  EmailOutlined 
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Esquema de validação
const validationSchema = yup.object({
  email: yup
    .string('Digite seu email')
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: yup
    .string('Digite sua senha')
    .min(5, 'Senha deve ter no mínimo 5 caracteres')
    .required('Senha é obrigatória'),
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Verificação de credenciais
      if (values.email === 'lucas@admin.com' && values.password === 'admin') {
        console.log('Login bem-sucedido');
        navigate('/home');
      } else {
        console.log('Credenciais inválidas');
        alert('Email ou senha incorretos');
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 3
        }}
      >
        <LockOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box 
          component="form" 
          onSubmit={formik.handleSubmit} 
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            placeholder="Digite seu email"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined />
                </InputAdornment>
              ),
            }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5, 
              borderRadius: 2,
              textTransform: 'none',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            ENTRAR
          </Button>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%' 
          }}>
            <Button 
              size="small" 
              onClick={() => navigate('/forgot-password')}
              sx={{
                textTransform: 'none',
                '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
                }

              }}
            >
              Esqueceu a senha?
            </Button>
            <Button 
              size="small" 
              onClick={() => navigate('/register')}
              sx={{
              color: 'black',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.light',
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              }
              }}
            >
              Cadastre-se
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
