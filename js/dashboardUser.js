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

// Adiciona o evento de clique ao botão de editar perfil
document.getElementById("editPerfil").addEventListener("click", function () {
  window.location.href = "editProfile.html";
});




// Adicionar quando o JavaScript para registro de criação de conta for criado 
/*
let name = document.getElementById("user-name");
document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o usuário está logado
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  } else {
    // Se o usuário estiver logado, exibe o nome do usuário
    const user = JSON.parse(localStorage.getItem("user"));
    name.innerHTML = user.name;
  }
});
*/
