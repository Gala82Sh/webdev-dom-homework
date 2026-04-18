import { register } from './auth.js';

export function renderRegisterPage() {
  const app = document.querySelector('.container');
  
  app.innerHTML = `
    <div class="auth-page">
      <h2>Регистрация</h2>
      <form id="register-form" class="auth-form">
        <input type="text" id="name-input" placeholder="Имя" required />
        <input type="text" id="login-input" placeholder="Логин" required />
        <input type="password" id="password-input" placeholder="Пароль (мин. 6 символов)" required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p class="auth-link">
        Уже есть аккаунт? <a href="#" id="login-link">Войти</a>
      </p>
      <p class="auth-link">
        <a href="#" id="back-to-comments">← Назад к комментариям</a>
      </p>
    </div>
  `;
  
  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const nameInput = document.getElementById('name-input');
    const loginInput = document.getElementById('login-input');
    const passwordInput = document.getElementById('password-input');
    
    const name = nameInput.value.trim();
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!name || !login || !password) {
      alert('Заполните все поля');
      return;
    }
    
    if (password.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }
    
    try {
      await register(name, login, password);
      alert('Регистрация успешна! Теперь войдите в аккаунт.');
      const { renderLoginPage } = await import('./login.js');
      renderLoginPage();
    } catch (error) {
      alert(error.message);
    }
  });
  
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.addEventListener('click', (event) => {
      event.preventDefault();
      import('./login.js').then(module => {
        module.renderLoginPage();
      });
    });
  }
  
  const backLink = document.getElementById('back-to-comments');
  backLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.reload();
  });
}