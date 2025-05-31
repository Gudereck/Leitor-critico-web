// Função de logout
function logout() {
  if (confirm("Deseja realmente sair?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

