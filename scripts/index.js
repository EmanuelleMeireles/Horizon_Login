function handleCheckin() {
  const idInput = document.getElementById('id-input').value.trim();

  if (idInput) {
    window.location.href = 'email.html';
  } else {
    alert('Por favor, digite seu ID para continuar.');
  }
}

function showPendingCheckouts() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  
  const pendingCheckouts = history.filter(entry => entry.saida === "");

  const tableBody = document.getElementById("pending-checkouts-table");
  tableBody.innerHTML = ""; 

  pendingCheckouts.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.nome || "N/A"}</td>
      <td>${entry.setor || "N/A"}</td>
      <td>${entry.entrada}</td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}