import { sanitizeHtml } from './sanitize.js';
import { setComments, getComments } from './comments.js';
import { renderComments } from './render.js';
import { getToken } from './auth.js';

const USER_KEY = 'gala-sh';
const API_BASE_URL = `https://wedev-api.sky.pro/api/v1/${USER_KEY}/comments`;

let commentsLoader = null;
let addForm = null;
let addFormLoader = null;

function initLoaders() {
  commentsLoader = document.getElementById('comments-loader');
  addForm = document.querySelector('.add-form');
  addFormLoader = document.querySelector('.add-form-loader');
}

export function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function showCommentsLoader() {
  if (commentsLoader) commentsLoader.style.display = 'block';
  const commentsList = document.querySelector('.comments');
  if (commentsList) commentsList.style.display = 'none';
}

function hideCommentsLoader() {
  if (commentsLoader) commentsLoader.style.display = 'none';
  const commentsList = document.querySelector('.comments');
  if (commentsList) commentsList.style.display = 'block';
}

function showAddFormLoader() {
  if (addForm) addForm.style.display = 'none';
  if (addFormLoader) addFormLoader.style.display = 'block';
}

function hideAddFormLoader() {
  if (addForm) addForm.style.display = 'flex';
  if (addFormLoader) addFormLoader.style.display = 'none';
}

function isOnline() {
  return navigator.onLine;
}

export async function fetchCommentsFromApi() {
  if (!isOnline()) {
    alert('Кажется, у вас сломался интернет, попробуйте позже');
    return [];
  }

  initLoaders();
  showCommentsLoader();
  
  try {
    const response = await fetch(API_BASE_URL);
    
    if (response.status === 500) {
      alert('Сервер сломался, попробуй позже');
      return [];
    }
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    
    const data = await response.json();
    
    const commentsArray = Array.isArray(data) ? data : (data.comments || []);
    
    const commentsFromApi = commentsArray.map((comment, index) => ({
      id: comment.id || index + 1,
      name: comment.author || comment.name,
      text: comment.text,
      date: comment.date || getCurrentDateTime(),
      likes: comment.likes || 0,
      isLiked: comment.isLiked || false
    }));
    
    setComments(commentsFromApi);
    renderComments();
    return commentsFromApi;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      alert('Кажется, у вас сломался интернет, попробуйте позже');
    } else {
      console.error('Ошибка при загрузке комментариев:', error);
      alert('Не удалось загрузить комментарии. Попробуйте позже.');
    }
    return [];
  } finally {
    hideCommentsLoader();
  }
}

export async function postCommentToApi(name, text, retryCount = 0) {
  const token = getToken();
  
  if (!token) {
    alert('Вы не авторизованы');
    return false;
  }
  
  if (!isOnline()) {
    alert('Кажется, у вас сломался интернет, попробуйте позже');
    return false;
  }
  
  if (name.length < 3) {
    alert('Имя должно содержать хотя бы 3 символа');
    return false;
  }
  if (text.length < 3) {
    alert('Текст комментария должен содержать хотя бы 3 символа');
    return false;
  }
  
  showAddFormLoader();
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  
      },
      body: JSON.stringify({
        name: sanitizeHtml(name),
        text: sanitizeHtml(text),
      }),
    });
    
    if (response.status === 400) {
      const error = await response.json();
      alert(`Ошибка: ${error.error || 'Некорректные данные'}`);
      return false;
    }
    
    if (response.status === 401) {
      alert('Сессия истекла. Войдите заново.');
      localStorage.removeItem('comment_app_token');
      localStorage.removeItem('comment_app_user');
      window.location.reload();
      return false;
    }
    
    if (response.status === 500) {
      if (retryCount < 3) {
        console.log(`Повторная попытка ${retryCount + 1}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return postCommentToApi(name, text, retryCount + 1);
      }
      alert('Сервер сломался, попробуй позже');
      return false;
    }
    
    if (!response.ok) {
      throw new Error(`Ошибка отправки: ${response.status}`);
    }
    
    await fetchCommentsFromApi();
    return true;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      alert('Кажется, у вас сломался интернет, попробуйте позже');
    } else {
      console.error('Ошибка при отправке комментария:', error);
      alert('Не удалось отправить комментарий. Попробуйте позже.');
    }
    return false;
  } finally {
    hideAddFormLoader();
  }
}

export function addNewComment(name, text) {
  return postCommentToApi(name, text);
}

export function validateAndAdd(nameInput, commentInput) {
  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  
  if (name === '') {
    alert('Пожалуйста, введите ваше имя');
    return false;
  }
  if (comment === '') {
    alert('Пожалуйста, введите текст комментария');
    return false;
  }
  
  if (name.length < 3) {
    alert('Имя должно содержать хотя бы 3 символа');
    return false;
  }
  if (comment.length < 3) {
    alert('Текст комментария должен содержать хотя бы 3 символа');
    return false;
  }
  
  addNewComment(name, comment);
  nameInput.value = '';
  commentInput.value = '';
  return true;
}