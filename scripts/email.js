import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAO2sGJZDarnIWtJUlJb-Qrc3cg5g0qmqc',
  authDomain: 'horizon-focus.firebaseapp.com',
  projectId: 'horizon-focus',
  storageBucket: 'horizon-focus.firebasestorage.app',
  messagingSenderId: '31055563122',
  appId: '1:31055563122:web:da0bb34a1c5076ab0675eb',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para enviar o e-mail de verificação
async function sendVerificationEmail() {
  const emailInput = document.getElementById('email').value.trim();

  if (!emailInput) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, emailInput);
    alert(`E-mail de verificação enviado para ${emailInput}. Verifique sua caixa de entrada.`);
  } catch (error) {
    console.error('Erro ao enviar o e-mail de verificação:', error);
    alert('Erro ao enviar o e-mail de verificação: ' + error.message);
  }
}

// Associar a função ao botão de envio
document.getElementById('send-email-button').addEventListener('click', sendVerificationEmail);



