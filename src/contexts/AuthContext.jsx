import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

// Credenciais de teste
const TEST_CREDENTIALS = {
	username: 'teste',
	password: 'teste123'
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const login = (username, password) => {
		if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
			setUser({ username });
			setError(null);
			return true;
		} else {
			setError('Usuário ou senha inválidos');
			return false;
		}
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider 
			value={{
				user,
				error,
				login,
				logout,
				isAuthenticated: !!user
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};