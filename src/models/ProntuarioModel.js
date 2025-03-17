/**
 * Modelo para Prontuário Eletrônico do Paciente (PEP)
 *
 * Este modelo define a estrutura de dados para o prontuário eletrônico,
 * incluindo informações do paciente, histórico, consultas, medicamentos e exames.
 */

/**
 * Estrutura base do prontuário eletrônico
 * @typedef {Object} Prontuario
 * @property {number} id - Identificador único do prontuário
 * @property {number} pacienteId - Identificador do paciente
 * @property {string} nomePaciente - Nome completo do paciente
 * @property {string} dataNascimento - Data de nascimento no formato DD/MM/AAAA
 * @property {string} sexo - Sexo do paciente ('M', 'F', 'Outro')
 * @property {string} cpf - CPF do paciente
 * @property {Array<Contato>} contatos - Informações de contato do paciente
 * @property {InformacoesPessoais} dadosPessoais - Dados pessoais adicionais
 * @property {Array<ConsultaMedica>} consultas - Registro de consultas médicas
 * @property {Array<Medicamento>} medicamentos - Medicamentos em uso pelo paciente
 * @property {Array<Exame>} exames - Exames realizados pelo paciente
 * @property {Array<Alergia>} alergias - Registro de alergias do paciente
 * @property {Array<Cirurgia>} cirurgias - Histórico de cirurgias do paciente
 * @property {HistoricoFamiliar} historicoFamiliar - Histórico de doenças na família
 * @property {Array<Anexo>} anexos - Documentos e exames anexados ao prontuário
 * @property {Array<string>} observacoes - Observações gerais sobre o paciente
 * @property {Date} dataCriacao - Data de criação do prontuário
 * @property {Date} ultimaAtualizacao - Data da última atualização do prontuário
 */

/**
 * Informações de contato do paciente
 * @typedef {Object} Contato
 * @property {string} tipo - Tipo de contato (celular, residencial, email, etc)
 * @property {string} valor - Valor do contato (número, email, etc)
 * @property {boolean} principal - Indica se é o contato principal
 */

/**
 * Informações pessoais adicionais do paciente
 * @typedef {Object} InformacoesPessoais
 * @property {string} estadoCivil - Estado civil do paciente
 * @property {string} profissao - Profissão do paciente
 * @property {string} nacionalidade - Nacionalidade do paciente
 * @property {string} naturalidade - Cidade natal do paciente
 * @property {string} endereco - Endereço completo
 * @property {string} tipoSanguineo - Tipo sanguíneo e fator RH
 * @property {string} convenio - Convênio médico (se houver)
 * @property {string} numeroConvenio - Número do convênio médico
 */

/**
 * Registro de consulta médica
 * @typedef {Object} ConsultaMedica
 * @property {number} id - Identificador único da consulta
 * @property {Date} data - Data e hora da consulta
 * @property {string} medicoNome - Nome do médico
 * @property {string} medicoCRM - CRM do médico
 * @property {string} especialidade - Especialidade médica
 * @property {string} motivoConsulta - Motivo da consulta
 * @property {string} descricaoQueixa - Descrição detalhada da queixa/sintomas
 * @property {VitaisMedidos} sinaisVitais - Sinais vitais medidos na consulta
 * @property {string} hipoteseDiagnostica - Hipótese diagnóstica
 * @property {string} diagnosticoDefinitivo - Diagnóstico definido, se houver
 * @property {Array<string>} codigosCID - Códigos CID relacionados ao diagnóstico
 * @property {string} conduta - Conduta médica e orientações
 * @property {Array<PrescricaoMedicamento>} prescricoes - Medicamentos prescritos
 * @property {Array<SolicitacaoExame>} examesSolicitados - Exames solicitados
 * @property {Array<Encaminhamento>} encaminhamentos - Encaminhamentos realizados
 * @property {Array<Procedimento>} procedimentos - Procedimentos realizados durante a consulta
 * @property {string} observacoes - Observações adicionais sobre a consulta
 */

/**
 * Sinais vitais do paciente
 * @typedef {Object} VitaisMedidos
 * @property {number} pressaoArterialSistolica - Pressão arterial sistólica (mmHg)
 * @property {number} pressaoArterialDiastolica - Pressão arterial diastólica (mmHg)
 * @property {number} frequenciaCardiaca - Frequência cardíaca (bpm)
 * @property {number} frequenciaRespiratoria - Frequência respiratória (irpm)
 * @property {number} temperatura - Temperatura corporal (°C)
 * @property {number} saturacaoOxigenio - Saturação de oxigênio (%)
 * @property {number} peso - Peso (kg)
 * @property {number} altura - Altura (cm)
 * @property {number} imc - Índice de massa corporal (calculado)
 * @property {number} glicemia - Glicemia capilar (mg/dL), se medida
 */

/**
 * Medicamento em uso pelo paciente
 * @typedef {Object} Medicamento
 * @property {number} id - Identificador único do medicamento
 * @property {string} nome - Nome do medicamento
 * @property {string} principioAtivo - Princípio ativo do medicamento
 * @property {string} concentracao - Concentração/dose do medicamento
 * @property {string} formaFarmaceutica - Forma farmacêutica (comprimido, cápsula, injetável, etc)
 * @property {string} posologia - Posologia (instruções de uso)
 * @property {Date} dataInicio - Data de início do uso
 * @property {Date} dataFim - Data prevista para término, se aplicável
 * @property {boolean} continuo - Indica se é um medicamento de uso contínuo
 * @property {string} observacoes - Observações adicionais sobre o medicamento
 */

/**
 * Exame realizado pelo paciente
 * @typedef {Object} Exame
 * @property {number} id - Identificador único do exame
 * @property {string} nome - Nome do exame
 * @property {string} categoria - Categoria do exame (laboratorial, imagem, etc)
 * @property {Date} dataSolicitacao - Data em que o exame foi solicitado
 * @property {Date} dataRealizacao - Data em que o exame foi realizado
 * @property {Date} dataResultado - Data em que o resultado foi disponibilizado
 * @property {string} laboratorio - Local/laboratório onde foi realizado
 * @property {string} resultado - Resultado do exame
 * @property {string} valorReferencia - Valor de referência para o exame
 * @property {boolean} resultadoAnormal - Indica se o resultado está fora dos valores de referência
 * @property {string} observacoesMedico - Observações do médico sobre o resultado
 * @property {string} anexoURL - URL do arquivo anexado com o resultado detalhado
 */

/**
 * Alergia do paciente
 * @typedef {Object} Alergia
 * @property {string} tipo - Tipo de alergia (medicamento, alimento, substância, etc)
 * @property {string} agente - Agente causador da alergia
 * @property {string} reacao - Descrição da reação apresentada
 * @property {string} gravidade - Gravidade da reação (leve, moderada, grave)
 * @property {Date} dataIdentificacao - Data em que a alergia foi identificada
 * @property {string} observacoes - Observações adicionais sobre a alergia
 */

/**
 * Cirurgia realizada pelo paciente
 * @typedef {Object} Cirurgia
 * @property {string} tipo - Tipo de cirurgia realizada
 * @property {Date} data - Data da cirurgia
 * @property {string} hospital - Hospital onde foi realizada
 * @property {string} medicoResponsavel - Médico responsável pela cirurgia
 * @property {string} descricao - Descrição do procedimento
 * @property {string} resultado - Resultado/desfecho da cirurgia
 * @property {string} complicacoes - Complicações, se houver
 */

/**
 * Histórico familiar de doenças
 * @typedef {Object} HistoricoFamiliar
 * @property {Array<DoencaFamiliar>} doencas - Lista de doenças na família
 * @property {string} observacoes - Observações adicionais sobre o histórico familiar
 */

/**
 * Doença presente no histórico familiar
 * @typedef {Object} DoencaFamiliar
 * @property {string} doenca - Nome da doença
 * @property {string} parentesco - Grau de parentesco (pai, mãe, irmão, etc)
 * @property {string} observacoes - Observações adicionais sobre a doença
 */

/**
 * Prescrição de medicamento em uma consulta
 * @typedef {Object} PrescricaoMedicamento
 * @property {string} medicamento - Nome do medicamento
 * @property {string} concentracao - Concentração/dose do medicamento
 * @property {string} posologia - Posologia e instruções de uso
 * @property {string} duracao - Duração do tratamento
 * @property {boolean} continuo - Indica se é medicamento de uso contínuo
 * @property {string} observacoes - Observações adicionais sobre a prescrição
 */

/**
 * Solicitação de exame em uma consulta
 * @typedef {Object} SolicitacaoExame
 * @property {string} exame - Nome do exame solicitado
 * @property {string} justificativa - Justificativa para a solicitação
 * @property {string} preparos - Instruções de preparo para o exame
 * @property {Date} prazoRecomendado - Prazo recomendado para realização
 */

/**
 * Encaminhamento para especialista
 * @typedef {Object} Encaminhamento
 * @property {string} especialidade - Especialidade para qual o paciente foi encaminhado
 * @property {string} justificativa - Justificativa para o encaminhamento
 * @property {string} prioridade - Nível de prioridade (baixa, média, alta, urgente)
 * @property {string} orientacoes - Orientações adicionais para o especialista
 */

/**
 * Procedimento realizado durante consulta
 * @typedef {Object} Procedimento
 * @property {string} nome - Nome do procedimento
 * @property {string} descricao - Descrição do procedimento
 * @property {string} resultado - Resultado obtido
 */

/**
 * Anexo no prontuário
 * @typedef {Object} Anexo
 * @property {number} id - Identificador único do anexo
 * @property {string} nome - Nome do arquivo
 * @property {string} tipo - Tipo do arquivo (imagem, PDF, documento, etc)
 * @property {string} url - URL do arquivo
 * @property {Date} dataUpload - Data de upload do arquivo
 * @property {string} descricao - Descrição do conteúdo do anexo
 * @property {string} categoria - Categoria do anexo (exame, receita, atestado, etc)
 */

/**
 * Cria um novo prontuário com dados básicos do paciente
 * @param {Object} paciente - Dados básicos do paciente
 * @returns {Prontuario} Novo prontuário eletrônico
 */
export const criarProntuario = (paciente) => {
  return {
    id: Date.now(),
    pacienteId: paciente.id,
    nomePaciente: paciente.nome,
    dataNascimento: paciente.dataNascimento,
    sexo: paciente.sexo,
    cpf: paciente.cpf,
    contatos: paciente.contatos || [],
    dadosPessoais: {
      estadoCivil: paciente.estadoCivil || "",
      profissao: paciente.profissao || "",
      nacionalidade: paciente.nacionalidade || "Brasileira",
      naturalidade: paciente.naturalidade || "",
      endereco: paciente.endereco || "",
      tipoSanguineo: paciente.tipoSanguineo || "",
      convenio: paciente.convenio || "",
      numeroConvenio: paciente.numeroConvenio || ""
    },
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
    observacoes: [],
    dataCriacao: new Date(),
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma nova consulta ao prontuário
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {ConsultaMedica} consulta - Dados da consulta a ser adicionada
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarConsulta = (prontuario, consulta) => {
  return {
    ...prontuario,
    consultas: [...prontuario.consultas, consulta],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona um novo medicamento ao prontuário
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {Medicamento} medicamento - Dados do medicamento a ser adicionado
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarMedicamento = (prontuario, medicamento) => {
  return {
    ...prontuario,
    medicamentos: [...prontuario.medicamentos, medicamento],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona um novo exame ao prontuário
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {Exame} exame - Dados do exame a ser adicionado
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarExame = (prontuario, exame) => {
  return {
    ...prontuario,
    exames: [...prontuario.exames, exame],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma nova alergia ao prontuário
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {Alergia} alergia - Dados da alergia a ser adicionada
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarAlergia = (prontuario, alergia) => {
  return {
    ...prontuario,
    alergias: [...prontuario.alergias, alergia],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma nova cirurgia ao prontuário
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {Cirurgia} cirurgia - Dados da cirurgia a ser adicionada
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarCirurgia = (prontuario, cirurgia) => {
  return {
    ...prontuario,
    cirurgias: [...prontuario.cirurgias, cirurgia],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma doença ao histórico familiar
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {DoencaFamiliar} doenca - Dados da doença familiar a ser adicionada
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarDoencaFamiliar = (prontuario, doenca) => {
  return {
    ...prontuario,
    historicoFamiliar: {
      ...prontuario.historicoFamiliar,
      doencas: [...prontuario.historicoFamiliar.doencas, doenca]
    },
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona um anexo ao prontuário
 * @param {Prontuario} prontuario - Prontuário do paciente
 * @param {Anexo} anexo - Dados do anexo a ser adicionado
 * @returns {Prontuario} Prontuário atualizado
 */
export const adicionarAnexo = (prontuario, anexo) => {
  return {
    ...prontuario,
    anexos: [...prontuario.anexos, anexo],
    ultimaAtualizacao: new Date()
  };
};

// Dados de exemplo para testes
export const prontuarioExemplo = {
  id: 1,
  pacienteId: 101,
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
  },
  consultas: [
    {
      id: 1001,
      data: new Date(2024, 2, 10, 14, 30), // 10/03/2024 14:30
      medicoNome: "Dr. João Cardoso",
      medicoCRM: "CRM-SP 12345",
      especialidade: "Cardiologia",
      motivoConsulta: "Dor no peito e palpitações",
      descricaoQueixa:
        "Paciente relata dor no peito, palpitações e falta de ar ao realizar esforço físico há cerca de 2 semanas.",
      sinaisVitais: {
        pressaoArterialSistolica: 130,
        pressaoArterialDiastolica: 85,
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        temperatura: 36.5,
        saturacaoOxigenio: 98,
        peso: 70,
        altura: 165,
        imc: 25.7,
        glicemia: null
      },
      hipoteseDiagnostica: "Possível arritmia cardíaca",
      diagnosticoDefinitivo: "",
      codigosCID: ["I49.9"],
      conduta: "Solicitação de eletrocardiograma e ecocardiograma para investigação.",
      prescricoes: [
        {
          medicamento: "Propranolol",
          concentracao: "40mg",
          posologia: "1 comprimido de 12 em 12 horas",
          duracao: "30 dias",
          continuo: false,
          observacoes: "Tomar com água, após as refeições"
        }
      ],
      examesSolicitados: [
        {
          exame: "Eletrocardiograma",
          justificativa: "Investigação de arritmia",
          preparos: "Nenhum preparo específico necessário",
          prazoRecomendado: new Date(2024, 2, 20)
        },
        {
          exame: "Ecocardiograma",
          justificativa: "Avaliação da função cardíaca",
          preparos: "Jejum de 4 horas",
          prazoRecomendado: new Date(2024, 2, 25)
        }
      ],
      encaminhamentos: [],
      procedimentos: [],
      observacoes:
        "Paciente ansiosa durante a consulta. Retorno agendado após resultados dos exames."
    }
  ],
  medicamentos: [
    {
      id: 2001,
      nome: "Propranolol",
      principioAtivo: "Cloridrato de Propranolol",
      concentracao: "40mg",
      formaFarmaceutica: "Comprimido",
      posologia: "1 comprimido de 12 em 12 horas",
      dataInicio: new Date(2024, 2, 10),
      dataFim: new Date(2024, 3, 10),
      continuo: false,
      observacoes: "Tomar com água, após as refeições"
    }
  ],
  exames: [],
  alergias: [
    {
      tipo: "Medicamento",
      agente: "Dipirona",
      reacao: "Urticária e prurido",
      gravidade: "Moderada",
      dataIdentificacao: new Date(2020, 5, 15),
      observacoes: "Evitar medicamentos que contenham dipirona"
    }
  ],
  cirurgias: [
    {
      tipo: "Apendicectomia",
      data: new Date(2015, 3, 8),
      hospital: "Hospital Santa Casa",
      medicoResponsavel: "Dr. Roberto Santos",
      descricao: "Remoção do apêndice por via laparoscópica",
      resultado: "Sucesso, sem intercorrências",
      complicacoes: "Nenhuma"
    }
  ],
  historicoFamiliar: {
    doencas: [
      {
        doenca: "Hipertensão Arterial",
        parentesco: "Pai",
        observacoes: "Diagnóstico aos 45 anos"
      },
      {
        doenca: "Diabetes Mellitus tipo 2",
        parentesco: "Avó materna",
        observacoes: "Diagnóstico aos 60 anos"
      }
    ],
    observacoes: "Histórico familiar significativo para doenças cardiovasculares"
  },
  anexos: [],
  observacoes: ["Paciente participa de programa de condicionamento físico 3x por semana"],
  dataCriacao: new Date(2023, 1, 5),
  ultimaAtualizacao: new Date(2024, 2, 10)
};

export default {
  criarProntuario,
  adicionarConsulta,
  adicionarMedicamento,
  adicionarExame,
  adicionarAlergia,
  adicionarCirurgia,
  adicionarDoencaFamiliar,
  adicionarAnexo,
  prontuarioExemplo
};
