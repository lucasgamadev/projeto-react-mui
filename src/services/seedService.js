import dadosExemplo from "../data/dadosExemplo.json";
import { getProntuariosByCPF, getStorageData, saveStorageData } from "./localStorageService";

// Lista de pacientes exemplo com IDs fixos para garantir consistência
const pacientesExemplo = [
  {
    id: 1,
    nomePaciente: "Maria Silva",
    cpf: "123.456.789-00",
    dataNascimento: "15/05/1985"
  },
  {
    id: 2,
    nomePaciente: "João Oliveira",
    cpf: "987.654.321-00",
    dataNascimento: "22/11/1978"
  },
  {
    id: 3,
    nomePaciente: "Ana Carolina Santos",
    cpf: "111.222.333-44",
    dataNascimento: "30/07/1992"
  },
  {
    id: 4,
    nomePaciente: "Roberto Almeida",
    cpf: "555.666.777-88",
    dataNascimento: "14/03/1965"
  },
  {
    id: 5,
    nomePaciente: "Fernanda Costa",
    cpf: "999.888.777-66",
    dataNascimento: "05/12/1983"
  }
];

export const popularPacientes = async () => {
  console.log("Verificando dados de exemplo...");
  try {
    let prontuariosCriados = 0;
    const data = getStorageData();

    // Verifica cada paciente do arquivo JSON
    for (const paciente of dadosExemplo.pacientes) {
      // Busca o ID correspondente no pacientesExemplo
      const pacienteCorrespondente = pacientesExemplo.find((p) => p.cpf === paciente.cpf);

      if (!pacienteCorrespondente) {
        console.log(
          `Não existe correspondência para ${paciente.nomePaciente} nos pacientes de exemplo`
        );
        continue;
      }

      // Verifica se já existe um prontuário para este paciente
      const existentes = getProntuariosByCPF(paciente.cpf);

      if (existentes.length === 0) {
        console.log(`Criando prontuário para ${paciente.nomePaciente}`);

        // Pula a geração automática de ID e usa o ID fixo do pacientesExemplo
        const novoProntuario = {
          id: pacienteCorrespondente.id, // Usa o ID fixo
          ...paciente,
          dataCriacao: new Date().toISOString(),
          ultimaAtualizacao: new Date().toISOString()
        };

        // Adiciona direto à estrutura de dados
        data.prontuarios.push(novoProntuario);

        // Atualiza lastId se necessário
        if (pacienteCorrespondente.id > data.lastId) {
          data.lastId = pacienteCorrespondente.id;
        }

        prontuariosCriados++;
        console.log(
          `✓ Paciente ${paciente.nomePaciente} adicionado com sucesso (ID: ${novoProntuario.id})`
        );
      } else {
        console.log(`Paciente ${paciente.nomePaciente} já existe no sistema`);
      }
    }

    // Salva as alterações no localStorage
    saveStorageData(data);

    console.log(`Total de ${prontuariosCriados} prontuários criados`);
    return prontuariosCriados;
  } catch (error) {
    console.error("Erro ao popular dados de exemplo:", error);
    throw error;
  }
};

export default {
  popularPacientes
};
