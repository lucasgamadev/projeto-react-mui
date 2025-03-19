import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext, useState } from "react";
import {
  addProntuario,
  getProntuarioById,
  getProntuariosByCPF,
  getProntuariosByNome,
  updateProntuario
} from "../services/localStorageService";

const ProntuarioContext = createContext();

export const ProntuarioProvider = ({ children }) => {
  const [prontuarioAtual, setProntuarioAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarProntuario = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const prontuario = getProntuarioById(id);
      setProntuarioAtual(prontuario);
      return prontuario;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarProntuarioPorCPF = useCallback(async (cpf) => {
    setLoading(true);
    setError(null);
    try {
      const prontuarios = getProntuariosByCPF(cpf);
      return prontuarios;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarProntuarioPorNome = useCallback(async (nome) => {
    setLoading(true);
    setError(null);
    try {
      const prontuarios = getProntuariosByNome(nome);
      return prontuarios;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarProntuario = useCallback(async (dados) => {
    setLoading(true);
    setError(null);
    try {
      const novoProntuario = addProntuario(dados);
      setProntuarioAtual(novoProntuario);
      return novoProntuario;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarConsulta = useCallback(
    async (consulta) => {
      if (!prontuarioAtual?.id) {
        throw new Error("Nenhum prontuário selecionado");
      }

      setLoading(true);
      setError(null);
      try {
        const consultas = [...(prontuarioAtual.consultas || []), consulta];
        const prontuarioAtualizado = updateProntuario(prontuarioAtual.id, {
          ...prontuarioAtual,
          consultas
        });
        setProntuarioAtual(prontuarioAtualizado);
        return prontuarioAtualizado;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [prontuarioAtual]
  );

  const adicionarAlergia = useCallback(
    async (alergia) => {
      if (!prontuarioAtual?.id) {
        throw new Error("Nenhum prontuário selecionado");
      }

      setLoading(true);
      setError(null);
      try {
        const alergias = [...(prontuarioAtual.alergias || []), alergia];
        const prontuarioAtualizado = updateProntuario(prontuarioAtual.id, {
          ...prontuarioAtual,
          alergias
        });
        setProntuarioAtual(prontuarioAtualizado);
        return prontuarioAtualizado;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [prontuarioAtual]
  );

  const adicionarMedicamento = useCallback(
    async (medicamento) => {
      if (!prontuarioAtual?.id) {
        throw new Error("Nenhum prontuário selecionado");
      }

      setLoading(true);
      setError(null);
      try {
        const medicamentos = [...(prontuarioAtual.medicamentos || []), medicamento];
        const prontuarioAtualizado = updateProntuario(prontuarioAtual.id, {
          ...prontuarioAtual,
          medicamentos
        });
        setProntuarioAtual(prontuarioAtualizado);
        return prontuarioAtualizado;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [prontuarioAtual]
  );

  const adicionarAnexo = useCallback(
    async (anexo) => {
      if (!prontuarioAtual?.id) {
        throw new Error("Nenhum prontuário selecionado");
      }

      setLoading(true);
      setError(null);
      try {
        const anexos = [...(prontuarioAtual.anexos || []), anexo];
        const prontuarioAtualizado = updateProntuario(prontuarioAtual.id, {
          ...prontuarioAtual,
          anexos
        });
        setProntuarioAtual(prontuarioAtualizado);
        return prontuarioAtualizado;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [prontuarioAtual]
  );

  const limparProntuario = useCallback(() => {
    setProntuarioAtual(null);
    setError(null);
  }, []);

  return (
    <ProntuarioContext.Provider
      value={{
        prontuarioAtual,
        loading,
        error,
        buscarProntuario,
        buscarProntuarioPorCPF,
        buscarProntuarioPorNome,
        criarProntuario,
        adicionarConsulta,
        adicionarAlergia,
        adicionarMedicamento,
        adicionarAnexo,
        limparProntuario
      }}
    >
      {children}
    </ProntuarioContext.Provider>
  );
};

ProntuarioProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useProntuario = () => {
  const context = useContext(ProntuarioContext);
  if (!context) {
    throw new Error("useProntuario deve ser usado dentro de um ProntuarioProvider");
  }
  return context;
};

export default ProntuarioContext;
