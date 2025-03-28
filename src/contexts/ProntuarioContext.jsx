import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import dadosExemplo from "../data/dadosExemplo.json";
import {
  addProntuario,
  clearAllData,
  getProntuarioById,
  getProntuariosByCPF,
  getProntuariosByNome,
  updateProntuario
} from "../services/localStorageService";
import { popularPacientes } from "../services/seedService";
import AnexarDocumentoModal from '../components/AnexarDocumentoModal';

const ProntuarioContext = createContext();

// Chaves para armazenar estados de exemplos no localStorage
const EXEMPLOS_STORAGE_KEYS = {
  consultas: "prontuario-exemplos-consultas",
  medicamentos: "prontuario-exemplos-medicamentos",
  alergias: "prontuario-exemplos-alergias",
  cirurgias: "prontuario-exemplos-cirurgias",
  historicoFamiliar: "prontuario-exemplos-historico-familiar",
  anexos: "prontuario-exemplos-anexos"
};

export const ProntuarioProvider = ({ children }) => {
  const [prontuarioAtual, setProntuarioAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dadosInicializados, setDadosInicializados] = useState(false);
  const [modalAnexarDocumentoAberto, setModalAnexarDocumentoAberto] = useState(false);

  // Inicializa dados de exemplo
  useEffect(() => {
    const inicializarDados = async () => {
      if (!dadosInicializados) {
        try {
          console.log("Inicializando dados de exemplo...");
          const pacientesCriados = await popularPacientes();
          console.log(`${pacientesCriados} pacientes inicializados no sistema`);
          setDadosInicializados(true);
        } catch (error) {
          console.error("Erro ao inicializar dados:", error);
          setError("Erro ao inicializar dados de exemplo. Tente recarregar a página.");
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

  // Função auxiliar para salvar estado de exemplo carregado
  const salvarEstadoExemploCarregado = (tipo) => {
    localStorage.setItem(EXEMPLOS_STORAGE_KEYS[tipo], "true");
  };

  // Função auxiliar para verificar se exemplo já foi carregado
  const verificarExemploJaCarregado = (tipo) => {
    return localStorage.getItem(EXEMPLOS_STORAGE_KEYS[tipo]) === "true";
  };

  // Função para carregar consultas de exemplo para o prontuário atual
  const carregarConsultasExemplo = useCallback(async () => {
    if (!prontuarioAtual) {
      throw new Error("Nenhum prontuário selecionado");
    }

    setLoading(true);
    setError(null);
    try {
      // Buscar paciente atual pelos dados de exemplo
      const pacienteAtual = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual?.cpf);
      
      if (!pacienteAtual || !pacienteAtual.consultas) {
        throw new Error("Dados de consulta não encontrados para o paciente");
      }

      // Limitar a quantidade de consultas para evitar sobrecarga
      const maxConsultas = 20;
      const consultasProcessadas = pacienteAtual.consultas.slice(0, maxConsultas).map((consulta) => {
        // Processamento seguro das datas
        let dataConsulta;
        try {
          dataConsulta = new Date(consulta.data);
          if (isNaN(dataConsulta.getTime())) {
            dataConsulta = new Date();
          }
        } catch (error) {
          console.error("Erro ao processar data da consulta:", error);
          dataConsulta = new Date();
        }

        // Verificar se existe campo historico na consulta
        const historicoConsulta = consulta.historico || {};
        
        // Verificar campos de sinaisVitais
        const sinaisVitais = historicoConsulta.sinaisVitais || {};

        return {
          ...consulta,
          id: consulta.id || `consulta-${Math.random().toString(36).substr(2, 9)}`,
          data: dataConsulta,
          queixaPrincipal: historicoConsulta.queixaPrincipal || '',
          sinaisVitais: {
            pressaoArterial: sinaisVitais.pressaoArterial || '',
            frequenciaCardiaca: sinaisVitais.frequenciaCardiaca || '',
            temperatura: sinaisVitais.temperatura || '',
            saturacao: sinaisVitais.saturacaoO2 || '',
          },
          historico: historicoConsulta
        };
      });

      const prontuarioAtualizado = {
        ...prontuarioAtual,
        consultas: consultasProcessadas
      };

      // Atualiza o prontuário no localStorage e no estado
      updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
      setProntuarioAtual(prontuarioAtualizado);

      // Salvar que exemplos foram carregados
      salvarEstadoExemploCarregado("consultas");

      return consultasProcessadas;
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

        // Salvar que exemplos foram carregados
        salvarEstadoExemploCarregado("medicamentos");
      }
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const carregarAlergiasExemplo = async () => {
    try {
      setLoading(true);
      const pacienteAtual = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual?.cpf);

      if (pacienteAtual) {
        const alergiasAtualizadas = pacienteAtual.alergias.map((alergia) => ({
          ...alergia,
          dataIdentificacao: new Date(alergia.dataIdentificacao || new Date())
        }));

        const prontuarioAtualizado = {
          ...prontuarioAtual,
          alergias: alergiasAtualizadas
        };

        updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
        setProntuarioAtual(prontuarioAtualizado);

        // Salvar que exemplos foram carregados
        salvarEstadoExemploCarregado("alergias");
      }
    } catch (error) {
      console.error("Erro ao carregar alergias:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const carregarCirurgiasExemplo = async () => {
    try {
      setLoading(true);
      const pacienteAtual = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual?.cpf);

      if (pacienteAtual) {
        const cirurgiasAtualizadas = pacienteAtual.cirurgias.map((cirurgia) => {
          // Garantir que a data seja convertida para objeto Date
          let dataConvertida;
          try {
            dataConvertida = new Date(cirurgia.data);
            // Verificar se a data é válida
            if (isNaN(dataConvertida.getTime())) {
              console.warn(`Data inválida para cirurgia: ${cirurgia.data}`);
              dataConvertida = new Date(); // Usar data atual como fallback
            }
          } catch (error) {
            console.error(`Erro ao converter data da cirurgia: ${cirurgia.data}`, error);
            dataConvertida = new Date(); // Usar data atual como fallback
          }

          return {
            ...cirurgia,
            data: dataConvertida,
            hospital: cirurgia.hospital || "Hospital não informado",
            medicoResponsavel: cirurgia.medico || "Médico não informado",
            descricao: cirurgia.descricao || cirurgia.tipo,
            resultado: cirurgia.resultado || cirurgia.observacoes || "Resultado não informado",
            complicacoes: cirurgia.complicacoes || "Nenhuma"
          };
        });

        const prontuarioAtualizado = {
          ...prontuarioAtual,
          cirurgias: cirurgiasAtualizadas
        };

        updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
        setProntuarioAtual(prontuarioAtualizado);

        // Salvar que exemplos foram carregados
        salvarEstadoExemploCarregado("cirurgias");
      }
    } catch (error) {
      console.error("Erro ao carregar cirurgias:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const carregarHistoricoFamiliarExemplo = useCallback(async () => {
    try {
      setLoading(true);

      // Verificar se prontuarioAtual existe
      if (!prontuarioAtual) {
        throw new Error("Nenhum prontuário selecionado");
      }

      // Limitar a quantidade de doencas para evitar sobrecarga
      const maxDoencas = 10;

      // Dados a serem processados
      let doencasProcessadas = [];
      let observacoesGerais = "";

      // Dados de exemplo padrão caso ocorra erro
      const doencasPadrao = [
        { doenca: "Hipertensão", parentesco: "Pai", observacoes: "Diagnosticada aos 45 anos" },
        {
          doenca: "Diabetes Tipo 2",
          parentesco: "Avô",
          observacoes: "Diagnosticado aos 60 anos"
        },
        { doenca: "Câncer de Mama", parentesco: "Tia", observacoes: "Diagnosticado aos 55 anos" }
      ];

      // Mapear parentescos padrão por nome de doença para recuperação fácil
      const parentescoPorDoenca = {
        Hipertensão: "Pai",
        "Diabetes Tipo 2": "Avô",
        "Câncer de Mama": "Tia"
      };

      // Buscar dados de exemplo com segurança
      try {
        // Forçar o uso dos dados padrão para garantir consistência
        doencasProcessadas = [...doencasPadrao];

        // Adicionalmente, podemos tentar obter dados específicos do paciente
        const pacienteAtual = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual.cpf);
        if (
          pacienteAtual &&
          pacienteAtual.historicoFamiliar &&
          Array.isArray(pacienteAtual.historicoFamiliar.doencas) &&
          pacienteAtual.historicoFamiliar.doencas.length > 0
        ) {
          // Processamos, mas manteremos os parentescos padrão para as doenças conhecidas
          const doencastmp = pacienteAtual.historicoFamiliar.doencas
            .slice(0, maxDoencas)
            .map((doenca) => {
              const nomeDoenca = doenca.doenca || doenca.nome || "Doença não especificada";

              // Se for uma doença padrão, manter o parentesco padrão conhecido
              const parentescoPadrao = parentescoPorDoenca[nomeDoenca];

              return {
                doenca: nomeDoenca,
                parentesco:
                  parentescoPadrao || doenca.parentesco || doenca.parente || "Não informado",
                observacoes: doenca.observacoes || ""
              };
            });

          // Substitui apenas se conseguirmos processar
          if (doencastmp.length > 0) {
            doencasProcessadas = doencastmp;
          }

          observacoesGerais = pacienteAtual.historicoFamiliar.observacoes || "";
        }
      } catch (processError) {
        console.error("Erro ao processar histórico familiar:", processError);
        // Em caso de erro, usar o conjunto padrão de doenças
        doencasProcessadas = [...doencasPadrao];
      }

      // Garantindo explicitamente os parentescos para as doenças padrão
      doencasProcessadas = doencasProcessadas.map((doenca) => {
        // Para as doenças conhecidas, forçar os parentescos corretos
        if (doenca.doenca === "Hipertensão") {
          return { ...doenca, parentesco: "Pai" };
        } else if (doenca.doenca === "Diabetes Tipo 2") {
          return { ...doenca, parentesco: "Avô" };
        } else if (doenca.doenca === "Câncer de Mama") {
          return { ...doenca, parentesco: "Tia" };
        }
        // Para outras doenças, manter o que já existe ou usar "Não informado"
        return {
          ...doenca,
          parentesco:
            doenca.parentesco && doenca.parentesco !== "Não informado"
              ? doenca.parentesco
              : "Familiar"
        };
      });

      console.log("Histórico familiar processado:", doencasProcessadas);

      // Atualizar o prontuário com dados processados
      const historicoFamiliarAtualizado = {
        doencas: doencasProcessadas,
        observacoes: observacoesGerais
      };

      const prontuarioAtualizado = {
        ...prontuarioAtual,
        historicoFamiliar: historicoFamiliarAtualizado
      };

      updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
      setProntuarioAtual(prontuarioAtualizado);

      // Salvar que exemplos foram carregados
      salvarEstadoExemploCarregado("historicoFamiliar");
      return prontuarioAtualizado;
    } catch (error) {
      console.error("Erro ao carregar histórico familiar:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [prontuarioAtual]);

  const carregarAnexosExemplo = useCallback(async () => {
    try {
      setLoading(true);
      // Encontrar o paciente atual pelo CPF
      const pacienteAtual = dadosExemplo.pacientes.find((p) => p.cpf === prontuarioAtual.cpf);

      if (!pacienteAtual) {
        throw new Error("Paciente não encontrado");
      }

      // Processamento seguro de anexos
      const anexosProcessados = [];
      // Limitar a quantidade de anexos para evitar sobrecarga
      const maxAnexos = 20;
      let contador = 0;

      // Processar cada anexo com tratamento de exceções
      for (const anexo of dadosExemplo.anexos) {
        try {
          if (contador >= maxAnexos) break;
          contador++;

          // Converter data para objeto Date, com validação
          let dataUpload;
          try {
            dataUpload = new Date(anexo.data);
            // Verificar se a data é válida
            if (isNaN(dataUpload.getTime())) {
              dataUpload = new Date(); // Utilizar data atual como fallback
            }
          } catch (error) {
            console.error("Erro ao processar data:", error);
            dataUpload = new Date();
          }

          // Criar o anexo com as propriedades esperadas
          const anexoProcessado = {
            id: anexo.id || `anexo-${Math.random().toString(36).substr(2, 9)}`,
            nome: anexo.titulo || "Anexo sem título",
            categoria: anexo.tipo || "Documento", // Usar tipo como categoria
            tipo: anexo.tipo || "Documento",
            dataUpload: dataUpload,
            url: anexo.url || "#",
            descricao:
              anexo.descricao || `${anexo.titulo || "Anexo"} (${anexo.tipo || "Documento"})`,
            tamanho: anexo.tamanho || "1 MB"
          };

          anexosProcessados.push(anexoProcessado);
        } catch (error) {
          console.error("Erro ao processar anexo individual:", error);
          // Continuar com o próximo anexo
        }
      }

      // Atualizar o prontuário atual com os anexos processados
      const prontuarioAtualizado = {
        ...prontuarioAtual,
        anexos: anexosProcessados
      };

      updateProntuario(prontuarioAtual.id, prontuarioAtualizado);
      setProntuarioAtual(prontuarioAtualizado);

      // Atualizar o registro de exemplos carregados
      salvarEstadoExemploCarregado("anexos");

      console.log("Anexos de exemplo atualizados:", anexosProcessados);
      return anexosProcessados;
    } catch (error) {
      console.error("Erro ao carregar anexos de exemplo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [prontuarioAtual]);

  // Função para reinicializar o banco de dados (útil em caso de problemas)
  const reinicializarDados = useCallback(async () => {
    try {
      setLoading(true);
      // Limpa todos os dados do localStorage
      clearAllData();
      // Reinicia a inicialização
      setDadosInicializados(false);
      // Limpa o prontuário atual
      setProntuarioAtual(null);
      // Limpa as chaves de exemplos carregados
      Object.values(EXEMPLOS_STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      // Reinicializa os dados
      await popularPacientes();
      setDadosInicializados(true);
      return true;
    } catch (error) {
      console.error("Erro ao reinicializar dados:", error);
      setError("Erro ao reinicializar dados");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para carregar todos os exemplos de uma vez para o prontuário atual
  const carregarTodosExemplos = useCallback(async () => {
    if (!prontuarioAtual) {
      throw new Error("Nenhum prontuário selecionado");
    }

    setLoading(true);
    setError(null);
    try {
      // Array para armazenar promessas de carregamento
      const promessasCarregamento = [];

      // Adicionar cada função de carregamento ao array
      // Checamos se os exemplos já foram carregados ou se os dados já existem
      if (
        !verificarExemploJaCarregado("consultas") ||
        !prontuarioAtual.consultas ||
        prontuarioAtual.consultas.length === 0
      ) {
        promessasCarregamento.push(carregarConsultasExemplo());
      }

      if (
        !verificarExemploJaCarregado("medicamentos") ||
        !prontuarioAtual.medicamentos ||
        prontuarioAtual.medicamentos.length === 0
      ) {
        promessasCarregamento.push(carregarMedicamentosExemplo());
      }

      if (
        !verificarExemploJaCarregado("alergias") ||
        !prontuarioAtual.alergias ||
        prontuarioAtual.alergias.length === 0
      ) {
        promessasCarregamento.push(carregarAlergiasExemplo());
      }

      if (
        !verificarExemploJaCarregado("cirurgias") ||
        !prontuarioAtual.cirurgias ||
        prontuarioAtual.cirurgias.length === 0
      ) {
        promessasCarregamento.push(carregarCirurgiasExemplo());
      }

      if (
        !verificarExemploJaCarregado("historicoFamiliar") ||
        !prontuarioAtual.historicoFamiliar ||
        !prontuarioAtual.historicoFamiliar.doencas ||
        prontuarioAtual.historicoFamiliar.doencas.length === 0
      ) {
        promessasCarregamento.push(carregarHistoricoFamiliarExemplo());
      }

      if (
        !verificarExemploJaCarregado("anexos") ||
        !prontuarioAtual.anexos ||
        prontuarioAtual.anexos.length === 0
      ) {
        promessasCarregamento.push(carregarAnexosExemplo());
      }

      // Executar todas as promessas em paralelo
      if (promessasCarregamento.length > 0) {
        await Promise.all(promessasCarregamento);
      }

      return true;
    } catch (error) {
      console.error("Erro ao carregar todos os exemplos:", error);
      setError("Erro ao carregar dados de exemplo. Tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [
    prontuarioAtual,
    verificarExemploJaCarregado,
    carregarConsultasExemplo,
    carregarMedicamentosExemplo,
    carregarAlergiasExemplo,
    carregarCirurgiasExemplo,
    carregarHistoricoFamiliarExemplo,
    carregarAnexosExemplo
  ]);

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

  // Função para adicionar uma nova cirurgia ao prontuário atual
  const adicionarCirurgia = useCallback(
    async (cirurgia) => {
      if (!prontuarioAtual?.id) {
        throw new Error("Nenhum prontuário selecionado");
      }

      setLoading(true);
      setError(null);
      try {
        const cirurgias = [...(prontuarioAtual.cirurgias || []), cirurgia];
        const prontuarioAtualizado = updateProntuario(prontuarioAtual.id, {
          ...prontuarioAtual,
          cirurgias
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

  const abrirModalAnexarDocumento = () => {
    setModalAnexarDocumentoAberto(true);
  };

  const fecharModalAnexarDocumento = () => {
    setModalAnexarDocumentoAberto(false);
  };

  const anexarDocumento = async (documento) => {
    if (!prontuarioAtual) return;
    try {
      // Lógica para anexar o documento ao prontuário
      console.log('Documento anexado:', documento);
    } catch (error) {
      console.error('Erro ao anexar documento:', error);
      setError('Erro ao anexar documento. Tente novamente.');
    }
  };

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
        adicionarCirurgia,
        limparProntuario,
        carregarConsultasExemplo,
        carregarMedicamentosExemplo,
        carregarAlergiasExemplo,
        carregarCirurgiasExemplo,
        carregarHistoricoFamiliarExemplo,
        carregarAnexosExemplo,
        carregarTodosExemplos,
        verificarExemploJaCarregado,
        reinicializarDados,
        adicionarHistoricoFamiliar: () => {},
        limparDados: limparProntuario,
        modalAnexarDocumentoAberto,
        abrirModalAnexarDocumento,
        fecharModalAnexarDocumento,
        anexarDocumento
      }}
    >
      {children}
      <AnexarDocumentoModal
        open={modalAnexarDocumentoAberto}
        onClose={fecharModalAnexarDocumento}
        onAnexar={anexarDocumento}
      />
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
