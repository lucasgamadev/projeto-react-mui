import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import dadosExemplo from "../data/dadosExemplo.json";
import {
  addProntuario,
  getProntuarioById,
  getProntuariosByCPF,
  getProntuariosByNome,
  updateProntuario
} from "../services/localStorageService";
import { popularPacientes } from "../services/seedService";

const ProntuarioContext = createContext();

export const ProntuarioProvider = ({ children }) => {
  const [prontuarioAtual, setProntuarioAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dadosInicializados, setDadosInicializados] = useState(false);

  // Inicializa dados de exemplo
  useEffect(() => {
    const inicializarDados = async () => {
      if (!dadosInicializados) {
        try {
          console.log("Inicializando dados de exemplo...");
          await popularPacientes();
          setDadosInicializados(true);
        } catch (error) {
          console.error("Erro ao inicializar dados:", error);
        }
      }
    };

    inicializarDados();
  }, [dadosInicializados]);

  const buscarProntuario = useCallback(async (id) => {
    if (!id) {
      setError("ID do prontuário não fornecido");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`Buscando prontuário com ID: ${id}`);
      const prontuario = getProntuarioById(id);

      if (!prontuario) {
        throw new Error("Prontuário não encontrado");
      }

      setProntuarioAtual(prontuario);
      return prontuario;
    } catch (err) {
      console.error("Erro ao buscar prontuário:", err);
      setError(err.message || "Erro ao buscar prontuário");
      setProntuarioAtual(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para carregar consultas de exemplo para o prontuário atual
  const carregarConsultasExemplo = useCallback(async () => {
    if (!prontuarioAtual) {
      throw new Error("Nenhum prontuário selecionado");
    }

    setLoading(true);
    setError(null);
    try {
      // Busca o paciente correspondente no arquivo de exemplo
      const pacienteExemplo = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual.cpf);

      if (
        !pacienteExemplo ||
        !pacienteExemplo.consultas ||
        pacienteExemplo.consultas.length === 0
      ) {
        throw new Error("Não há consultas de exemplo disponíveis para este paciente");
      }

      // Converte as datas de string para objeto Date
      const consultasAtualizadas = pacienteExemplo.consultas.map((consulta) => {
        if (typeof consulta.data === "string") {
          return {
            ...consulta,
            data: new Date(consulta.data)
          };
        }
        return consulta;
      });

      const prontuarioAtualizado = {
        ...prontuarioAtual,
        consultas: consultasAtualizadas
      };

      // Atualiza o prontuário no localStorage e no estado
      updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
      setProntuarioAtual(prontuarioAtualizado);
      return prontuarioAtualizado;
    } catch (err) {
      console.error("Erro ao carregar consultas de exemplo:", err);
      setError(err.message || "Erro ao carregar consultas de exemplo");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [prontuarioAtual]);

  const carregarMedicamentosExemplo = async () => {
    try {
      setLoading(true);
      const pacienteAtual = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual?.cpf);

      if (pacienteAtual) {
        const medicamentosAtualizados = pacienteAtual.medicamentos.map((medicamento) => ({
          ...medicamento,
          dataInicio: new Date(medicamento.dataInicio),
          dataFim: medicamento.dataFim ? new Date(medicamento.dataFim) : null
        }));

        const prontuarioAtualizado = {
          ...prontuarioAtual,
          medicamentos: medicamentosAtualizados
        };

        updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
        setProntuarioAtual(prontuarioAtualizado);
      }
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
        limparProntuario,
        carregarConsultasExemplo,
        carregarMedicamentosExemplo
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
