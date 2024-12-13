import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, sendPasswordResetEmail, onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAO2sGJZDarnIWtJUlJb-Qrc3cg5g0qmqc',
  authDomain: 'horizon-focus.firebaseapp.com',
  projectId: 'horizon-focus',
  storageBucket: 'horizon-focus.firebasestorage.app',
  messagingSenderId: '31055563122',
  appId: '1:31055563122:web:da0bb34a1c5076ab0675eb',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.style.display = 'block';
    messageDiv.textContent = message;
    messageDiv.style.color = 'red';
  }
}

// **Função de Login**
document.getElementById('signInForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  console.log('Tentando fazer login com:', email);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Login bem-sucedido:', userCredential.user);
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Erro ao fazer login:', error);
      showMessage('Email ou senha incorretos', 'signInMessage');
    });
});

// **Verificar Autenticação**
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuário autenticado:', user.email);
  } else {
    console.log('Nenhum usuário autenticado.');
  }
});

// Função para mostrar a seção de redefinição de senha
function showForgotPasswordSection() {
  document.getElementById('signInForm').classList.add('hidden');
  document.getElementById('forgot-password-section').classList.remove('hidden');
}

// Função para voltar à seção de login
function goBackToLogin() {
  document.getElementById('forgot-password-section').classList.add('hidden');
  document.getElementById('signInForm').classList.remove('hidden');
}

// Função para enviar o e-mail de redefinição de senha
async function sendPasswordReset() {
  const emailInput = document.getElementById('reset-email');
  const email = emailInput.value.trim();

  if (!email) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Link para redefinição de senha enviado com sucesso!');
    emailInput.value = ''; // Limpa o campo de e-mail
    goBackToLogin();
  } catch (error) {
    console.error('Erro ao enviar o e-mail de redefinição:', error);
    alert('Erro ao enviar o e-mail de redefinição: ' + error.message);
  }
}

// Função para validar login
function validateLogin() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      emailInput.value = '';    // Limpa o campo de e-mail
      passwordInput.value = ''; // Limpa o campo de senha
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login: ' + error.message);
    });
}


// Exporta funções para uso no HTML
window.showForgotPasswordSection = showForgotPasswordSection;
window.sendPasswordReset = sendPasswordReset;
window.validateLogin = validateLogin;
window.goBackToLogin = goBackToLogin;
