function toggleSidebar() {
    const sidebar = document.querySelector('.card-left');
    sidebar.classList.toggle('hidden');
  }

  function navigateToHistory() {
    window.location.href = 'historico.html';
  }

  function confirmLogout() {
    const userConfirmed = confirm("Tem certeza de que deseja retornar à página inicial?");
    if (userConfirmed) {
      window.location.href = "index.html";
    }
  }
  