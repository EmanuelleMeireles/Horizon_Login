// Importa as funções necessárias do Firebase
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';

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
const db = getFirestore(app);

// Função para carregar funcionários da coleção 'employees' e exibi-los na tabela
async function loadEmployees() {
  const tableBody = document.getElementById('employees-table-body');
  tableBody.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.id}</td>
          <td>${data.name}</td>
          <td>${data.sector}</td>
          <td>${data.email}</td>
          <td>${data.phone}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
  }
}

// Função para buscar funcionários por Nome ou ID em tempo real
function searchEmployees() {
  const input = document.getElementById('search-input').value.toLowerCase();
  const tableBody = document.getElementById('employees-table-body');
  const rows = tableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    const id = cells[0].textContent.toLowerCase();
    const name = cells[1].textContent.toLowerCase();

    if (id.includes(input) || name.includes(input)) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}

// Adicionar evento de busca em tempo real ao campo de pesquisa
document.getElementById('search-input').addEventListener('input', searchEmployees);

// Carrega os funcionários ao carregar a página
window.onload = loadEmployees;

