import PropTypes from "prop-types";
import React, { createContext, useContext, useEffect, useState } from "react";

const DashboardContext = createContext();

// Chave para armazenar o estado no localStorage
const DRAWER_STATE_KEY = "appMedico-drawer-state";

export const DashboardProvider = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(
    localStorage.getItem(DRAWER_STATE_KEY) === "closed" ? false : true
  );

  // Função para alternar o estado do drawer mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Função para alternar o estado do drawer desktop
  const toggleDesktopDrawer = () => {
    const newState = !desktopOpen;
    setDesktopOpen(newState);
    // Salvar o estado no localStorage para persistência
    localStorage.setItem(DRAWER_STATE_KEY, newState ? "open" : "closed");
  };

  // Efeito para detectar alterações de tamanho de tela
  useEffect(() => {
    const handleResize = () => {
      // Fechar automaticamente o drawer mobile em telas maiores
      if (window.innerWidth >= 600 && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  return (
    <DashboardContext.Provider
      value={{
        mobileOpen,
        desktopOpen,
        handleDrawerToggle,
        toggleDesktopDrawer
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard deve ser usado dentro de um DashboardProvider");
  }
  return context;
};
