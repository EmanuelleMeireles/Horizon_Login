import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
  apiKey: 'AIzaSyAO2sGJZDarnIWtJUlJb-Qrc3cg5g0qmqc',
  authDomain: 'horizon-focus.firebaseapp.com',
  projectId: 'horizon-focus',
  storageBucket: 'horizon-focus.appspot.com',
  messagingSenderId: '31055563122',
  appId: '1:31055563122:web:da0bb34a1c5076ab0675eb',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verifica se o usuário está autenticado
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redireciona para login.html se o usuário não estiver autenticado
    window.location.href = 'login.html';
  }
});

// Função para logout
function logout() {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error('Erro ao sair:', error);
  });
}

// Torna a função logout acessível no HTML
window.logout = logout;
