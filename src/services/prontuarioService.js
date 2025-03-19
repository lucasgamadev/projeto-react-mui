import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Busca um prontuário pelo ID
 * @param {string} prontuarioId - ID do prontuário
 * @returns {Promise<Object>} Prontuário encontrado
 */
export const getProntuarioById = async (prontuarioId) => {
  try {
    const prontuarioRef = doc(db, "prontuarios", prontuarioId);
    const prontuarioDoc = await getDoc(prontuarioRef);

    if (!prontuarioDoc.exists()) {
      throw new Error("Prontuário não encontrado");
    }

    return {
      id: prontuarioDoc.id,
      ...prontuarioDoc.data()
    };
  } catch (error) {
    console.error("Erro ao buscar prontuário:", error);
    throw error;
  }
};

/**
 * Busca prontuários por CPF do paciente
 * @param {string} cpf - CPF do paciente
 * @returns {Promise<Array>} Lista de prontuários encontrados
 */
export const getProntuariosByCPF = async (cpf) => {
  try {
    const prontuariosRef = collection(db, "prontuarios");
    const q = query(prontuariosRef, where("cpf", "==", cpf));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar prontuários por CPF:", error);
    throw error;
  }
};

/**
 * Busca prontuários por nome do paciente
 * @param {string} nome - Nome do paciente
 * @returns {Promise<Array>} Lista de prontuários encontrados
 */
export const getProntuariosByNome = async (nome) => {
  try {
    const prontuariosRef = collection(db, "prontuarios");
    const q = query(
      prontuariosRef,
      where("nomePaciente", ">=", nome),
      where("nomePaciente", "<=", nome + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar prontuários por nome:", error);
    throw error;
  }
};

/**
 * Cria um novo prontuário
 * @param {Object} prontuarioData - Dados do prontuário
 * @returns {Promise<Object>} Prontuário criado
 */
export const createProntuario = async (prontuarioData) => {
  try {
    const prontuariosRef = collection(db, "prontuarios");
    const docRef = await addDoc(prontuariosRef, {
      ...prontuarioData,
      dataCriacao: serverTimestamp(),
      ultimaAtualizacao: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...prontuarioData
    };
  } catch (error) {
    console.error("Erro ao criar prontuário:", error);
    throw error;
  }
};

/**
 * Atualiza um prontuário existente
 * @param {string} prontuarioId - ID do prontuário
 * @param {Object} prontuarioData - Dados atualizados do prontuário
 * @returns {Promise<void>}
 */
export const updateProntuario = async (prontuarioId, prontuarioData) => {
  try {
    const prontuarioRef = doc(db, "prontuarios", prontuarioId);
    await updateDoc(prontuarioRef, {
      ...prontuarioData,
      ultimaAtualizacao: serverTimestamp()
    });
  } catch (error) {
    console.error("Erro ao atualizar prontuário:", error);
    throw error;
  }
};

/**
 * Adiciona uma nova consulta ao prontuário
 * @param {string} prontuarioId - ID do prontuário
 * @param {Object} consultaData - Dados da consulta
 * @returns {Promise<Object>} Prontuário atualizado
 */
export const addConsulta = async (prontuarioId, consultaData) => {
  try {
    const prontuarioRef = doc(db, "prontuarios", prontuarioId);
    const prontuarioDoc = await getDoc(prontuarioRef);

    if (!prontuarioDoc.exists()) {
      throw new Error("Prontuário não encontrado");
    }

    const prontuarioAtual = prontuarioDoc.data();
    const consultas = [...(prontuarioAtual.consultas || [])];

    const novaConsulta = {
      ...consultaData,
      id: Date.now(),
      dataRegistro: serverTimestamp()
    };

    consultas.push(novaConsulta);

    await updateDoc(prontuarioRef, {
      consultas,
      ultimaAtualizacao: serverTimestamp()
    });

    return {
      id: prontuarioDoc.id,
      ...prontuarioAtual,
      consultas
    };
  } catch (error) {
    console.error("Erro ao adicionar consulta:", error);
    throw error;
  }
};

/**
 * Adiciona um novo anexo ao prontuário
 * @param {string} prontuarioId - ID do prontuário
 * @param {Object} anexoData - Dados do anexo
 * @returns {Promise<Object>} Prontuário atualizado
 */
export const addAnexo = async (prontuarioId, anexoData) => {
  try {
    const prontuarioRef = doc(db, "prontuarios", prontuarioId);
    const prontuarioDoc = await getDoc(prontuarioRef);

    if (!prontuarioDoc.exists()) {
      throw new Error("Prontuário não encontrado");
    }

    const prontuarioAtual = prontuarioDoc.data();
    const anexos = [...(prontuarioAtual.anexos || [])];

    const novoAnexo = {
      ...anexoData,
      id: Date.now(),
      dataUpload: serverTimestamp()
    };

    anexos.push(novoAnexo);

    await updateDoc(prontuarioRef, {
      anexos,
      ultimaAtualizacao: serverTimestamp()
    });

    return {
      id: prontuarioDoc.id,
      ...prontuarioAtual,
      anexos
    };
  } catch (error) {
    console.error("Erro ao adicionar anexo:", error);
    throw error;
  }
};

/**
 * Adiciona uma nova alergia ao prontuário
 * @param {string} prontuarioId - ID do prontuário
 * @param {Object} alergiaData - Dados da alergia
 * @returns {Promise<Object>} Prontuário atualizado
 */
export const addAlergia = async (prontuarioId, alergiaData) => {
  try {
    const prontuarioRef = doc(db, "prontuarios", prontuarioId);
    const prontuarioDoc = await getDoc(prontuarioRef);

    if (!prontuarioDoc.exists()) {
      throw new Error("Prontuário não encontrado");
    }

    const prontuarioAtual = prontuarioDoc.data();
    const alergias = [...(prontuarioAtual.alergias || [])];

    alergias.push(alergiaData);

    await updateDoc(prontuarioRef, {
      alergias,
      ultimaAtualizacao: serverTimestamp()
    });

    return {
      id: prontuarioDoc.id,
      ...prontuarioAtual,
      alergias
    };
  } catch (error) {
    console.error("Erro ao adicionar alergia:", error);
    throw error;
  }
};

/**
 * Adiciona um novo medicamento ao prontuário
 * @param {string} prontuarioId - ID do prontuário
 * @param {Object} medicamentoData - Dados do medicamento
 * @returns {Promise<Object>} Prontuário atualizado
 */
export const addMedicamento = async (prontuarioId, medicamentoData) => {
  try {
    const prontuarioRef = doc(db, "prontuarios", prontuarioId);
    const prontuarioDoc = await getDoc(prontuarioRef);

    if (!prontuarioDoc.exists()) {
      throw new Error("Prontuário não encontrado");
    }

    const prontuarioAtual = prontuarioDoc.data();
    const medicamentos = [...(prontuarioAtual.medicamentos || [])];

    const novoMedicamento = {
      ...medicamentoData,
      id: Date.now()
    };

    medicamentos.push(novoMedicamento);

    await updateDoc(prontuarioRef, {
      medicamentos,
      ultimaAtualizacao: serverTimestamp()
    });

    return {
      id: prontuarioDoc.id,
      ...prontuarioAtual,
      medicamentos
    };
  } catch (error) {
    console.error("Erro ao adicionar medicamento:", error);
    throw error;
  }
};

export default {
  getProntuarioById,
  getProntuariosByCPF,
  getProntuariosByNome,
  createProntuario,
  updateProntuario,
  addConsulta,
  addAnexo,
  addAlergia,
  addMedicamento
};
