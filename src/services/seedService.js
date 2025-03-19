import { addProntuario, getProntuariosByCPF } from "./localStorageService";

const pacientesExemplo = [
  {
    nomePaciente: "Maria Silva",
    dataNascimento: "15/05/1985",
    sexo: "F",
    cpf: "123.456.789-00",
    contatos: [
      { tipo: "Celular", valor: "(11) 98765-4321", principal: true },
      { tipo: "Email", valor: "maria.silva@email.com", principal: false }
    ],
    dadosPessoais: {
      estadoCivil: "Casada",
      profissao: "Professora",
      nacionalidade: "Brasileira",
      naturalidade: "São Paulo - SP",
      endereco: "Rua das Flores, 123 - Jardim Primavera, São Paulo - SP",
      tipoSanguineo: "O+",
      convenio: "Saúde Total",
      numeroConvenio: "987654321"
    }
  },
  {
    nomePaciente: "João Oliveira",
    dataNascimento: "22/11/1978",
    sexo: "M",
    cpf: "987.654.321-00",
    contatos: [
      { tipo: "Celular", valor: "(11) 97777-8888", principal: true },
      { tipo: "Residencial", valor: "(11) 2222-3333", principal: false }
    ],
    dadosPessoais: {
      estadoCivil: "Solteiro",
      profissao: "Engenheiro",
      nacionalidade: "Brasileira",
      naturalidade: "Rio de Janeiro - RJ",
      endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
      tipoSanguineo: "A+",
      convenio: "Vida Segura",
      numeroConvenio: "123789456"
    }
  },
  {
    nomePaciente: "Ana Carolina Santos",
    dataNascimento: "30/07/1992",
    sexo: "F",
    cpf: "111.222.333-44",
    contatos: [
      { tipo: "Celular", valor: "(11) 96666-5555", principal: true },
      { tipo: "Email", valor: "ana.santos@email.com", principal: false }
    ],
    dadosPessoais: {
      estadoCivil: "Solteira",
      profissao: "Advogada",
      nacionalidade: "Brasileira",
      naturalidade: "Curitiba - PR",
      endereco: "Rua Augusta, 500 - Consolação, São Paulo - SP",
      tipoSanguineo: "B-",
      convenio: "Saúde Prime",
      numeroConvenio: "456123789"
    }
  },
  {
    nomePaciente: "Roberto Almeida",
    dataNascimento: "14/03/1965",
    sexo: "M",
    cpf: "555.666.777-88",
    contatos: [{ tipo: "Celular", valor: "(11) 95555-4444", principal: true }],
    dadosPessoais: {
      estadoCivil: "Casado",
      profissao: "Empresário",
      nacionalidade: "Brasileira",
      naturalidade: "Salvador - BA",
      endereco: "Rua Oscar Freire, 800 - Jardins, São Paulo - SP",
      tipoSanguineo: "AB+",
      convenio: "Saúde Premium",
      numeroConvenio: "789456123"
    }
  },
  {
    nomePaciente: "Fernanda Costa",
    dataNascimento: "05/12/1983",
    sexo: "F",
    cpf: "999.888.777-66",
    contatos: [
      { tipo: "Celular", valor: "(11) 94444-3333", principal: true },
      { tipo: "Email", valor: "fernanda.costa@email.com", principal: false }
    ],
    dadosPessoais: {
      estadoCivil: "Divorciada",
      profissao: "Médica",
      nacionalidade: "Brasileira",
      naturalidade: "Belo Horizonte - MG",
      endereco: "Alameda Santos, 300 - Paraíso, São Paulo - SP",
      tipoSanguineo: "O-",
      convenio: "Saúde Gold",
      numeroConvenio: "321654987"
    }
  }
];

export const popularPacientes = async () => {
  try {
    console.log("Iniciando população de pacientes...");
    const resultados = [];

    for (const paciente of pacientesExemplo) {
      try {
        // Verifica se já existe um prontuário com este CPF
        const existentes = getProntuariosByCPF(paciente.cpf);

        if (existentes.length === 0) {
          // Adiciona o novo prontuário
          const novoProntuario = addProntuario({
            ...paciente,
            consultas: [],
            medicamentos: [],
            exames: [],
            alergias: [],
            cirurgias: [],
            historicoFamiliar: {
              doencas: [],
              observacoes: ""
            },
            anexos: [],
            observacoes: []
          });

          resultados.push({
            nome: paciente.nomePaciente,
            id: novoProntuario.id,
            sucesso: true
          });

          console.log(
            `✓ Paciente ${paciente.nomePaciente} adicionado com sucesso (ID: ${novoProntuario.id})`
          );
        } else {
          console.log(`⚠ Paciente com CPF ${paciente.cpf} já existe. Ignorando...`);
          resultados.push({
            nome: paciente.nomePaciente,
            erro: "CPF já cadastrado",
            sucesso: false
          });
        }
      } catch (error) {
        console.error(`✗ Erro ao adicionar paciente ${paciente.nomePaciente}:`, error);
        resultados.push({
          nome: paciente.nomePaciente,
          erro: error.message,
          sucesso: false
        });
      }
    }

    const sucessos = resultados.filter((r) => r.sucesso).length;
    const falhas = resultados.filter((r) => !r.sucesso).length;

    console.log(`\nPopulação de pacientes concluída!`);
    console.log(`Sucesso: ${sucessos} | Falhas: ${falhas}`);

    if (falhas === resultados.length) {
      throw new Error(`Nenhum paciente foi adicionado (${falhas} falhas)`);
    }

    return resultados;
  } catch (error) {
    console.error("Erro ao popular pacientes:", error);
    throw error;
  }
};

export default {
  popularPacientes
};
