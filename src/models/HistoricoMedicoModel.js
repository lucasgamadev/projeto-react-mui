/**
 * Modelo para Histórico Médico dos Pacientes
 *
 * Este modelo define a estrutura de dados para o histórico médico do paciente,
 * incluindo eventos médicos, cronologia de atendimentos e histórico de tratamentos.
 */

/**
 * Estrutura base do histórico médico
 * @typedef {Object} HistoricoMedico
 * @property {number} id - Identificador único do histórico médico
 * @property {number} pacienteId - Identificador do paciente
 * @property {Array<EventoMedico>} eventos - Lista de eventos médicos do paciente
 * @property {Array<AcompanhamentoTratamento>} tratamentos - Tratamentos em andamento ou concluídos
 * @property {Array<MetricaSaude>} metricasSaude - Métricas de saúde ao longo do tempo
 * @property {Date} ultimaAtualizacao - Data da última atualização do histórico
 */

/**
 * Evento médico registrado no histórico do paciente
 * @typedef {Object} EventoMedico
 * @property {number} id - Identificador único do evento
 * @property {string} tipo - Tipo de evento (consulta, exame, cirurgia, internação, etc)
 * @property {Date} data - Data e hora do evento
 * @property {string} titulo - Título descritivo do evento
 * @property {string} descricao - Descrição detalhada do evento
 * @property {string} local - Local onde ocorreu o evento (hospital, clínica, etc)
 * @property {string} profissional - Nome do profissional de saúde responsável
 * @property {string} especialidade - Especialidade do profissional
 * @property {Array<string>} diagnosticos - Diagnósticos relacionados ao evento
 * @property {Array<string>} procedimentos - Procedimentos realizados
 * @property {Array<string>} medicamentos - Medicamentos prescritos/utilizados
 * @property {string} resultado - Resultado ou desfecho do evento
 * @property {string} observacoes - Observações adicionais
 * @property {Array<string>} anexos - Referências a documentos anexados
 * @property {string} statusEvento - Status do evento (agendado, realizado, cancelado)
 */

/**
 * Acompanhamento de tratamento médico
 * @typedef {Object} AcompanhamentoTratamento
 * @property {number} id - Identificador único do tratamento
 * @property {string} nome - Nome do tratamento
 * @property {string} descricao - Descrição do tratamento
 * @property {string} condicaoTratada - Condição médica sendo tratada
 * @property {Date} dataInicio - Data de início do tratamento
 * @property {Date} dataFim - Data de término do tratamento (se concluído)
 * @property {string} status - Status do tratamento (em andamento, concluído, interrompido)
 * @property {string} responsavel - Profissional responsável pelo tratamento
 * @property {string} especialidade - Especialidade do profissional
 * @property {Array<EtapaTratamento>} etapas - Etapas do tratamento
 * @property {Array<AvaliacaoProgresso>} avaliacoes - Avaliações de progresso do tratamento
 * @property {string} observacoes - Observações gerais sobre o tratamento
 */

/**
 * Etapa de um tratamento médico
 * @typedef {Object} EtapaTratamento
 * @property {number} numero - Número sequencial da etapa
 * @property {string} descricao - Descrição da etapa
 * @property {Date} dataInicio - Data de início da etapa
 * @property {Date} dataFim - Data de término da etapa
 * @property {string} status - Status da etapa (pendente, em andamento, concluída)
 * @property {string} resultado - Resultado da etapa
 */

/**
 * Avaliação de progresso de um tratamento
 * @typedef {Object} AvaliacaoProgresso
 * @property {Date} data - Data da avaliação
 * @property {string} avaliador - Profissional que realizou a avaliação
 * @property {string} descricao - Descrição da avaliação
 * @property {number} progresso - Percentual de progresso (0-100)
 * @property {string} observacoes - Observações sobre o progresso
 */

/**
 * Métrica de saúde medida ao longo do tempo
 * @typedef {Object} MetricaSaude
 * @property {string} tipo - Tipo de métrica (peso, pressão arterial, glicemia, etc)
 * @property {Array<MedicaoMetrica>} medicoes - Medições da métrica ao longo do tempo
 * @property {Array<MetaMetrica>} metas - Metas estabelecidas para a métrica
 */

/**
 * Medição de uma métrica de saúde
 * @typedef {Object} MedicaoMetrica
 * @property {Date} data - Data da medição
 * @property {number} valor - Valor medido
 * @property {string} unidade - Unidade de medida
 * @property {string} contexto - Contexto da medição (em jejum, após exercício, etc)
 * @property {string} observacoes - Observações sobre a medição
 */

/**
 * Meta estabelecida para uma métrica de saúde
 * @typedef {Object} MetaMetrica
 * @property {Date} dataDefinicao - Data em que a meta foi definida
 * @property {number} valorMeta - Valor alvo da meta
 * @property {string} unidade - Unidade de medida
 * @property {Date} prazo - Prazo para atingir a meta
 * @property {string} descricao - Descrição da meta
 */

/**
 * Cria um novo histórico médico para um paciente
 * @param {number} pacienteId - ID do paciente
 * @returns {HistoricoMedico} Novo histórico médico
 */
export const criarHistoricoMedico = (pacienteId) => {
  return {
    id: Date.now(),
    pacienteId: pacienteId,
    eventos: [],
    tratamentos: [],
    metricasSaude: [],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona um novo evento médico ao histórico
 * @param {HistoricoMedico} historico - Histórico médico do paciente
 * @param {EventoMedico} evento - Evento médico a ser adicionado
 * @returns {HistoricoMedico} Histórico médico atualizado
 */
export const adicionarEvento = (historico, evento) => {
  return {
    ...historico,
    eventos: [...historico.eventos, { ...evento, id: Date.now() }],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona um novo tratamento ao histórico
 * @param {HistoricoMedico} historico - Histórico médico do paciente
 * @param {AcompanhamentoTratamento} tratamento - Tratamento a ser adicionado
 * @returns {HistoricoMedico} Histórico médico atualizado
 */
export const adicionarTratamento = (historico, tratamento) => {
  return {
    ...historico,
    tratamentos: [...historico.tratamentos, { ...tratamento, id: Date.now() }],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma nova métrica de saúde ao histórico
 * @param {HistoricoMedico} historico - Histórico médico do paciente
 * @param {MetricaSaude} metrica - Métrica de saúde a ser adicionada
 * @returns {HistoricoMedico} Histórico médico atualizado
 */
export const adicionarMetricaSaude = (historico, metrica) => {
  return {
    ...historico,
    metricasSaude: [...historico.metricasSaude, metrica],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma medição a uma métrica de saúde existente
 * @param {HistoricoMedico} historico - Histórico médico do paciente
 * @param {string} tipoMetrica - Tipo da métrica de saúde
 * @param {MedicaoMetrica} medicao - Medição a ser adicionada
 * @returns {HistoricoMedico} Histórico médico atualizado
 */
export const adicionarMedicaoMetrica = (historico, tipoMetrica, medicao) => {
  const novasMetricas = historico.metricasSaude.map((metrica) => {
    if (metrica.tipo === tipoMetrica) {
      return {
        ...metrica,
        medicoes: [...metrica.medicoes, medicao]
      };
    }
    return metrica;
  });

  return {
    ...historico,
    metricasSaude: novasMetricas,
    ultimaAtualizacao: new Date()
  };
};

/**
 * Atualiza o status de um tratamento existente
 * @param {HistoricoMedico} historico - Histórico médico do paciente
 * @param {number} tratamentoId - ID do tratamento a ser atualizado
 * @param {string} novoStatus - Novo status do tratamento
 * @returns {HistoricoMedico} Histórico médico atualizado
 */
export const atualizarStatusTratamento = (historico, tratamentoId, novoStatus) => {
  const novosTratamentos = historico.tratamentos.map((tratamento) => {
    if (tratamento.id === tratamentoId) {
      return {
        ...tratamento,
        status: novoStatus,
        dataFim: novoStatus === "concluído" ? new Date() : tratamento.dataFim
      };
    }
    return tratamento;
  });

  return {
    ...historico,
    tratamentos: novosTratamentos,
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma avaliação de progresso a um tratamento existente
 * @param {HistoricoMedico} historico - Histórico médico do paciente
 * @param {number} tratamentoId - ID do tratamento
 * @param {AvaliacaoProgresso} avaliacao - Avaliação de progresso a ser adicionada
 * @returns {HistoricoMedico} Histórico médico atualizado
 */
export const adicionarAvaliacaoTratamento = (historico, tratamentoId, avaliacao) => {
  const novosTratamentos = historico.tratamentos.map((tratamento) => {
    if (tratamento.id === tratamentoId) {
      return {
        ...tratamento,
        avaliacoes: [...tratamento.avaliacoes, avaliacao]
      };
    }
    return tratamento;
  });

  return {
    ...historico,
    tratamentos: novosTratamentos,
    ultimaAtualizacao: new Date()
  };
};

// Exemplo de histórico médico para testes
export const historicoExemplo = {
  id: 1001,
  pacienteId: 101,
  eventos: [
    {
      id: 2001,
      tipo: "consulta",
      data: new Date("2023-10-15T10:30:00"),
      titulo: "Consulta inicial - Clínico Geral",
      descricao: "Primeira consulta para avaliação geral",
      local: "Clínica Central",
      profissional: "Dr. Carlos Silva",
      especialidade: "Clínica Geral",
      diagnosticos: ["Hipertensão arterial leve", "Sobrepeso"],
      procedimentos: ["Exame físico completo", "Aferição de pressão arterial"],
      medicamentos: ["Losartana 50mg", "Hidroclorotiazida 25mg"],
      resultado: "Paciente com hipertensão controlada com medicação",
      observacoes: "Recomendado perda de peso e atividade física regular",
      anexos: ["receita_20231015.pdf"],
      statusEvento: "realizado"
    },
    {
      id: 2002,
      tipo: "exame",
      data: new Date("2023-10-20T14:00:00"),
      titulo: "Exames laboratoriais",
      descricao: "Hemograma completo e perfil lipídico",
      local: "Laboratório Central",
      profissional: "Dra. Ana Rodrigues",
      especialidade: "Patologia Clínica",
      diagnosticos: [],
      procedimentos: ["Coleta de sangue"],
      medicamentos: [],
      resultado: "Colesterol elevado, demais parâmetros normais",
      observacoes: "Recomendado ajuste na dieta",
      anexos: ["resultado_exames_20231020.pdf"],
      statusEvento: "realizado"
    }
  ],
  tratamentos: [
    {
      id: 3001,
      nome: "Tratamento para hipertensão arterial",
      descricao: "Controle de pressão arterial com medicação e mudanças no estilo de vida",
      condicaoTratada: "Hipertensão arterial leve",
      dataInicio: new Date("2023-10-15"),
      dataFim: null,
      status: "em andamento",
      responsavel: "Dr. Carlos Silva",
      especialidade: "Cardiologia",
      etapas: [
        {
          numero: 1,
          descricao: "Início da medicação anti-hipertensiva",
          dataInicio: new Date("2023-10-15"),
          dataFim: new Date("2023-11-15"),
          status: "concluída",
          resultado: "Adaptação bem-sucedida à medicação"
        },
        {
          numero: 2,
          descricao: "Ajuste de dosagem e acompanhamento",
          dataInicio: new Date("2023-11-15"),
          dataFim: null,
          status: "em andamento",
          resultado: ""
        }
      ],
      avaliacoes: [
        {
          data: new Date("2023-11-15"),
          avaliador: "Dr. Carlos Silva",
          descricao: "Avaliação após um mês de tratamento",
          progresso: 30,
          observacoes: "Pressão arterial mostrando melhora, continuar medicação"
        }
      ],
      observacoes: "Paciente apresentando boa adesão ao tratamento"
    }
  ],
  metricasSaude: [
    {
      tipo: "pressão arterial",
      medicoes: [
        {
          data: new Date("2023-10-15"),
          valor: "140/90",
          unidade: "mmHg",
          contexto: "Em consultório",
          observacoes: "Primeira medição"
        },
        {
          data: new Date("2023-11-15"),
          valor: "130/85",
          unidade: "mmHg",
          contexto: "Em consultório",
          observacoes: "Após um mês de tratamento"
        }
      ],
      metas: [
        {
          dataDefinicao: new Date("2023-10-15"),
          valorMeta: "120/80",
          unidade: "mmHg",
          prazo: new Date("2024-04-15"),
          descricao: "Meta de pressão arterial ideal"
        }
      ]
    },
    {
      tipo: "peso",
      medicoes: [
        {
          data: new Date("2023-10-15"),
          valor: 87.5,
          unidade: "kg",
          contexto: "Em consultório",
          observacoes: "Peso inicial"
        },
        {
          data: new Date("2023-11-15"),
          valor: 85.2,
          unidade: "kg",
          contexto: "Em consultório",
          observacoes: "Após um mês de dieta"
        }
      ],
      metas: [
        {
          dataDefinicao: new Date("2023-10-15"),
          valorMeta: 75,
          unidade: "kg",
          prazo: new Date("2024-10-15"),
          descricao: "Meta de peso ideal"
        }
      ]
    }
  ],
  ultimaAtualizacao: new Date("2023-11-15")
};
