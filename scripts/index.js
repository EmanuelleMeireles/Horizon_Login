import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAO2sGJZDarnIWtJUlJb-Qrc3cg5g0qmqc',
  authDomain: 'horizon-focus.firebaseapp.com',
  projectId: 'horizon-focus',
  storageBucket: 'horizon-focus.firebaseapp.com',
  messagingSenderId: '31055563122',
  appId: '1:31055563122:web:da0bb34a1c5076ab0675eb',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para tratar o check-in/check-out
async function handleCheckin() {
  const idInput = document.getElementById('id-input').value.trim();
  if (!idInput) {
    alert('Por favor, digite um ID ou e-mail.');
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const employeesRef = collection(db, 'employees');

    // Consulta para verificar se o ID ou o e-mail correspondem a um funcionário
    const q = query(employeesRef, where('id', '==', idInput));
    const emailQuery = query(employeesRef, where('email', '==', idInput));

    let querySnapshot = await getDocs(q);

    // Se não encontrar pelo ID, busca pelo e-mail
    if (querySnapshot.empty) {
      querySnapshot = await getDocs(emailQuery);
    }

    if (!querySnapshot.empty) {
      const employeeDoc = querySnapshot.docs[0];
      const employeeData = employeeDoc.data();

      const checkinRef = collection(db, 'checkin');
      const checkinQuery = query(
        checkinRef,
        where('id', '==', employeeData.id),
        where('data', '==', today),
        where('checkOut', '==', '')
      );

      const checkinSnapshot = await getDocs(checkinQuery);

      if (checkinSnapshot.empty) {
        await addDoc(checkinRef, {
          id: employeeData.id,
          name: employeeData.name,
          sector: employeeData.sector,
          data: today,
          checkIn: currentTime,
          checkOut: '',
        });

        alert(`Check-in realizado com sucesso para ${employeeData.name} às ${currentTime}.`);
      } else {
        const checkinDoc = checkinSnapshot.docs[0];
        await updateDoc(doc(db, 'checkin', checkinDoc.id), {
          checkOut: currentTime,
        });

        alert(`Check-out realizado com sucesso para ${employeeData.name} às ${currentTime}.`);
      }
    } else {
      alert('Funcionário não encontrado. Verifique o ID ou e-mail.');
    }

    // Limpar o campo de entrada
    document.getElementById('id-input').value = '';
  } catch (error) {
    console.error('Erro ao realizar check-in/check-out:', error);
    alert('Erro ao realizar check-in/check-out. Tente novamente.');
  }
}

// Permite que a função seja acessada pelo HTML
window.handleCheckin = handleCheckin;

// Função para capturar a tecla "Enter" no input
document.getElementById('id-input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleCheckin();
  }
});


// Função para mostrar o modal
async function showPendingCheckouts() {
  const modal = document.getElementById('modal');
  const tableBody = document.getElementById('pending-checkouts-table');
  tableBody.innerHTML = '';

  try {
    const today = new Date().toISOString().split('T')[0];
    const checkinRef = collection(db, 'checkin');
    const checkinQuery = query(checkinRef, where('data', '==', today), where('checkOut', '==', ''));

    const querySnapshot = await getDocs(checkinQuery);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.name}</td>
          <td>${data.sector}</td>
          <td>${data.checkIn}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });

    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao carregar check-outs pendentes:', error);
    alert('Erro ao carregar check-outs pendentes.');
  }
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}

// Exporta as funções para uso no HTML
window.handleCheckin = handleCheckin;
window.showPendingCheckouts = showPendingCheckouts;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const verifiedIdentifier = urlParams.get('verified');

  if (verifiedIdentifier) {
    performCheckin(verifiedIdentifier);
  }
});


