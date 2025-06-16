const editarPerfilButton = document.getElementById("editPerfil");
// Adiciona evento ao botão Editar Perfil
editarPerfilButton.addEventListener("click", function () {
  editarPerfil(editarPerfilButton);
});

function editarPerfil(editarPerfilButton) {
  // Redireciona para a página de edição de perfil
  if (!isLoggedIn()) {
    alert("Você precisa estar logado para editar o perfil.");
    window.location.href = "login.html";
    return;
  }
  // Redireciona para a página de edição de perfil
  window.location.href = "editProfile.html";
}

// Função para verificar se o usuário está logado
function isLoggedIn() {
  return localStorage.getItem("user") !== null;
}

// Função de logout
function logout() {
  if (confirm("Deseja realmente sair?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

// Adicionar quando o JavaScript e ligação com o banco de dados para registro de criação de conta for criado
/*
let name = document.getElementById("user-name");

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o usuário está logado
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  } else {
    // Exibe o nome do usuário
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("user-name").innerHTML = user.name;
  }

  // Adiciona evento ao botão Editar Perfil
  document.getElementById("editPerfil").addEventListener("click", function () {
    window.location.href = "editProfile.html";
  });
});
*/
