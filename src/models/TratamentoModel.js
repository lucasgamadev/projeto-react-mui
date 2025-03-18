/**
 * Modelo para Acompanhamento de Tratamentos Médicos
 *
 * Este modelo define a estrutura de dados para o acompanhamento de tratamentos médicos,
 * incluindo informações sobre o tratamento, etapas, evolução e avaliações.
 */

/**
 * Estrutura base do tratamento médico
 * @typedef {Object} Tratamento
 * @property {number} id - Identificador único do tratamento
 * @property {number} pacienteId - Identificador do paciente
 * @property {string} nome - Nome do tratamento
 * @property {string} descricao - Descrição detalhada do tratamento
 * @property {string} condicaoTratada - Condição médica sendo tratada
 * @property {Date} dataInicio - Data de início do tratamento
 * @property {Date} dataFim - Data prevista para término do tratamento
 * @property {string} status - Status do tratamento (não iniciado, em andamento, concluído, interrompido)
 * @property {number} medicoId - ID do médico responsável
 * @property {string} medicoNome - Nome do médico responsável
 * @property {string} especialidade - Especialidade médica
 * @property {Array<EtapaTratamento>} etapas - Etapas do tratamento
 * @property {Array<AvaliacaoProgresso>} avaliacoes - Avaliações de progresso
 * @property {Array<LembreteTratamento>} lembretes - Lembretes para o paciente
 * @property {Array<MetricaTratamento>} metricas - Métricas de acompanhamento
 * @property {Array<string>} observacoes - Observações sobre o tratamento
 * @property {Date} ultimaAtualizacao - Data da última atualização
 */

/**
 * Etapa de um tratamento médico
 * @typedef {Object} EtapaTratamento
 * @property {number} id - Identificador único da etapa
 * @property {number} numero - Número sequencial da etapa
 * @property {string} nome - Nome da etapa
 * @property {string} descricao - Descrição detalhada da etapa
 * @property {Date} dataInicio - Data de início da etapa
 * @property {Date} dataFim - Data prevista para término da etapa
 * @property {Date} dataConclusao - Data real de conclusão, se concluída
 * @property {string} status - Status da etapa (pendente, em andamento, concluída, atrasada)
 * @property {string} resultado - Resultado da etapa
 * @property {string} observacoes - Observações sobre a etapa
 */

/**
 * Avaliação de progresso de um tratamento
 * @typedef {Object} AvaliacaoProgresso
 * @property {number} id - Identificador único da avaliação
 * @property {Date} data - Data da avaliação
 * @property {number} medicoId - ID do médico avaliador
 * @property {string} medicoNome - Nome do médico avaliador
 * @property {string} descricao - Descrição da avaliação
 * @property {number} progresso - Percentual de progresso (0-100)
 * @property {Array<string>} sintomas - Sintomas relatados na avaliação
 * @property {string} evolucao - Descrição da evolução clínica
 * @property {string} observacoes - Observações adicionais
 */

/**
 * Lembrete para o paciente sobre o tratamento
 * @typedef {Object} LembreteTratamento
 * @property {number} id - Identificador único do lembrete
 * @property {string} titulo - Título do lembrete
 * @property {string} descricao - Descrição do lembrete
 * @property {Date} dataHora - Data e hora programada para o lembrete
 * @property {string} tipo - Tipo de lembrete (medicação, exercício, consulta, etc)
 * @property {boolean} enviado - Indica se o lembrete foi enviado
 * @property {boolean} recorrente - Indica se o lembrete é recorrente
 * @property {string} recorrencia - Padrão de recorrência (diário, semanal, etc)
 * @property {string} canalNotificacao - Canal de notificação (email, SMS, app)
 */

/**
 * Métrica de acompanhamento do tratamento
 * @typedef {Object} MetricaTratamento
 * @property {number} id - Identificador único da métrica
 * @property {string} nome - Nome da métrica
 * @property {string} descricao - Descrição da métrica
 * @property {string} unidade - Unidade de medida
 * @property {Array<MedicaoMetrica>} medicoes - Medições da métrica ao longo do tempo
 * @property {Object} metaIdeal - Meta ideal para a métrica (valor mínimo e máximo)
 * @property {string} observacoes - Observações sobre a métrica
 */

/**
 * Medição de uma métrica de tratamento
 * @typedef {Object} MedicaoMetrica
 * @property {number} id - Identificador único da medição
 * @property {Date} data - Data da medição
 * @property {number} valor - Valor medido
 * @property {string} observacoes - Observações sobre a medição
 */

/**
 * Cria um novo tratamento para um paciente
 * @param {Object} dadosTratamento - Dados do tratamento
 * @returns {Tratamento} Novo tratamento criado
 */
export const criarTratamento = (dadosTratamento) => {
  return {
    id: Date.now(),
    pacienteId: dadosTratamento.pacienteId,
    nome: dadosTratamento.nome || "",
    descricao: dadosTratamento.descricao || "",
    condicaoTratada: dadosTratamento.condicaoTratada || "",
    dataInicio: dadosTratamento.dataInicio || new Date(),
    dataFim: dadosTratamento.dataFim || null,
    status: "não iniciado",
    medicoId: dadosTratamento.medicoId,
    medicoNome: dadosTratamento.medicoNome || "",
    especialidade: dadosTratamento.especialidade || "",
    etapas: [],
    avaliacoes: [],
    lembretes: [],
    metricas: [],
    observacoes: [],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma etapa ao tratamento
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {Object} dadosEtapa - Dados da etapa
 * @returns {Tratamento} Tratamento atualizado
 */
export const adicionarEtapa = (tratamento, dadosEtapa) => {
  const numeroEtapa = tratamento.etapas.length + 1;

  const novaEtapa = {
    id: Date.now(),
    numero: numeroEtapa,
    nome: dadosEtapa.nome || `Etapa ${numeroEtapa}`,
    descricao: dadosEtapa.descricao || "",
    dataInicio: dadosEtapa.dataInicio || new Date(),
    dataFim: dadosEtapa.dataFim || null,
    dataConclusao: null,
    status: "pendente",
    resultado: "",
    observacoes: dadosEtapa.observacoes || ""
  };

  return {
    ...tratamento,
    etapas: [...tratamento.etapas, novaEtapa],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma avaliação de progresso ao tratamento
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {Object} dadosAvaliacao - Dados da avaliação
 * @returns {Tratamento} Tratamento atualizado
 */
export const adicionarAvaliacao = (tratamento, dadosAvaliacao) => {
  const novaAvaliacao = {
    id: Date.now(),
    data: dadosAvaliacao.data || new Date(),
    medicoId: dadosAvaliacao.medicoId,
    medicoNome: dadosAvaliacao.medicoNome || "",
    descricao: dadosAvaliacao.descricao || "",
    progresso: dadosAvaliacao.progresso || 0,
    sintomas: dadosAvaliacao.sintomas || [],
    evolucao: dadosAvaliacao.evolucao || "",
    observacoes: dadosAvaliacao.observacoes || ""
  };

  return {
    ...tratamento,
    avaliacoes: [...tratamento.avaliacoes, novaAvaliacao],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona um lembrete ao tratamento
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {Object} dadosLembrete - Dados do lembrete
 * @returns {Tratamento} Tratamento atualizado
 */
export const adicionarLembrete = (tratamento, dadosLembrete) => {
  const novoLembrete = {
    id: Date.now(),
    titulo: dadosLembrete.titulo || "",
    descricao: dadosLembrete.descricao || "",
    dataHora: dadosLembrete.dataHora || new Date(),
    tipo: dadosLembrete.tipo || "medicação",
    enviado: false,
    recorrente: dadosLembrete.recorrente || false,
    recorrencia: dadosLembrete.recorrencia || "",
    canalNotificacao: dadosLembrete.canalNotificacao || "app"
  };

  return {
    ...tratamento,
    lembretes: [...tratamento.lembretes, novoLembrete],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma métrica de acompanhamento ao tratamento
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {Object} dadosMetrica - Dados da métrica
 * @returns {Tratamento} Tratamento atualizado
 */
export const adicionarMetrica = (tratamento, dadosMetrica) => {
  const novaMetrica = {
    id: Date.now(),
    nome: dadosMetrica.nome || "",
    descricao: dadosMetrica.descricao || "",
    unidade: dadosMetrica.unidade || "",
    medicoes: [],
    metaIdeal: dadosMetrica.metaIdeal || { min: null, max: null },
    observacoes: dadosMetrica.observacoes || ""
  };

  return {
    ...tratamento,
    metricas: [...tratamento.metricas, novaMetrica],
    ultimaAtualizacao: new Date()
  };
};

/**
 * Adiciona uma medição a uma métrica existente
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {number} metricaId - ID da métrica
 * @param {Object} dadosMedicao - Dados da medição
 * @returns {Tratamento} Tratamento atualizado
 */
export const adicionarMedicaoMetrica = (tratamento, metricaId, dadosMedicao) => {
  const novaMedicao = {
    id: Date.now(),
    data: dadosMedicao.data || new Date(),
    valor: dadosMedicao.valor,
    observacoes: dadosMedicao.observacoes || ""
  };

  const metricasAtualizadas = tratamento.metricas.map((metrica) => {
    if (metrica.id === metricaId) {
      return {
        ...metrica,
        medicoes: [...metrica.medicoes, novaMedicao]
      };
    }
    return metrica;
  });

  return {
    ...tratamento,
    metricas: metricasAtualizadas,
    ultimaAtualizacao: new Date()
  };
};

/**
 * Atualiza o status de um tratamento
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {string} novoStatus - Novo status do tratamento
 * @returns {Tratamento} Tratamento atualizado
 */
export const atualizarStatusTratamento = (tratamento, novoStatus) => {
  const dataFim = novoStatus === "concluído" ? new Date() : tratamento.dataFim;

  return {
    ...tratamento,
    status: novoStatus,
    dataFim,
    ultimaAtualizacao: new Date()
  };
};

/**
 * Atualiza o status de uma etapa
 * @param {Tratamento} tratamento - Tratamento a ser atualizado
 * @param {number} etapaId - ID da etapa
 * @param {string} novoStatus - Novo status da etapa
 * @returns {Tratamento} Tratamento atualizado
 */
export const atualizarStatusEtapa = (tratamento, etapaId, novoStatus) => {
  const dataConclusao = novoStatus === "concluída" ? new Date() : null;

  const etapasAtualizadas = tratamento.etapas.map((etapa) => {
    if (etapa.id === etapaId) {
      return {
        ...etapa,
        status: novoStatus,
        dataConclusao
      };
    }
    return etapa;
  });

  return {
    ...tratamento,
    etapas: etapasAtualizadas,
    ultimaAtualizacao: new Date()
  };
};

/**
 * Calcula o progresso geral do tratamento com base nas etapas concluídas
 * @param {Tratamento} tratamento - Tratamento a ser avaliado
 * @returns {number} Percentual de progresso (0-100)
 */
export const calcularProgressoTratamento = (tratamento) => {
  if (!tratamento.etapas.length) return 0;

  const etapasConcluidas = tratamento.etapas.filter((etapa) => etapa.status === "concluída").length;

  return Math.round((etapasConcluidas / tratamento.etapas.length) * 100);
};

/**
 * Verifica se um tratamento está atrasado
 * @param {Tratamento} tratamento - Tratamento a ser verificado
 * @returns {boolean} Verdadeiro se o tratamento estiver atrasado
 */
export const verificarTratamentoAtrasado = (tratamento) => {
  if (tratamento.status === "concluído" || tratamento.status === "interrompido") {
    return false;
  }

  // Verifica se a data final já passou
  if (tratamento.dataFim && tratamento.dataFim < new Date()) {
    return true;
  }

  // Verifica se há etapas atrasadas
  const temEtapaAtrasada = tratamento.etapas.some(
    (etapa) =>
      (etapa.status === "pendente" || etapa.status === "em andamento") &&
      etapa.dataFim &&
      etapa.dataFim < new Date()
  );

  return temEtapaAtrasada;
};

/**
 * Obtém todas as etapas pendentes de um tratamento
 * @param {Tratamento} tratamento - Tratamento a ser analisado
 * @returns {Array<EtapaTratamento>} Lista de etapas pendentes
 */
export const obterEtapasPendentes = (tratamento) => {
  return tratamento.etapas.filter(
    (etapa) => etapa.status === "pendente" || etapa.status === "em andamento"
  );
};

/**
 * Obtém todos os lembretes ativos (não enviados) de um tratamento
 * @param {Tratamento} tratamento - Tratamento a ser analisado
 * @returns {Array<LembreteTratamento>} Lista de lembretes ativos
 */
export const obterLembretesAtivos = (tratamento) => {
  return tratamento.lembretes.filter(
    (lembrete) => !lembrete.enviado && lembrete.dataHora > new Date()
  );
};
