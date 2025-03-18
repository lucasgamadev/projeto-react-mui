import { db } from "../firebase/config";

class MedicamentoModel {
  constructor() {
    // Não precisamos criar uma referência de coleção diretamente
    // com o mock atual, apenas armazenamos o nome da coleção
    this.collectionName = "medicamentos";
  }

  // Adicionar um novo medicamento
  async adicionarMedicamento(medicamentoData) {
    try {
      const docRef = await db.collection(this.collectionName).add({
        ...medicamentoData,
        dataCadastro: new Date(),
        ativo: true
      });
      return { id: docRef.id, ...medicamentoData };
    } catch (error) {
      console.error("Erro ao adicionar medicamento:", error);
      throw error;
    }
  }

  // Buscar todos os medicamentos
  async buscarTodosMedicamentos() {
    try {
      // Simulamos a resposta já que o mock não suporta query complexas
      return [
        {
          id: "med1",
          nome: "Paracetamol",
          principioAtivo: "Paracetamol",
          dosagem: 500,
          unidadeDosagem: "mg",
          formaFarmaceutica: "Comprimido",
          quantidadeEstoque: 100,
          ativo: true
        },
        {
          id: "med2",
          nome: "Dipirona",
          principioAtivo: "Dipirona Sódica",
          dosagem: 500,
          unidadeDosagem: "mg",
          formaFarmaceutica: "Comprimido",
          quantidadeEstoque: 80,
          ativo: true
        },
        {
          id: "med3",
          nome: "Ibuprofeno",
          principioAtivo: "Ibuprofeno",
          dosagem: 400,
          unidadeDosagem: "mg",
          formaFarmaceutica: "Comprimido",
          quantidadeEstoque: 60,
          ativo: true
        },
        {
          id: "med4",
          nome: "Amoxicilina",
          principioAtivo: "Amoxicilina",
          dosagem: 500,
          unidadeDosagem: "mg",
          formaFarmaceutica: "Cápsula",
          quantidadeEstoque: 40,
          ativo: true
        },
        {
          id: "med5",
          nome: "Omeprazol",
          principioAtivo: "Omeprazol",
          dosagem: 20,
          unidadeDosagem: "mg",
          formaFarmaceutica: "Cápsula",
          quantidadeEstoque: 75,
          ativo: true
        }
      ];
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      throw error;
    }
  }

  // Buscar medicamento por ID
  async buscarMedicamentoPorId(medicamentoId) {
    try {
      // Simulação de busca por ID já que o mock não suporta isso adequadamente
      const todos = await this.buscarTodosMedicamentos();
      const medicamento = todos.find((med) => med.id === medicamentoId);

      if (medicamento) {
        return medicamento;
      } else {
        throw new Error("Medicamento não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar medicamento:", error);
      throw error;
    }
  }

  // Buscar medicamentos por nome (parcial)
  async buscarMedicamentosPorNome(nome) {
    try {
      const todos = await this.buscarTodosMedicamentos();
      return todos.filter(
        (med) =>
          med.nome.toLowerCase().includes(nome.toLowerCase()) ||
          (med.principioAtivo && med.principioAtivo.toLowerCase().includes(nome.toLowerCase()))
      );
    } catch (error) {
      console.error("Erro ao buscar medicamentos por nome:", error);
      throw error;
    }
  }

  // Atualizar medicamento
  async atualizarMedicamento(medicamentoId, medicamentoData) {
    try {
      // Com o mock, simulamos o processo de atualização
      await Promise.resolve(); // Simula o tempo de processamento

      return { id: medicamentoId, ...medicamentoData };
    } catch (error) {
      console.error("Erro ao atualizar medicamento:", error);
      throw error;
    }
  }

  // Desativar medicamento (soft delete)
  async desativarMedicamento(medicamentoId) {
    try {
      // Com o mock, simulamos o processo de desativação
      await Promise.resolve(); // Simula o tempo de processamento

      return true;
    } catch (error) {
      console.error("Erro ao desativar medicamento:", error);
      throw error;
    }
  }

  // Excluir medicamento (hard delete)
  async excluirMedicamento(medicamentoId) {
    try {
      // Com o mock, simulamos o processo de exclusão
      await Promise.resolve(); // Simula o tempo de processamento

      return true;
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error);
      throw error;
    }
  }

  // Verificar interações medicamentosas
  async verificarInteracoesMedicamentosas(medicamentosIds) {
    try {
      // Buscar detalhes de cada medicamento
      const medicamentosPromises = medicamentosIds.map((id) => this.buscarMedicamentoPorId(id));
      const medicamentos = await Promise.all(medicamentosPromises);

      // Simular uma verificação de interações
      const interacoes = [];

      for (let i = 0; i < medicamentos.length; i++) {
        for (let j = i + 1; j < medicamentos.length; j++) {
          const medicamento1 = medicamentos[i];
          const medicamento2 = medicamentos[j];

          if (
            medicamento1.principioAtivo &&
            medicamento2.principioAtivo &&
            this._verificarInteracao(medicamento1.principioAtivo, medicamento2.principioAtivo)
          ) {
            interacoes.push({
              medicamento1: medicamento1.nome,
              medicamento2: medicamento2.nome,
              severidade: this._calcularSeveridade(medicamento1, medicamento2),
              descricao: `Possível interação entre ${medicamento1.nome} e ${medicamento2.nome}`
            });
          }
        }
      }

      return interacoes;
    } catch (error) {
      console.error("Erro ao verificar interações medicamentosas:", error);
      throw error;
    }
  }

  // Métodos auxiliares para simular a verificação de interações
  _verificarInteracao(principioAtivo1, principioAtivo2) {
    // Simulação simples - em um sistema real usaria uma base de dados médica
    const interacoesConhecidas = [
      ["Ibuprofeno", "Aspirina"],
      ["Omeprazol", "Clopidogrel"],
      ["Fluoxetina", "Tramadol"],
      ["Varfarina", "Aspirina"],
      ["Digoxina", "Amiodarona"]
    ];

    return interacoesConhecidas.some(
      ([p1, p2]) =>
        (principioAtivo1.includes(p1) && principioAtivo2.includes(p2)) ||
        (principioAtivo1.includes(p2) && principioAtivo2.includes(p1))
    );
  }

  _calcularSeveridade(medicamento1, medicamento2) {
    // Simulação - em um sistema real teria algoritmos médicos
    const interacoesGraves = [
      ["Varfarina", "Aspirina"],
      ["Fluoxetina", "Tramadol"]
    ];

    if (
      interacoesGraves.some(
        ([m1, m2]) =>
          (medicamento1.nome.includes(m1) && medicamento2.nome.includes(m2)) ||
          (medicamento1.nome.includes(m2) && medicamento2.nome.includes(m1))
      )
    ) {
      return "Alta";
    }

    return "Moderada";
  }

  // CRUD para prescrições médicas
  async criarPrescricao(prescricaoData) {
    try {
      // Com o mock, simulamos a criação de prescrição
      const id = "presc-" + Math.random().toString(36).substring(2, 9);

      return {
        id,
        ...prescricaoData,
        dataCriacao: new Date(),
        status: "Ativa"
      };
    } catch (error) {
      console.error("Erro ao criar prescrição:", error);
      throw error;
    }
  }

  async buscarPrescricoesPorPaciente(pacienteId) {
    try {
      // Simulamos prescrições para o paciente
      return [
        {
          id: "presc1",
          pacienteId,
          pacienteNome: "João Silva",
          medicamentoId: "med1",
          medicamentoNome: "Paracetamol",
          quantidade: 20,
          posologia: "1 comprimido a cada 8 horas por 7 dias",
          dataCriacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: "Ativa"
        },
        {
          id: "presc2",
          pacienteId,
          pacienteNome: "João Silva",
          medicamentoId: "med3",
          medicamentoNome: "Ibuprofeno",
          quantidade: 15,
          posologia: "1 comprimido a cada 12 horas por 5 dias",
          dataCriacao: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: "Concluída"
        }
      ];
    } catch (error) {
      console.error("Erro ao buscar prescrições do paciente:", error);
      throw error;
    }
  }

  // Controle de estoque
  async atualizarEstoque(medicamentoId, quantidade, tipo = "entrada") {
    try {
      // Simulamos a atualização de estoque
      const medicamento = await this.buscarMedicamentoPorId(medicamentoId);

      if (!medicamento) {
        throw new Error("Medicamento não encontrado");
      }

      const estoqueAtual = medicamento.quantidadeEstoque || 0;
      let novoEstoque;

      if (tipo === "entrada") {
        novoEstoque = estoqueAtual + quantidade;
      } else if (tipo === "saida") {
        if (estoqueAtual < quantidade) {
          throw new Error("Estoque insuficiente para a operação");
        }
        novoEstoque = estoqueAtual - quantidade;
      } else {
        throw new Error("Tipo de operação inválido");
      }

      medicamento.quantidadeEstoque = novoEstoque;
      medicamento.dataAtualizacaoEstoque = new Date();

      // Simulamos registrar movimentação no mock

      return {
        id: medicamentoId,
        quantidadeEstoque: novoEstoque
      };
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      throw error;
    }
  }

  async obterHistoricoEstoque(medicamentoId) {
    try {
      // Simulamos um histórico de estoque
      return [
        {
          id: "mov1",
          medicamentoId,
          tipo: "entrada",
          quantidade: 50,
          estoqueAnterior: 50,
          estoqueAtual: 100,
          dataMovimentacao: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          usuarioId: "sistema"
        },
        {
          id: "mov2",
          medicamentoId,
          tipo: "saida",
          quantidade: 10,
          estoqueAnterior: 100,
          estoqueAtual: 90,
          dataMovimentacao: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          usuarioId: "sistema"
        },
        {
          id: "mov3",
          medicamentoId,
          tipo: "saida",
          quantidade: 5,
          estoqueAnterior: 90,
          estoqueAtual: 85,
          dataMovimentacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          usuarioId: "sistema"
        }
      ];
    } catch (error) {
      console.error("Erro ao obter histórico de estoque:", error);
      throw error;
    }
  }
}

export default new MedicamentoModel();
