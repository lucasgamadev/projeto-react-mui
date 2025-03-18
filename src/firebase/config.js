// Mock do Firebase para desenvolvimento
// Remova este mock e use a implementação real quando o Firebase estiver corretamente instalado

// Mock do Firestore
const mockFirestore = {
  collection: () => ({
    add: (data) =>
      Promise.resolve({ id: "mock-id-" + Math.random().toString(36).substr(2, 9), ...data }),
    doc: (id) => ({
      get: () =>
        Promise.resolve({
          exists: true,
          id,
          data: () => ({ id, nome: "Mock Item", createdAt: new Date() })
        }),
      update: (data) => Promise.resolve(data),
      delete: () => Promise.resolve()
    })
  }),
  doc: (path, id) => ({
    get: () =>
      Promise.resolve({
        exists: true,
        id,
        data: () => ({ id, nome: "Mock Item", createdAt: new Date() })
      }),
    update: (data) => Promise.resolve(data),
    delete: () => Promise.resolve()
  })
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

// Expor mocks como se fossem as APIs do Firebase
export const db = mockFirestore;
export const auth = mockAuth;
export const storage = mockStorage;

// Simular o serverTimestamp do Firestore
export const serverTimestamp = () => new Date();

export default {
  db,
  auth,
  storage
};
