document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  const linkLogin = document.getElementById("link-login");
  const linkCadastro = document.getElementById("link-cadastro");
  const linkSair = document.getElementById("link-sair");

  if (usuarioLogado) {
    // Usuário está logado
    const usuario = JSON.parse(usuarioLogado);

    // Exemplo de atualização de interface:
    if (linkLogin) linkLogin.textContent = `Olá, ${usuario.nome}`;
    if (linkLogin) linkLogin.href = "/perfil/editar";

    if (linkCadastro) linkCadastro.style.display = "none"; // Esconde o link de Cadastro
    if (linkSair) linkSair.style.display = "inline"; // Mostra o link de Sair

    // Você pode também adicionar um link para o dashboard específico do cargo
    // const dashboardLink = document.getElementById("link-dashboard");
    // if (dashboardLink) {
    //     dashboardLink.href = usuario.cargo === "critico" ? "/dashboardCritico" : "/dashboard/usuario";
    //     dashboardLink.style.display = "inline";
    // }
  } else {
    // Usuário não está logado
    if (linkLogin) linkLogin.textContent = "Login";
    if (linkLogin) linkLogin.href = "/login";
    if (linkCadastro) linkCadastro.style.display = "inline";
    if (linkSair) linkSair.style.display = "none";
  }

  // Adiciona a lógica de logout (limpar o Local Storage)
  if (linkSair) {
    linkSair.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioLogado");
      window.location.href = "/"; // Redireciona para a página inicial
    });
  }
});
