// Inicia o evento para verificar e permitir que apenas o usuarios 'critico' possa ter certas permissões dentro da aplicação
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Faz com que os botões de login e logout apareçam ou desapareçam, dependendo da situação do usuario (se está logado ou não)
  const loginCadastroHamburger = document.getElementById(
    "login-cadastro-hamburger"
  );
  const logoutHamburger = document.getElementById("logout-hamburger");

  if (usuario) {
    loginCadastroHamburger.style.display = "none";
    logoutHamburger.style.display = "inline-block";
  } else {
    loginCadastroHamburger.style.display = "inline-block";
    logoutHamburger.style.display = "none";
  }

  if (!usuario) return;

  if (usuario.cargo !== "critico") {
    alert(`Apenas criticos podem editar estes campos.`);

    // Bloqueia todos os inputs marcados como somente-critico
    document.querySelectorAll(".somente-critico").forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });

    return;
  }

  // Se for critico -> libera os campos
  document.querySelectorAll(".somente-critico").forEach((input) => {
    input.removeAttribute("disabled");
  });

  console.log("Campos liberados para critico.");
});

// Cria um evento de Logout
const logoutHamburger = document.getElementById("logout-hamburger");

if (logoutHamburger) {
  logoutHamburger.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert(`Logout realizado!`);

    document.getElementById("login-cadastro-hamburger").style.display = "none";
    document.getElementById("logout-hamburger").style.display = "inline-block";

    window.location.href = "/";
    localStorage.clear();
  });
}