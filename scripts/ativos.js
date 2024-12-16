// Importa as funções necessárias do Firebase
import { db } from './firebaseConfig.js';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Função para carregar funcionários
async function loadEmployees() {
  const tableBody = document.getElementById('employees-table-body');
  tableBody.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = `
        <tr data-id="${docSnap.id}">
          <td>${data.id}</td>
          <td>${data.name}</td>
          <td>${data.sector}</td>
          <td>${data.email}</td>
          <td>${data.phone}</td>
          <td class="button-form">
            <button class="edit-button" onclick="editEmployee('${docSnap.id}')"><img src="img/lapis_icone.png" alt="Ícone de Lápis" width="30" height="30"></button>
            <button class="delete-button" onclick="deleteEmployee('${docSnap.id}')"><img src="img/lixeira_icone.png" alt="Ícone de Lixeira" width="30" height="30"></button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
  }
}

// Função para excluir funcionário e seus registros de check-in
async function deleteEmployee(employeeId) {
  if (confirm('Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita e também vai excluir seus registros de check-in/out.')) {
    try {
      // Excluir funcionário da coleção 'employees'
      await deleteDoc(doc(db, 'employees', employeeId));

      // Excluir registros de check-in relacionados ao funcionário
      const checkinQuerySnapshot = await getDocs(collection(db, 'checkin'));
      checkinQuerySnapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        if (data.id === employeeId) {
          await deleteDoc(doc(db, 'checkin', docSnap.id));
        }
      });

      alert('Funcionário e seus registros de check-in excluídos com sucesso.');

      // Recarrega a tabela de funcionários
      loadEmployees();
    } catch (error) {
      console.error('Erro ao excluir funcionário e registros:', error);
      alert('Erro ao excluir o funcionário. Tente novamente.');
    }
  }
}

// Função para editar os dados de um funcionário
function editEmployee(employeeId) {
  const row = document.querySelector(`tr[data-id="${employeeId}"]`);
  const cells = row.getElementsByTagName('td');

  // Torna os campos editáveis (exceto o ID)
  for (let i = 1; i < cells.length - 1; i++) {
    const cell = cells[i];
    const originalText = cell.textContent;
    cell.innerHTML = `<input type="text" value="${originalText}" class="edit-input">`;
  }

  // Muda o botão de lápis para um botão de salvar
  const actionsCell = cells[cells.length - 1];
  actionsCell.innerHTML = `
    <button class="save-button" onclick="saveEmployee('${employeeId}')">💾</button>
    <button class="cancel-button" onclick="cancelEdit()">❌</button>
  `;
}

// Função para salvar as alterações no banco de dados
async function saveEmployee(employeeId) {
  const row = document.querySelector(`tr[data-id="${employeeId}"]`);
  const inputs = row.getElementsByClassName('edit-input');

  const updatedData = {
    name: inputs[0].value,
    sector: inputs[1].value,
    email: inputs[2].value,
    phone: inputs[3].value,
  };

  try {
    // Atualiza na coleção 'employees'
    await updateDoc(doc(db, 'employees', employeeId), updatedData);

    // Atualiza os registros correspondentes na coleção 'checkin'
    await updateCheckinRecords(employeeId, updatedData);

    alert('Funcionário atualizado com sucesso!');
    loadEmployees(); // Recarrega a tabela para refletir as mudanças
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    alert('Erro ao atualizar funcionário.');
  }
}

// Função para cancelar a edição
function cancelEdit() {
  loadEmployees(); // Recarrega a tabela para desfazer a edição
}

// Função para atualizar os registros na coleção 'checkin'
async function updateCheckinRecords(employeeId, updatedData) {
  const checkinRef = collection(db, 'checkin');

  try {
    const q = query(checkinRef, where('id', '==', updatedData.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      const checkinDocRef = doc(db, 'checkin', docSnap.id);
      await updateDoc(checkinDocRef, {
        name: updatedData.name,
        sector: updatedData.sector,
      });
    });
  } catch (error) {
    console.error('Erro ao atualizar registros na coleção checkin:', error);
  }
}

window.deleteEmployee = deleteEmployee;
window.editEmployee = editEmployee;
window.saveEmployee = saveEmployee;
window.cancelEdit = cancelEdit;

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

// Adicionar evento de busca em tempo real ao campo de pesquisa
document.getElementById('search-input').addEventListener('input', searchEmployees);

window.onload = loadEmployees;
window.confirmLogout = confirmLogout;
window.toggleSidebar = toggleSidebar;