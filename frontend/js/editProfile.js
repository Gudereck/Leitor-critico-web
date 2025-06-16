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

function logout() {
  if (confirm("Deseja realmente sair?")) {
    localStorage.clear();
    window.location.href = "frontend/dashboardUsuario.html";
  }
}
