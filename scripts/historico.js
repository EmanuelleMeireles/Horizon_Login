// Importa as funções necessárias do Firebase
import { getFirestore, collection, getDocs, onSnapshot, updateDoc, deleteDoc, doc, query, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
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

async function deleteCheckin(id) {
  if (confirm('Tem certeza que deseja excluir este check-in? Esta ação não pode ser desfeita.')) {
    try {
      await deleteDoc(doc(db, 'checkin', id));
      alert('Check-in excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir check-in:', error);
      alert('Erro ao excluir o check-in. Tente novamente.');
    }
  }
}

// Função para limpar check-ins órfãos (sem funcionários correspondentes)
async function cleanupOrphanCheckins() {
  try {
    // Obter todos os IDs de funcionários na coleção 'employees'
    const employeesSnapshot = await getDocs(collection(db, 'employees'));
    const employeeIds = employeesSnapshot.docs.map((doc) => doc.data().id);

    // Obter todos os registros de check-in
    const checkinSnapshot = await getDocs(collection(db, 'checkin'));

    checkinSnapshot.forEach(async (docSnap) => {
      const checkinData = docSnap.data();
      if (!employeeIds.includes(checkinData.id)) {
        // Se o ID do check-in não existir na coleção 'employees', exclui o check-in
        await deleteDoc(doc(db, 'checkin', docSnap.id));
        console.log(`Check-in órfão com ID ${docSnap.id} excluído.`);
      }
    });

    console.log('Limpeza de check-ins órfãos concluída.');
  } catch (error) {
    console.error('Erro ao limpar check-ins órfãos:', error);
  }
}

// Sincroniza os dados de checkin com os dados da coleção employees
async function syncCheckinWithEmployees() {
  try {
    const employeesSnapshot = await getDocs(collection(db, 'employees'));
    const employeesData = {};

    // Cria um dicionário com os dados dos funcionários
    employeesSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      employeesData[data.id] = data;
    });

    const checkinSnapshot = await getDocs(collection(db, 'checkin'));

    // Atualiza os registros de checkin se houver discrepâncias
    checkinSnapshot.forEach(async (checkinDoc) => {
      const checkinData = checkinDoc.data();
      const employee = employeesData[checkinData.id];

      if (employee) {
        await updateDoc(doc(db, 'checkin', checkinDoc.id), {
          name: employee.name,
          sector: employee.sector,
        });
      }
    });
  } catch (error) {
    console.error('Erro ao sincronizar dados de checkin com employees:', error);
  }
}

// Função para carregar o histórico de check-ins/check-outs em tempo real
function loadHistory() {
  const tableBody = document.getElementById('history-table');
  tableBody.innerHTML = '';

  try {
    const checkinRef = collection(db, 'checkin');

    // Sincroniza os dados antes de configurar o listener de tempo real
    syncCheckinWithEmployees();

    // Realtime Updates: escuta mudanças na coleção 'checkin'
    onSnapshot(checkinRef, async (querySnapshot) => {
      tableBody.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();

        const row = `
          <tr data-id="${docSnapshot.id}">
            <td>${data.id}</td>
            <td>${data.name}</td>
            <td>${data.sector}</td>
            <td>${data.data}</td>
            <td>${data.checkIn}</td>
            <td>${data.checkOut || ''}</td>
            <td>
              <button class="delete-button" onclick="deleteCheckin('${docSnapshot.id}')">
                🗑️
              </button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    });
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
  }
}

// Carregar histórico e limpar check-ins órfãos ao carregar a página
window.onload = async () => {
  await cleanupOrphanCheckins();
  loadHistory();
};

// Exporta a função para ser usada no HTML
window.loadHistory = loadHistory;
window.deleteCheckin = deleteCheckin;

// Função para filtrar os dados pelo intervalo de datas
function filterByDate() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const tableRows = document.querySelectorAll('#history-table tr');

  if (!startDate || !endDate) {
    alert('Por favor, preencha ambas as datas para filtrar.');
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  tableRows.forEach((row) => {
    const dateCell = row.cells[3]; // A quarta coluna (Data)
    if (dateCell) {
      const rowDate = new Date(dateCell.textContent);
      if (rowDate >= start && rowDate <= end) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

// Função para filtrar os dados por ID ou Nome em tempo real
function filterByNameOrId() {
  const input = document.getElementById('search-input').value.toLowerCase();
  const tableRows = document.querySelectorAll('#history-table tr');

  tableRows.forEach((row) => {
    const idCell = row.cells[0].textContent.toLowerCase();
    const nameCell = row.cells[1].textContent.toLowerCase();

    if (idCell.includes(input) || nameCell.includes(input)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Exporta a função para ser usada no HTML
window.filterByNameOrId = filterByNameOrId;

// Exporta a função para ser usada no HTML
window.filterByDate = filterByDate;
window.loadHistory = loadHistory;

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título do PDF
  doc.text("Histórico de Check-in/Check-out", 14, 15);

  // Coleta os dados da tabela
  const tableRows = [];
  const headers = ["ID", "Nome", "Setor", "Data", "Entrada", "Saída"];
  const rows = document.querySelectorAll("#history-table tr");

  rows.forEach((row) => {
    if (row.style.display !== "none") { // Apenas linhas visíveis (filtradas)
      const cells = row.querySelectorAll("td");
      const rowData = [];
      cells.forEach((cell) => {
        rowData.push(cell.textContent);
      });
      tableRows.push(rowData);
    }
  });

  // Adiciona a tabela ao PDF
  doc.autoTable({
    head: [headers],
    body: tableRows,
    startY: 20,
    theme: "striped",
  });

  // Salva o PDF com o nome especificado
  doc.save("historico_checkin_checkout.pdf");
}

// Exporta a função para uso no HTML
window.exportToPDF = exportToPDF;


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

window.confirmLogout = confirmLogout;
window.toggleSidebar = toggleSidebar;
  