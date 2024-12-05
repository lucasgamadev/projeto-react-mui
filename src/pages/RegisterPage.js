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
	EmailOutlined,
	PersonOutline
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
	name: yup
		.string('Digite seu nome')
		.required('Nome é obrigatório'),
	email: yup
		.string('Digite seu email')
		.email('Email inválido')
		.required('Email é obrigatório'),
	password: yup
		.string('Digite sua senha')
		.min(5, 'Senha deve ter no mínimo 5 caracteres')
		.required('Senha é obrigatória'),
	confirmPassword: yup
		.string('Confirme sua senha')
		.oneOf([yup.ref('password'), null], 'As senhas devem corresponder')
		.required('Confirmação de senha é obrigatória'),
});

function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			console.log('Registro:', values);
			// Aqui você pode adicionar a lógica de registro
			navigate('/');
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
					Cadastro
				</Typography>
				<Box
					component="form"
					onSubmit={formik.handleSubmit}
					sx={{ width: '100%', mt: 1 }}
				>
					<TextField
						fullWidth
						id="name"
						name="name"
						label="Nome"
						placeholder="Digite seu nome"
						margin="normal"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PersonOutline />
								</InputAdornment>
							),
						}}
						value={formik.values.name}
						onChange={formik.handleChange}
						error={formik.touched.name && Boolean(formik.errors.name)}
						helperText={formik.touched.name && formik.errors.name}
					/>
					<TextField
						fullWidth
						id="email"
						name="email"
						label="Email"
						placeholder="Digite seu email"
						margin="normal"
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
						margin="normal"
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
					<TextField
						fullWidth
						id="confirmPassword"
						name="confirmPassword"
						label="Confirmar Senha"
						placeholder="Confirme sua senha"
						margin="normal"
						type={showConfirmPassword ? 'text' : 'password'}
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
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										edge="end"
									>
										{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
						value={formik.values.confirmPassword}
						onChange={formik.handleChange}
						error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
						helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
						CADASTRAR
					</Button>
					<Button
						fullWidth
						onClick={() => navigate('/')}
						sx={{
							color: 'black',
							transition: 'background-color 0.3s ease, transform 0.3s ease',
							'&:hover': {
								backgroundColor: 'primary.light',
								transform: 'scale(1.05)',
							},
							'&:active': {
								transform: 'scale(0.95)',
							}
						}}
					>
						Voltar para Login
					</Button>
				</Box>
			</Paper>
		</Container>
	);
}

export default RegisterPage;