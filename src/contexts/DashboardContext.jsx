import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<DashboardContext.Provider 
			value={{
				mobileOpen,
				handleDrawerToggle,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
};

DashboardProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
	}
	return context;
};
