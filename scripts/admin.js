// Importa as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

// Esconde os botões e mostra a seção selecionada
function showSection(sectionId) {
  document.getElementById('button-container').classList.add('hidden');
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// Volta para a tela inicial com os botões principais
function goBack() {
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
  document.getElementById('button-container').classList.remove('hidden');
}

// Função para cadastrar um novo usuário
async function registerUser() {
  const emailInput = document.getElementById('new-email');
  const passwordInput = document.getElementById('new-password');
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, 'users'), { email });
    alert('Usuário cadastrado com sucesso!');
    emailInput.value = '';      // Limpa o campo de e-mail
    passwordInput.value = '';   // Limpa o campo de senha
    goBack();
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    alert('Erro ao cadastrar usuário: ' + error.message);
  }
}

// Função para redefinir a senha de um usuário
async function resetPassword() {
  const emailInput = document.getElementById('reset-email');
  const email = emailInput.value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Email de redefinição de senha enviado com sucesso!');
    emailInput.value = '';  // Limpa o campo de e-mail
    goBack();
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    alert('Erro ao redefinir senha: ' + error.message);
  }
}


// Função para carregar e exibir os usuários na tabela
async function loadUsers() {
  const tableBody = document.getElementById('users-table-body');
  tableBody.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach(docSnapshot => {
      const userData = docSnapshot.data();
      const row = `
        <tr>
          <td>${userData.email}</td>
          <td>
            <button class="delete-button" onclick="deleteUserAccount('${docSnapshot.id}')">🗑️</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
}

// Função para excluir um usuário com confirmação
async function deleteUserAccount(userId) {
  const confirmation = confirm('Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.');

  if (confirmation) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      alert('Usuário excluído com sucesso!');
      loadUsers(); // Recarrega a lista de usuários após a exclusão
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário: ' + error.message);
    }
  } else {
    alert('Exclusão cancelada.');
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector('.card-left');
  sidebar.classList.toggle('hidden');
}

function confirmLogout() {
  const userConfirmed = confirm("Tem certeza de que deseja retornar à página inicial?");
  if (userConfirmed) {
    window.location.href = "index.html";
  }
}


// Exporta as funções globais para serem chamadas no HTML
window.confirmLogout = confirmLogout;
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;
window.goBack = goBack;
window.registerUser = registerUser;
window.resetPassword = resetPassword;
window.loadUsers = loadUsers;
window.deleteUserAccount = deleteUserAccount;

// Carrega os usuários automaticamente quando a seção "Administrar Usuários" é aberta
document.addEventListener('DOMContentLoaded', () => {
  const manageSectionButton = document.querySelector("button[onclick=\"showSection('manage-section')\"]");
  manageSectionButton.addEventListener('click', loadUsers);
});
