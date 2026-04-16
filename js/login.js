import { login } from './auth.js';

export function renderLoginPage() {
  const app = document.querySelector('.container');
  
  app.innerHTML = `
    <div class="auth-page">
      <h2>Вход в аккаунт</h2>
      <form id="login-form" class="auth-form">
        <input type="text" id="login-input" placeholder="Логин" required />
        <input type="password" id="password-input" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>
      <p class="auth-link">
        Нет аккаунта? <a href="#" id="register-link">Зарегистрироваться</a>
      </p>
      <p class="auth-link">
        <a href="#" id="back-to-comments">← Назад к комментариям</a>
      </p>
    </div>
  `;
  
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const loginInput = document.getElementById('login-input');
    const passwordInput = document.getElementById('password-input');
    
    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    
    if (!loginValue || !passwordValue) {
      alert('Заполните все поля');
      return;
    }
    
    try {
      await login(loginValue, passwordValue);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });
  
  const registerLink = document.getElementById('register-link');
  if (registerLink) {
    registerLink.addEventListener('click', (event) => {
      event.preventDefault();
      import('./register.js').then(module => {
        module.renderRegisterPage();
      });
    });
  }
  
  const backLink = document.getElementById('back-to-comments');
  backLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.reload();
  });
}