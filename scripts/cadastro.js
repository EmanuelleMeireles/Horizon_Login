import { db } from './firebaseConfig.js';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

// Função para gerar um ID aleatório no formato "ab123"
function generateRandomID() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const letter1 = letters[Math.floor(Math.random() * 26)];
  const letter2 = letters[Math.floor(Math.random() * 26)];
  const number = Math.floor(100 + Math.random() * 900);
  return `${letter1}${letter2}${number}`;
}

// Função para gerar um ID único verificando no Firestore
async function generateUniqueID() {
  let unique = false;
  let newID = '';

  while (!unique) {
    newID = generateRandomID();

    try {
      const querySnapshot = await getDocs(query(collection(db, 'employees'), where('id', '==', newID)));
      if (querySnapshot.empty) {
        unique = true;
      }
    } catch (error) {
      console.error('Erro ao verificar ID único:', error);
    }
  }

  return newID;
}

// Manipula o envio do formulário
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const sector = document.getElementById('sector').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  console.log('Tentando cadastrar funcionário:', { name, sector, email, phone });

  try {
    const id = await generateUniqueID(); // Gera um ID único

    await addDoc(collection(db, 'employees'), {
      id,
      name,
      sector,
      email,
      phone,
      checkIn: null,
      checkOut: null,
    });

    alert(`Funcionário cadastrado com sucesso! ID: ${id}`);
    document.getElementById('employeeForm').reset();
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error);
    alert('Erro ao cadastrar funcionário. Verifique o console para mais detalhes.');
  }
});

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