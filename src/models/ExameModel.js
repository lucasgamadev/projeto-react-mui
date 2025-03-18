import { serverTimestamp } from "firebase/firestore";

class ExameModel {
  constructor() {
    this.collection = "exames";
  }

  // Cadastrar novo tipo de exame
  async cadastrarTipoExame(tipoExame) {
    try {
      const tiposExamesRef = {
        add: (data) =>
          Promise.resolve({ id: "mock-id-" + Math.random().toString(36).substr(2, 9), ...data })
      };
      const docRef = await tiposExamesRef.add({
        nome: tipoExame.nome,
        descricao: tipoExame.descricao,
        preparoNecessario: tipoExame.preparoNecessario || "",
        valoresReferencia: tipoExame.valoresReferencia || {},
        categoria: tipoExame.categoria || "Geral",
        dataCriacao: serverTimestamp()
      });
      return { id: docRef.id, ...tipoExame };
    } catch (error) {
      console.error("Erro ao cadastrar tipo de exame:", error);
      throw error;
    }
  }

  // Listar todos os tipos de exames
  async listarTiposExames() {
    try {
      // Simulação de resposta para desenvolvimento
      return [
        {
          id: "tipo1",
          nome: "Hemograma Completo",
          descricao: "Análise completa das células sanguíneas",
          preparoNecessario: "Jejum de 8 horas",
          categoria: "Hematologia",
          valoresReferencia: {
            Hemoglobina: { minimo: "12", maximo: "16", unidade: "g/dL" },
            Hematócrito: { minimo: "36", maximo: "47", unidade: "%" },
            Leucócitos: { minimo: "4000", maximo: "10000", unidade: "mm³" },
            Plaquetas: { minimo: "150000", maximo: "450000", unidade: "mm³" }
          }
        },
        {
          id: "tipo2",
          nome: "Glicemia de Jejum",
          descricao: "Medição do nível de glicose no sangue",
          preparoNecessario: "Jejum de 8 horas",
          categoria: "Bioquímica",
          valoresReferencia: {
            Glicose: { minimo: "70", maximo: "99", unidade: "mg/dL" }
          }
        },
        {
          id: "tipo3",
          nome: "Colesterol Total e Frações",
          descricao: "Avaliação dos níveis de colesterol e triglicerídeos",
          preparoNecessario: "Jejum de 12 horas",
          categoria: "Bioquímica",
          valoresReferencia: {
            "Colesterol Total": { minimo: "0", maximo: "200", unidade: "mg/dL" },
            HDL: { minimo: "40", maximo: "60", unidade: "mg/dL" },
            LDL: { minimo: "0", maximo: "130", unidade: "mg/dL" },
            Triglicerídeos: { minimo: "0", maximo: "150", unidade: "mg/dL" }
          }
        }
      ];
    } catch (error) {
      console.error("Erro ao listar tipos de exames:", error);
      throw error;
    }
  }

  // Solicitar um exame para um paciente
  async solicitarExame(solicitacao) {
    try {
      const exameSolicitado = {
        pacienteId: solicitacao.pacienteId,
        medicoId: solicitacao.medicoId,
        tipoExameId: solicitacao.tipoExameId,
        dataRequisicao: serverTimestamp(),
        dataPrevista: solicitacao.dataPrevista || null,
        prioridade: solicitacao.prioridade || "Normal",
        observacoes: solicitacao.observacoes || "",
        status: "Solicitado",
        consultaId: solicitacao.consultaId || null,
        resultado: null
      };

      // Simulação de resposta para desenvolvimento
      return {
        id: "exame-" + Math.random().toString(36).substr(2, 9),
        ...exameSolicitado
      };
    } catch (error) {
      console.error("Erro ao solicitar exame:", error);
      throw error;
    }
  }

  // Registrar resultado de exame
  async registrarResultado(exameId, resultado) {
    try {
      // Simulação para desenvolvimento
      return {
        id: exameId,
        resultado: {
          ...resultado,
          dataRegistro: serverTimestamp()
        },
        status: "Concluído"
      };
    } catch (error) {
      console.error("Erro ao registrar resultado do exame:", error);
      throw error;
    }
  }

  // Listar exames de um paciente
  async listarExamesPaciente(pacienteId) {
    try {
      // Simulação de resposta para desenvolvimento
      return [
        {
          id: "exame1",
          pacienteId: pacienteId,
          pacienteNome: "João Silva",
          medicoId: "medico1",
          tipoExameId: "tipo1",
          dataRequisicao: new Date("2025-03-15T10:00:00"),
          dataPrevista: new Date("2025-03-20"),
          prioridade: "Normal",
          observacoes: "Paciente com histórico de anemia",
          status: "Concluído",
          consultaId: "consulta1",
          tipoExame: {
            id: "tipo1",
            nome: "Hemograma Completo",
            descricao: "Análise completa das células sanguíneas",
            categoria: "Hematologia",
            valoresReferencia: {
              Hemoglobina: { minimo: "12", maximo: "16", unidade: "g/dL" },
              Hematócrito: { minimo: "36", maximo: "47", unidade: "%" },
              Leucócitos: { minimo: "4000", maximo: "10000", unidade: "mm³" },
              Plaquetas: { minimo: "150000", maximo: "450000", unidade: "mm³" }
            }
          },
          resultado: {
            valores: {
              Hemoglobina: "11.5",
              Hematócrito: "35",
              Leucócitos: "9000",
              Plaquetas: "200000"
            },
            observacoes: "Hemoglobina ligeiramente abaixo do valor de referência",
            dataRegistro: new Date("2025-03-22T14:30:00")
          }
        },
        {
          id: "exame2",
          pacienteId: pacienteId,
          pacienteNome: "João Silva",
          medicoId: "medico1",
          tipoExameId: "tipo2",
          dataRequisicao: new Date("2025-03-15T10:00:00"),
          dataPrevista: new Date("2025-03-20"),
          prioridade: "Alta",
          observacoes: "Paciente diabético",
          status: "Solicitado",
          consultaId: "consulta1",
          tipoExame: {
            id: "tipo2",
            nome: "Glicemia de Jejum",
            descricao: "Medição do nível de glicose no sangue",
            categoria: "Bioquímica",
            valoresReferencia: {
              Glicose: { minimo: "70", maximo: "99", unidade: "mg/dL" }
            }
          }
        }
      ];
    } catch (error) {
      console.error("Erro ao listar exames do paciente:", error);
      throw error;
    }
  }

  // Verificar exames com resultados críticos
  async verificarResultadosCriticos() {
    try {
      // Simulação de resposta para desenvolvimento
      return [
        {
          id: "exame3",
          pacienteId: "paciente2",
          pacienteNome: "Maria Oliveira",
          medicoId: "medico1",
          tipoExameId: "tipo2",
          dataRequisicao: new Date("2025-03-16T09:00:00"),
          status: "Concluído",
          tipoExame: {
            id: "tipo2",
            nome: "Glicemia de Jejum",
            descricao: "Medição do nível de glicose no sangue",
            categoria: "Bioquímica",
            valoresReferencia: {
              Glicose: { minimo: "70", maximo: "99", unidade: "mg/dL" }
            }
          },
          resultado: {
            valores: {
              Glicose: "180"
            },
            observacoes: "Paciente com glicemia elevada",
            dataRegistro: new Date("2025-03-18T10:15:00")
          }
        },
        {
          id: "exame4",
          pacienteId: "paciente3",
          pacienteNome: "Carlos Pereira",
          medicoId: "medico2",
          tipoExameId: "tipo3",
          dataRequisicao: new Date("2025-03-17T11:00:00"),
          status: "Concluído",
          tipoExame: {
            id: "tipo3",
            nome: "Colesterol Total e Frações",
            descricao: "Avaliação dos níveis de colesterol e triglicerídeos",
            categoria: "Bioquímica",
            valoresReferencia: {
              "Colesterol Total": { minimo: "0", maximo: "200", unidade: "mg/dL" },
              HDL: { minimo: "40", maximo: "60", unidade: "mg/dL" },
              LDL: { minimo: "0", maximo: "130", unidade: "mg/dL" },
              Triglicerídeos: { minimo: "0", maximo: "150", unidade: "mg/dL" }
            }
          },
          resultado: {
            valores: {
              "Colesterol Total": "280",
              HDL: "35",
              LDL: "190",
              Triglicerídeos: "200"
            },
            observacoes: "Paciente com dislipidemia severa",
            dataRegistro: new Date("2025-03-19T16:45:00")
          }
        }
      ];
    } catch (error) {
      console.error("Erro ao verificar resultados críticos:", error);
      throw error;
    }
  }

  // Cancelar solicitação de exame
  async cancelarExame(exameId, motivoCancelamento) {
    try {
      // Simulação para desenvolvimento
      return {
        id: exameId,
        status: "Cancelado",
        motivoCancelamento,
        dataCancelamento: serverTimestamp()
      };
    } catch (error) {
      console.error("Erro ao cancelar exame:", error);
      throw error;
    }
  }
}

const exameModel = new ExameModel();
export default exameModel;
