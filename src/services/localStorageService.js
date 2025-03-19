const STORAGE_KEY = "prontuario-data";

// Função para inicializar o storage com dados padrão
const initializeStorage = () => {
  const defaultData = {
    prontuarios: [],
    lastId: 0
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
};

// Função para obter os dados do storage
const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initializeStorage();
  } catch (error) {
    console.error("Erro ao ler dados do localStorage:", error);
    return initializeStorage();
  }
};

// Função para salvar dados no storage
const saveStorageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
    throw error;
  }
};

// Função para gerar novo ID
const getNextId = () => {
  const data = getStorageData();
  data.lastId += 1;
  saveStorageData(data);
  return data.lastId;
};

// Buscar prontuário por ID
export const getProntuarioById = (id) => {
  const data = getStorageData();
  const prontuario = data.prontuarios.find((p) => p.id === id);
  if (!prontuario) {
    throw new Error("Prontuário não encontrado");
  }
  return prontuario;
};

// Buscar prontuários por CPF
export const getProntuariosByCPF = (cpf) => {
  const data = getStorageData();
  return data.prontuarios.filter((p) => p.cpf.includes(cpf));
};

// Buscar prontuários por nome
export const getProntuariosByNome = (nome) => {
  const data = getStorageData();
  const termoBusca = nome.toLowerCase();
  return data.prontuarios.filter((p) => p.nomePaciente.toLowerCase().includes(termoBusca));
};

// Adicionar novo prontuário
export const addProntuario = (prontuarioData) => {
  const data = getStorageData();
  const newProntuario = {
    id: getNextId(),
    ...prontuarioData,
    dataCriacao: new Date().toISOString(),
    ultimaAtualizacao: new Date().toISOString()
  };

  data.prontuarios.push(newProntuario);
  saveStorageData(data);
  return newProntuario;
};

// Atualizar prontuário existente
export const updateProntuario = (id, prontuarioData) => {
  const data = getStorageData();
  const index = data.prontuarios.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Prontuário não encontrado");
  }

  data.prontuarios[index] = {
    ...data.prontuarios[index],
    ...prontuarioData,
    ultimaAtualizacao: new Date().toISOString()
  };

  saveStorageData(data);
  return data.prontuarios[index];
};

// Deletar prontuário
export const deleteProntuario = (id) => {
  const data = getStorageData();
  const index = data.prontuarios.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Prontuário não encontrado");
  }

  data.prontuarios.splice(index, 1);
  saveStorageData(data);
};

// Limpar todos os dados
export const clearAllData = () => {
  initializeStorage();
};

export default {
  getProntuarioById,
  getProntuariosByCPF,
  getProntuariosByNome,
  addProntuario,
  updateProntuario,
  deleteProntuario,
  clearAllData
};
