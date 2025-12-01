function deletarConta() {
  const confirmDelete = confirm(
    "Tem certeza que deseja excluir sua conta? Essa ação é irreversível."
  );

  if (confirmDelete) {
    // Limpa dados locais (opcional)
    localStorage.clear();

    // Redireciona para a rota que lida com a exclusão
    window.location.href = "/delete-account";
  }
}

// Função para voltar ao dashboard do crítico
function voltarCritico() {
  window.location.href = "/dashboardCritico";
}

// Cria um evento de Logout
const logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert(`Logout realizado!`);
    window.location.href = "/";
    localStorage.clear();
  });
}
