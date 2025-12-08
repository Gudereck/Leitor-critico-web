// Inicia o evento para verificar e permitir que apenas o usuarios 'critico' possa ter certas permissões dentro da aplicação
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Faz com que os botões de login e logout apareçam ou desapareçam, dependendo da situação do usuario (se está logado ou não)
  const loginCadastro = document.getElementById("login-cadastro");
  const logout = document.getElementById("logout");

  // Garante que o usuário so tenha acesso a página "dashboardCritico", caso esteja logado!
  if (usuario === null && window.location.pathname === "/dashboardCritico") {
    window.location.href = "/";
    return;
  }

  if (usuario) {
    loginCadastro.style.display = "none";
    logout.style.display = "inline-block";
  } else {
    loginCadastro.style.display = "inline-block";
    logout.style.display = "none";
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
const logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert(`Logout realizado!`);

    document.getElementById("login-cadastro").style.display = "none";
    document.getElementById("logout").style.display = "inline-block";

    window.location.href = "/";
    localStorage.clear();
  });
}

// Cria um evento de Logout
const dashLogout = document.getElementById("dashLogout");

if (dashLogout) {
  dashLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert(`Logout realizado!`);
    window.location.href = "/";
    localStorage.clear();
  });
}

// Exibe o nome do crítico no dashboard
document.getElementById(
  "nomeCritico"
).innerText = `Bem-vindo(a) ao seu Dashboard, ${
  JSON.parse(localStorage.getItem("usuarioLogado")).nome
}!`;

// Exibe os KPIs do crítico no dashboard
document.getElementById("totalResenhas").innerText = `${
  JSON.parse(localStorage.getItem("usuarioLogado")).totalResenhas || 0
}`;

document.getElementById("rascunhosPendentes").innerText = `${
  JSON.parse(localStorage.getItem("usuarioLogado")).rascunhosPendentes || 0
}`;

document.getElementById("mediaAvaliacao").innerText = `${
  JSON.parse(localStorage.getItem("usuarioLogado")).mediaAvaliacao || 0
}`;

// Carrega a lista de críticas do crítico no dashboard
const listaCriticas = document.getElementById("lista-criticas");
const criticas =
  JSON.parse(localStorage.getItem("usuarioLogado")).criticas || [];
criticas.forEach((critica) => {
  const li = document.createElement("li");
  li.innerHTML = `<i class="fas fa-circle-dot"></i> [${critica.titulo}] - ${
    critica.status
  } ${
    critica.status === "Rascunho"
      ? `<button type="button" class="badge rascunho">Editar</button>`
      : `<button type="button" class="badge publicado">Ver</button>`
  }`;
  listaCriticas.appendChild(li);
});
