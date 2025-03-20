import dadosExemplo from "../data/dadosExemplo.json";
import { addProntuario, getProntuariosByCPF } from "./localStorageService";

export const popularPacientes = async () => {
  console.log("Verificando dados de exemplo...");
  try {
    let prontuariosCriados = 0;

    // Verifica cada paciente do arquivo JSON
    for (const paciente of dadosExemplo.pacientes) {
      // Verifica se já existe um prontuário para este paciente
      const existentes = getProntuariosByCPF(paciente.cpf);

      if (existentes.length === 0) {
        console.log(`Criando prontuário para ${paciente.nomePaciente}`);

        // Cria um novo prontuário com todos os dados do paciente
        const novoProntuario = addProntuario({
          ...paciente,
          dataCriacao: new Date().toISOString(),
          ultimaAtualizacao: new Date().toISOString()
        });

        prontuariosCriados++;
        console.log(
          `✓ Paciente ${paciente.nomePaciente} adicionado com sucesso (ID: ${novoProntuario.id})`
        );
      } else {
        console.log(`Paciente ${paciente.nomePaciente} já existe no sistema`);
      }
    }

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
