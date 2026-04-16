const TOKEN_KEY = 'comment_app_token';
const USER_KEY = 'comment_app_user';

export function saveAuthData(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function register(name, login, password) {
  const response = await fetch('https://wedev-api.sky.pro/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, login, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка регистрации');
  }

  const data = await response.json();
  saveAuthData(data.user.token, { name, login });
  return data;
}

export async function login(login, password) {
  const response = await fetch('https://wedev-api.sky.pro/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Неверный логин или пароль');
  }

  const data = await response.json();
  saveAuthData(data.user.token, data.user);
  return data;
}
