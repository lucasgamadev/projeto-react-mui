/**
 * Modelo para Sistema de Triagem com Classificação de Risco
 *
 * Este modelo define a estrutura de dados para o sistema de triagem,
 * incluindo classificação de risco, sinais vitais e fluxo de atendimento.
 * A classificação é baseada no Protocolo de Manchester, amplamente utilizado em serviços de emergência.
 */

/**
 * Estrutura base da triagem
 * @typedef {Object} Triagem
 * @property {number} id - Identificador único da triagem
 * @property {number} pacienteId - Identificador do paciente
 * @property {string} nomePaciente - Nome do paciente
 * @property {Date} dataHora - Data e hora da triagem
 * @property {string} status - Status atual (aguardando, em triagem, concluída, cancelada)
 * @property {string} classificacaoRisco - Classificação de risco (vermelho, laranja, amarelo, verde, azul)
 * @property {string} motivoAtendimento - Descrição do motivo principal de atendimento
 * @property {string} queixaPrincipal - Detalhamento da queixa principal
 * @property {Array<string>} sintomas - Lista de sintomas relatados
 * @property {number} tempoEstimadoAtendimento - Tempo estimado para atendimento em minutos
 * @property {SinaisVitais} sinaisVitais - Sinais vitais medidos durante a triagem
 * @property {HistoricoRelevante} historicoRelevante - Histórico médico relevante para a triagem
 * @property {string} observacoesEnfermagem - Observações registradas pelo profissional de enfermagem
 * @property {string} profissionalTriagem - Nome do profissional que realizou a triagem
 * @property {string} localAtendimento - Local para onde o paciente foi direcionado após a triagem
 * @property {Object} criteriosClassificacao - Critérios utilizados para classificação de risco
 * @property {Date} dataConclusaoTriagem - Data e hora de conclusão da triagem
 */

/**
 * Sinais vitais do paciente
 * @typedef {Object} SinaisVitais
 * @property {number} pressaoArterialSistolica - Pressão arterial sistólica (mmHg)
 * @property {number} pressaoArterialDiastolica - Pressão arterial diastólica (mmHg)
 * @property {number} frequenciaCardiaca - Frequência cardíaca (bpm)
 * @property {number} frequenciaRespiratoria - Frequência respiratória (irpm)
 * @property {number} temperatura - Temperatura corporal (°C)
 * @property {number} saturacaoOxigenio - Saturação de oxigênio (%)
 * @property {number} glicemia - Nível de glicose (mg/dL)
 * @property {string} nivelConsciencia - Escala de consciência (AVPU: Alerta, Voz, Dor, Inconsciente)
 * @property {number} escalaGlasgow - Pontuação na escala de coma de Glasgow (3-15)
 * @property {number} escalaDor - Escala de dor (0-10)
 */

/**
 * Histórico médico relevante para triagem
 * @typedef {Object} HistoricoRelevante
 * @property {Array<string>} alergias - Lista de alergias
 * @property {Array<string>} medicamentosEmUso - Lista de medicamentos em uso
 * @property {Array<string>} doencasPrevias - Lista de doenças prévias
 * @property {Array<string>} cirurgias - Lista de cirurgias prévias
 * @property {boolean} gestante - Indica se paciente está gestante
 * @property {number} semanasGestacao - Semanas de gestação (se aplicável)
 * @property {Array<string>} condicoesRelevantes - Outras condições relevantes
 */

/**
 * Definição dos tempos máximos de espera por classificação
 */
export const temposMaximosEspera = {
  vermelho: 0, // Atendimento imediato
  laranja: 10, // Até 10 minutos
  amarelo: 60, // Até 60 minutos
  verde: 120, // Até 120 minutos
  azul: 240 // Até 240 minutos
};

/**
 * Critérios para Classificação de Risco (baseado no Protocolo de Manchester)
 */
export const criteriosClassificacaoRisco = {
  vermelho: [
    "Parada cardiorrespiratória",
    "Insuficiência respiratória grave",
    "Choque",
    "Coma (Glasgow ≤ 8)",
    "Convulsão em atividade",
    "Dor torácica com alterações no ECG",
    "Politrauma grave",
    "Hemorragia exsanguinante",
    "Comprometimento de vias aéreas"
  ],
  laranja: [
    "Alteração do estado mental",
    "Dor severa (7-10)",
    "Hemorragia maior controlável",
    "Trauma cranioencefálico com alteração neurológica",
    "Trauma torácico",
    "Queimaduras graves (>15% da área corporal)",
    "Desidratação grave",
    "Febre alta (>39,5°C)",
    "Hipertensão severa (>220/130 mmHg)",
    "Dispneia intensa"
  ],
  amarelo: [
    "Dor moderada (4-6)",
    "Febre (38-39,5°C)",
    "Vômitos persistentes",
    "Cefaleia significativa com sinais de alerta",
    "Trauma moderado",
    "Diarreia com sinais de desidratação",
    "Idoso com alteração aguda de funcionalidade",
    "Gestante com dor abdominal ou sangramento vaginal",
    "Crise hipertensiva (PA > 180/110 mmHg)",
    "História de doença psiquiátrica com agitação"
  ],
  verde: [
    "Dor leve (1-3)",
    "Febre baixa (<38°C)",
    "Vômito ou diarreia sem desidratação",
    "Cefaleia sem sinais de alerta",
    "Trauma leve",
    "Dor abdominal leve",
    "Infecções localizadas",
    "Doenças crônicas com sintomas controlados",
    "Feridas com necessidade de sutura sem sangramento ativo"
  ],
  azul: [
    "Queixas crônicas sem alteração aguda",
    "Sintomas de infecção de vias aéreas superiores sem comprometimento",
    "Queixas dermatológicas sem sinais sistêmicos",
    "Problemas administrativos (atestados, receitas)",
    "Procedimentos eletivos (trocas de sondas, curativos)"
  ]
};

/**
 * Função para criar uma nova triagem
 * @param {Object} dadosPaciente - Dados básicos do paciente
 * @returns {Triagem} Nova triagem
 */
export const criarTriagem = (dadosPaciente) => {
  return {
    id: Date.now(),
    pacienteId: dadosPaciente.id,
    nomePaciente: dadosPaciente.nome,
    dataHora: new Date(),
    status: "aguardando",
    classificacaoRisco: null,
    motivoAtendimento: "",
    queixaPrincipal: "",
    sintomas: [],
    tempoEstimadoAtendimento: null,
    sinaisVitais: {
      pressaoArterialSistolica: null,
      pressaoArterialDiastolica: null,
      frequenciaCardiaca: null,
      frequenciaRespiratoria: null,
      temperatura: null,
      saturacaoOxigenio: null,
      glicemia: null,
      nivelConsciencia: "Alerta",
      escalaGlasgow: 15,
      escalaDor: 0
    },
    historicoRelevante: {
      alergias: [],
      medicamentosEmUso: [],
      doencasPrevias: [],
      cirurgias: [],
      gestante: false,
      semanasGestacao: null,
      condicoesRelevantes: []
    },
    observacoesEnfermagem: "",
    profissionalTriagem: "",
    localAtendimento: "",
    criteriosClassificacao: {},
    dataConclusaoTriagem: null
  };
};

/**
 * Função para classificar o risco baseado nos critérios e sinais vitais
 * Esta é uma função simplificada, em um ambiente real seria mais complexa
 * @param {Object} triagem - Objeto de triagem com dados preenchidos
 * @returns {string} Classificação de risco (vermelho, laranja, amarelo, verde ou azul)
 */
export const classificarRisco = (triagem) => {
  const { sinaisVitais, sintomas, queixaPrincipal } = triagem;

  // Verificação para classificação vermelha (emergência)
  if (
    sinaisVitais.nivelConsciencia === "Inconsciente" ||
    sinaisVitais.escalaGlasgow <= 8 ||
    sinaisVitais.frequenciaRespiratoria < 8 ||
    sinaisVitais.frequenciaRespiratoria > 35 ||
    sinaisVitais.saturacaoOxigenio < 85 ||
    sinaisVitais.pressaoArterialSistolica < 80
  ) {
    return "vermelho";
  }

  // Verificação para classificação laranja (muito urgente)
  if (
    sinaisVitais.nivelConsciencia === "Dor" ||
    sinaisVitais.escalaGlasgow <= 12 ||
    sinaisVitais.frequenciaCardiaca > 140 ||
    sinaisVitais.frequenciaCardiaca < 40 ||
    sinaisVitais.pressaoArterialSistolica > 220 ||
    sinaisVitais.temperatura > 39.5 ||
    sinaisVitais.escalaDor >= 7
  ) {
    return "laranja";
  }

  // Verificação para classificação amarela (urgente)
  if (
    sinaisVitais.nivelConsciencia === "Voz" ||
    sinaisVitais.frequenciaCardiaca > 120 ||
    sinaisVitais.frequenciaRespiratoria > 25 ||
    sinaisVitais.pressaoArterialSistolica > 180 ||
    sinaisVitais.pressaoArterialDiastolica > 110 ||
    sinaisVitais.temperatura >= 38 ||
    sinaisVitais.escalaDor >= 4
  ) {
    return "amarelo";
  }

  // Verificação para classificação verde (pouco urgente)
  if (
    sinaisVitais.escalaDor >= 1 ||
    sinaisVitais.temperatura > 37.5 ||
    sinaisVitais.frequenciaCardiaca > 100 ||
    sintomas.length > 1
  ) {
    return "verde";
  }

  // Se não atender a nenhum critério acima, classifica como azul (não urgente)
  return "azul";
};

/**
 * Função para calcular o tempo estimado de atendimento baseado na classificação
 * @param {string} classificacao - Classificação de risco
 * @returns {number} Tempo máximo de atendimento em minutos
 */
export const calcularTempoAtendimento = (classificacao) => {
  return temposMaximosEspera[classificacao] || temposMaximosEspera.azul;
};

/**
 * Função para concluir a triagem
 * @param {Triagem} triagem - Objeto de triagem preenchido
 * @param {string} classificacao - Classificação de risco definida
 * @param {string} profissional - Profissional que realizou a triagem
 * @returns {Triagem} Triagem atualizada
 */
export const concluirTriagem = (triagem, classificacao, profissional) => {
  return {
    ...triagem,
    status: "concluída",
    classificacaoRisco: classificacao,
    tempoEstimadoAtendimento: calcularTempoAtendimento(classificacao),
    profissionalTriagem: profissional,
    dataConclusaoTriagem: new Date(),
    criteriosClassificacao: {
      classificacao,
      criterios: criteriosClassificacaoRisco[classificacao]
    }
  };
};

/**
 * Exemplo de triagem para testes
 */
export const triagemExemplo = {
  id: 5001,
  pacienteId: 101,
  nomePaciente: "Maria Silva",
  dataHora: new Date("2023-10-15T08:30:00"),
  status: "concluída",
  classificacaoRisco: "amarelo",
  motivoAtendimento: "Dor abdominal e febre",
  queixaPrincipal: "Dor na região do estômago que piora após alimentação",
  sintomas: ["Dor abdominal", "Febre", "Náusea", "Vômito"],
  tempoEstimadoAtendimento: 60,
  sinaisVitais: {
    pressaoArterialSistolica: 145,
    pressaoArterialDiastolica: 95,
    frequenciaCardiaca: 105,
    frequenciaRespiratoria: 18,
    temperatura: 38.2,
    saturacaoOxigenio: 97,
    glicemia: 110,
    nivelConsciencia: "Alerta",
    escalaGlasgow: 15,
    escalaDor: 5
  },
  historicoRelevante: {
    alergias: ["Penicilina"],
    medicamentosEmUso: ["Omeprazol 20mg"],
    doencasPrevias: ["Gastrite"],
    cirurgias: [],
    gestante: false,
    semanasGestacao: null,
    condicoesRelevantes: []
  },
  observacoesEnfermagem:
    "Paciente apresenta dor à palpação em região epigástrica. Sinais vitais alterados.",
  profissionalTriagem: "Enfermeira Ana Santos",
  localAtendimento: "Consultório 3",
  criteriosClassificacao: {
    classificacao: "amarelo",
    criterios: ["Dor moderada (4-6)", "Febre (38-39,5°C)", "Vômitos persistentes"]
  },
  dataConclusaoTriagem: new Date("2023-10-15T08:45:00")
};
