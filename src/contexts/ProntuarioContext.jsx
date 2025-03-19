import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext, useState } from "react";
import * as prontuarioService from "../services/prontuarioService";

const ProntuarioContext = createContext();

export const ProntuarioProvider = ({ children }) => {
  const [prontuarioAtual, setProntuarioAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarProntuario = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const prontuario = await prontuarioService.getProntuarioById(id);
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
      const prontuarios = await prontuarioService.getProntuariosByCPF(cpf);
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
      const prontuarios = await prontuarioService.getProntuariosByNome(nome);
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
      const novoProntuario = await prontuarioService.createProntuario(dados);
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
        const prontuarioAtualizado = await prontuarioService.addConsulta(
          prontuarioAtual.id,
          consulta
        );
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
        const prontuarioAtualizado = await prontuarioService.addAlergia(
          prontuarioAtual.id,
          alergia
        );
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
        const prontuarioAtualizado = await prontuarioService.addMedicamento(
          prontuarioAtual.id,
          medicamento
        );
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
        const prontuarioAtualizado = await prontuarioService.addAnexo(prontuarioAtual.id, anexo);
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
