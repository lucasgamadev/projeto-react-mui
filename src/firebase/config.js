// Mock do Firebase para desenvolvimento
// Remova este mock e use a implementação real quando o Firebase estiver corretamente instalado

// Armazenamento em memória para simular o banco de dados
const mockDatabase = {
  prontuarios: []
};

// Funções auxiliares para o mock
const createDocumentSnapshot = (id, data) => ({
  exists: true,
  id,
  data: () => data,
  ref: {
    id,
    path: `prontuarios/${id}`
  }
});

const createQuerySnapshot = (docs) => ({
  empty: docs.length === 0,
  docs: docs.map((doc) => createDocumentSnapshot(doc.id, doc)),
  forEach: (callback) => docs.forEach((doc) => callback(createDocumentSnapshot(doc.id, doc))),
  size: docs.length
});

// Mock do Firestore
const mockFirestore = {
  collection: (collectionName) => {
    return {
      add: (data) => {
        const id = "mock-id-" + Math.random().toString(36).substr(2, 9);
        const newDoc = { id, ...data };
        mockDatabase[collectionName] = mockDatabase[collectionName] || [];
        mockDatabase[collectionName].push(newDoc);
        return Promise.resolve(createDocumentSnapshot(id, newDoc));
      },
      doc: (id) => ({
        get: () => {
          const doc = mockDatabase[collectionName]?.find((doc) => doc.id === id);
          return Promise.resolve(createDocumentSnapshot(id, doc));
        },
        update: (data) => {
          const index = mockDatabase[collectionName]?.findIndex((doc) => doc.id === id);
          if (index !== -1) {
            mockDatabase[collectionName][index] = {
              ...mockDatabase[collectionName][index],
              ...data
            };
          }
          return Promise.resolve();
        },
        delete: () => {
          const index = mockDatabase[collectionName]?.findIndex((doc) => doc.id === id);
          if (index !== -1) {
            mockDatabase[collectionName].splice(index, 1);
          }
          return Promise.resolve();
        }
      }),
      where: (field, operator, value) => ({
        get: () => {
          const results = (mockDatabase[collectionName] || []).filter((doc) => {
            switch (operator) {
              case "==":
                return doc[field] === value;
              case ">=":
                return doc[field] >= value;
              case "<=":
                return doc[field] <= value;
              default:
                return true;
            }
          });
          return Promise.resolve(createQuerySnapshot(results));
        }
      }),
      orderBy: (field, direction = "asc") => ({
        get: () => {
          const results = [...(mockDatabase[collectionName] || [])].sort((a, b) => {
            if (direction === "asc") {
              return a[field] > b[field] ? 1 : -1;
            }
            return a[field] < b[field] ? 1 : -1;
          });
          return Promise.resolve(createQuerySnapshot(results));
        }
      }),
      get: () => {
        return Promise.resolve(createQuerySnapshot(mockDatabase[collectionName] || []));
      }
    };
  }
};

// Mock do Auth
const mockAuth = {
  currentUser: { uid: "mock-user-id", email: "mock@example.com" },
  onAuthStateChanged: (callback) => {
    callback({ uid: "mock-user-id", email: "mock@example.com" });
    return () => {};
  },
  signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: "mock-user-id" } }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: "mock-user-id" } }),
  signOut: () => Promise.resolve()
};

// Mock do Storage
const mockStorage = {
  ref: () => ({
    child: () => ({
      put: () => ({
        on: (event, progress, error, complete) => {
          setTimeout(
            () =>
              complete({
                ref: { getDownloadURL: () => Promise.resolve("https://mock-image-url.com") }
              }),
            500
          );
        }
      })
    }),
    put: () => ({
      on: (event, progress, error, complete) => {
        setTimeout(
          () =>
            complete({
              ref: { getDownloadURL: () => Promise.resolve("https://mock-image-url.com") }
            }),
          500
        );
      }
    }),
    getDownloadURL: () => Promise.resolve("https://mock-image-url.com")
  })
};

// Função para limpar o banco de dados mock (útil para testes)
export const clearMockDatabase = () => {
  Object.keys(mockDatabase).forEach((key) => {
    mockDatabase[key] = [];
  });
};

// Expor mocks como se fossem as APIs do Firebase
export const db = mockFirestore;
export const auth = mockAuth;
export const storage = mockStorage;

// Simular o serverTimestamp do Firestore
export const serverTimestamp = () => new Date();

// Simular outras funções do Firestore
export const collection = (db, path) => db.collection(path);
export const doc = (db, path, id) => db.collection(path).doc(id);
export const getDocs = (query) => query.get();
export const addDoc = (ref, data) => ref.add(data);
export const updateDoc = (ref, data) => ref.update(data);
export const query = (ref, ...constraints) => {
  let result = ref;
  constraints.forEach((constraint) => {
    if (typeof constraint === "function") {
      result = constraint(result);
    }
  });
  return result;
};
export const where = (field, operator, value) => (ref) => ref.where(field, operator, value);
export const orderBy = (field, direction) => (ref) => ref.orderBy(field, direction);

export default {
  db,
  auth,
  storage,
  clearMockDatabase,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
};
