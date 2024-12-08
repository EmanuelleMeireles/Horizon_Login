let currentUser = localStorage.getItem("adminUser");
let currentPassword = localStorage.getItem("adminPassword");

function saveCredentials() {
  localStorage.setItem("adminUser", currentUser);
  localStorage.setItem("adminPassword", currentPassword);
}

function updateCredentials() {
  const newUser = document.getElementById("new-user").value;
  const newPassword = document.getElementById("new-password").value;

  if (newUser.trim() !== "" && newPassword.trim() !== "") {
    currentUser = newUser;
    currentPassword = newPassword;
    saveCredentials(); 
    showInfoPage();
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}

function showInfoPage() {
  currentUser = localStorage.getItem("adminUser");
  currentPassword = localStorage.getItem("adminPassword");

  document.getElementById("current-user").textContent = `Usuário atual: "${currentUser}"`;
  document.getElementById("current-password").textContent = `Senha atual: "${currentPassword}"`;

  document.getElementById("info-page").classList.remove("hidden");
  document.getElementById("update-page").classList.add("hidden");
}

function showUpdatePage() {
  document.getElementById("info-page").classList.add("hidden");
  document.getElementById("update-page").classList.remove("hidden");
}

function toggleSidebar() {
  const sidebar = document.querySelector(".card-left");
  sidebar.classList.toggle("hidden");
}

window.onload = () => {
  if (!localStorage.getItem("adminUser") || !localStorage.getItem("adminPassword")) {
    saveCredentials(); 
  }
  showInfoPage(); 
};

function confirmLogout() {
  const userConfirmed = confirm("Tem certeza de que deseja retornar à página inicial?");
  if (userConfirmed) {
    window.location.href = "index.html";
  }
}