import React, { useState } from 'react';
import { 
	Box, 
	Button, 
	Container, 
	TextField, 
	Typography, 
	Paper,
	InputAdornment,
	CircularProgress,
	Fade,
	Alert
} from '@mui/material';
import { EmailOutlined, LockResetOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
	email: yup
		.string('Digite seu email')
		.email('Email inválido')
		.required('Email é obrigatório'),
});

function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [feedback, setFeedback] = useState({ type: '', message: '' });

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsLoading(true);
				setFeedback({ type: '', message: '' });
				
				// Simulando uma chamada à API
				await new Promise(resolve => setTimeout(resolve, 1500));
				
				console.log('Email de recuperação enviado para:', values.email);
				setFeedback({
					type: 'success',
					message: 'Se o email existir em nossa base de dados, você receberá as instruções para redefinir sua senha.'
				});
				
				setTimeout(() => {
					navigate('/');
				}, 3000);
			} catch (error) {
				setFeedback({
					type: 'error',
					message: 'Ocorreu um erro ao enviar o email. Tente novamente.'
				});
			} finally {
				setIsLoading(false);
			}
		},
	});

	return (
		<Container maxWidth="xs">
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					py: 4,
					backgroundColor: '#f5f5f5'
				}}
			>
				<Paper 
					elevation={6} 
					sx={{ 
						width: '100%',
						padding: 4, 
						display: 'flex', 
						flexDirection: 'column', 
						alignItems: 'center',
						borderRadius: 3,
						position: 'relative',
						backgroundColor: '#ffffff'
					}}
				>
					<Fade in={isLoading}>
						<Box
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: 'rgba(255, 255, 255, 0.7)',
								zIndex: 1,
								borderRadius: 3
							}}
						>
							<CircularProgress />
						</Box>
					</Fade>

					<LockResetOutlined 
						sx={{ 
							fontSize: 60, 
							color: 'primary.main', 
							mb: 2,
							animation: 'pulse 2s infinite',
							'@keyframes pulse': {
								'0%': { transform: 'scale(1)' },
								'50%': { transform: 'scale(1.1)' },
								'100%': { transform: 'scale(1)' },
							}
						}} 
					/>

					<Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
						Recuperar Senha
					</Typography>

					<Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
						Digite seu email para receber as instruções de recuperação de senha
					</Typography>

					{feedback.message && (
						<Alert 
							severity={feedback.type} 
							sx={{ mb: 2, width: '100%' }}
						>
							{feedback.message}
						</Alert>
					)}

					<Box 
						component="form" 
						onSubmit={formik.handleSubmit} 
						sx={{ width: '100%' }}
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
										<EmailOutlined color="primary" />
									</InputAdornment>
								),
							}}
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
							disabled={isLoading}
							sx={{
								'& .MuiOutlinedInput-root': {
									'&:hover fieldset': {
										borderColor: 'primary.main',
									},
								},
							}}
						/>

						<Button
						  type="submit"
						  fullWidth
						  variant="contained"
						  disabled={isLoading}
						  sx={{ 
							mt: 3, 
							mb: 2, 
							py: 1.5, 
							borderRadius: 2,
							textTransform: 'none',
							fontWeight: 'bold',
							transition: 'all 0.3s ease',
							background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
							boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
							'&:hover': {
							  transform: 'scale(1.02)',
							  boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
							},
							'&:active': {
							  transform: 'scale(0.98)',
							}
						  }}
						>
						  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
						</Button>

						<Button 
						  fullWidth
						  onClick={() => navigate('/')}
						  disabled={isLoading}
						  sx={{
							color: 'text.secondary',
							transition: 'all 0.3s ease',
							borderRadius: 2,
							'&:hover': {
							  backgroundColor: 'rgba(33, 150, 243, 0.1)',
							  color: 'primary.main',
							},
						  }}
						>
						  Voltar para Login
						</Button>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}

export default ForgotPasswordPage;