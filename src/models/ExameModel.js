import dadosExames from "../data/exames.json";

class ExameModel {
  constructor() {
    this.collection = "exames";
    this.dadosExames = dadosExames;
  }

  // Cadastrar novo tipo de exame
  async cadastrarTipoExame(tipoExame) {
    try {
      // Gerar ID único
      const id = "tipo" + (this.dadosExames.tiposExames.length + 1);

      const novoTipoExame = {
        id,
        nome: tipoExame.nome,
        descricao: tipoExame.descricao,
        preparoNecessario: tipoExame.preparoNecessario || "",
        valoresReferencia: tipoExame.valoresReferencia || {},
        categoria: tipoExame.categoria || "Geral",
        dataCriacao: new Date().toISOString()
      };

      // Adicionar ao array local (simulação)
      this.dadosExames.tiposExames.push(novoTipoExame);

      return novoTipoExame;
    } catch (error) {
      console.error("Erro ao cadastrar tipo de exame:", error);
      throw error;
    }
  }

  // Listar todos os tipos de exames
  async listarTiposExames() {
    try {
      // Retornar dados do JSON
      return this.dadosExames.tiposExames;
    } catch (error) {
      console.error("Erro ao listar tipos de exames:", error);
      throw error;
    }
  }

  // Solicitar um exame para um paciente
  async solicitarExame(solicitacao) {
    try {
      // Encontrar o tipo de exame
      const tipoExame = this.dadosExames.tiposExames.find(
        (tipo) => tipo.id === solicitacao.tipoExameId
      );

      // Encontrar o paciente
      const paciente = this.dadosExames.pacientes.find((p) => p.id === solicitacao.pacienteId);

      // Encontrar o médico
      const medico = this.dadosExames.medicos.find((m) => m.id === solicitacao.medicoId);

      // Gerar ID único
      const id = "exame" + (this.dadosExames.exames.length + 1);

      const exameSolicitado = {
        id,
        pacienteId: solicitacao.pacienteId,
        pacienteNome: paciente?.nome || "Paciente",
        medicoId: solicitacao.medicoId,
        medicoNome: medico?.nome || "Médico",
        tipoExameId: solicitacao.tipoExameId,
        dataRequisicao: new Date().toISOString(),
        dataPrevista: solicitacao.dataPrevista
          ? new Date(solicitacao.dataPrevista).toISOString()
          : null,
        prioridade: solicitacao.prioridade || "Normal",
        observacoes: solicitacao.observacoes || "",
        status: "Solicitado",
        consultaId: solicitacao.consultaId || null,
        tipoExame: tipoExame,
        resultado: null
      };

      // Adicionar ao array local (simulação)
      this.dadosExames.exames.push(exameSolicitado);

      return exameSolicitado;
    } catch (error) {
      console.error("Erro ao solicitar exame:", error);
      throw error;
    }
  }

  // Registrar resultado de exame
  async registrarResultado(exameId, resultado) {
    try {
      // Encontrar o exame
      const exameIndex = this.dadosExames.exames.findIndex((exame) => exame.id === exameId);

      if (exameIndex === -1) {
        throw new Error("Exame não encontrado");
      }

      // Atualizar exame com o resultado
      const exameAtualizado = {
        ...this.dadosExames.exames[exameIndex],
        resultado: {
          ...resultado,
          dataRegistro: new Date().toISOString()
        },
        status: "Concluído"
      };

      // Atualizar no array
      this.dadosExames.exames[exameIndex] = exameAtualizado;

      return exameAtualizado;
    } catch (error) {
      console.error("Erro ao registrar resultado do exame:", error);
      throw error;
    }
  }

  // Listar exames de um paciente
  async listarExamesPaciente(pacienteId) {
    try {
      // Filtrar exames do paciente
      const examesPaciente = this.dadosExames.exames.filter(
        (exame) => exame.pacienteId === pacienteId
      );

      return examesPaciente;
    } catch (error) {
      console.error("Erro ao listar exames do paciente:", error);
      throw error;
    }
  }

  // Verificar exames com resultados críticos
  async verificarResultadosCriticos() {
    try {
      // Filtrar exames com resultados críticos
      const examesConcluidos = this.dadosExames.exames.filter(
        (exame) => exame.status === "Concluído" && exame.resultado
      );

      // Verificar quais têm valores fora do range
      const examesCriticos = examesConcluidos.filter((exame) => {
        if (!exame.tipoExame || !exame.tipoExame.valoresReferencia || !exame.resultado.valores) {
          return false;
        }

        // Verificar se algum valor está fora do intervalo de referência
        return Object.entries(exame.resultado.valores).some(([parametro, valor]) => {
          const referencia = exame.tipoExame.valoresReferencia[parametro];
          if (!referencia) return false;

          const valorNumerico = parseFloat(valor);
          const minimo = parseFloat(referencia.minimo);
          const maximo = parseFloat(referencia.maximo);

          return (
            !isNaN(valorNumerico) &&
            !isNaN(minimo) &&
            !isNaN(maximo) &&
            (valorNumerico < minimo || valorNumerico > maximo)
          );
        });
      });

      return examesCriticos;
    } catch (error) {
      console.error("Erro ao verificar resultados críticos:", error);
      throw error;
    }
  }

  // Obter estatísticas de exames
  async obterEstatisticas() {
    try {
      return this.dadosExames.estatisticas;
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      throw error;
    }
  }

  // Excluir tipo de exame
  async excluirTipoExame(tipoExameId) {
    try {
      const tipoIndex = this.dadosExames.tiposExames.findIndex((tipo) => tipo.id === tipoExameId);

      if (tipoIndex === -1) {
        throw new Error("Tipo de exame não encontrado");
      }

      // Remover do array
      this.dadosExames.tiposExames.splice(tipoIndex, 1);

      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir tipo de exame:", error);
      throw error;
    }
  }

  // Listar pacientes
  async listarPacientes() {
    try {
      return this.dadosExames.pacientes;
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
      throw error;
    }
  }

  // Listar médicos
  async listarMedicos() {
    try {
      return this.dadosExames.medicos;
    } catch (error) {
      console.error("Erro ao listar médicos:", error);
      throw error;
    }
  }

  static listarExamesPaciente(pacienteId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const examesFiltrados = this.examesData
          .filter((exame) => exame.pacienteId === pacienteId)
          .map((exame) => {
            const tipoExame = this.tiposExamesData.find((tipo) => tipo.id === exame.tipoExameId);
            const paciente = this.pacientesData.find((p) => p.id === exame.pacienteId);
            const medico = this.medicosData.find((m) => m.id === exame.medicoId);

            return {
              ...exame,
              tipoExame,
              paciente,
              medico
            };
          });
        resolve(examesFiltrados);
      }, 500);
    });
  }
}

export default new ExameModel();
