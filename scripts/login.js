import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import {
  getFirestore,
  setDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

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

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

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
