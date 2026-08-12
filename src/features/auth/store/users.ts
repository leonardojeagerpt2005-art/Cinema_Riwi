export interface StoredUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Almacén de usuarios en localStorage: simula el endpoint /api/users del
// proyecto original para que login y registro funcionen en este frontend
// independiente (sin servidor).
const USERS_KEY = "cinema_users";

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 1,
    name: "Usuario Demo",
    email: "demo@riwicinema.com",
    password: "123",
  },
];

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* localStorage dañado/indisponible: se restaura el estado por defecto */
  }
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  } catch {
    /* sin persistencia: los usuarios siguen válidos en memoria */
  }
  return [...DEFAULT_USERS];
}

function writeUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* sin persistencia */
  }
}

// GET /api/users
export function fetchUsers(): Promise<StoredUser[]> {
  return Promise.resolve(readUsers());
}

// GET /api/users + validación de credenciales
export function authenticateUser(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const users = readUsers();
  const found =
    users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    ) ?? null;
  return Promise.resolve(found);
}

// POST /api/users (rechaza si el correo ya existe)
export function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<StoredUser> {
  const users = readUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (existing) {
    return Promise.reject(new Error("EMAIL_EXISTS"));
  }
  const user: StoredUser = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    password: data.password,
  };
  users.push(user);
  writeUsers(users);
  return Promise.resolve(user);
}
