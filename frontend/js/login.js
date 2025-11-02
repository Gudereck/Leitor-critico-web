document.addEventListener("DOMContentLoaded", () => {
  // Encontra o formulário de login
  const loginForm = document.querySelector(".login-form");

  if (!loginForm) {
    console.error("Formulário .login-form não encontrado!");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Pega os dados dos campos
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Validação básica
    if (!email || !senha) {
      alert("Por favor, preencha o email e a senha.");
      return;
    }

    // Prepara os dados para enviar à API
    const dadosLogin = {
      email: email,
      senha: senha,
    };

    try {
      // Envia a requisição para a API
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLogin),
      });

      // Pega a resposta JSON
      const result = await response.json();

      // Trata a resposta
      if (response.ok) {
        alert(result.msg); // "Login realizado com sucesso!"

        /* Salva os dados do usuário no Local Storage para
        que outras páginas saibam que ele está logado */
        localStorage.setItem("usuarioLogado", JSON.stringify(result.usuario));

        // --- LÓGICA DE REDIRECIONAMENTO ---
        // Está usando o 'cargo' que o backend enviou.
        if (result.usuario.role === "critico") {
          window.location.href = "/dashboard/critico";
        } else {
          window.location.href = "/dashboard/usuario";
        }
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor. Tente novamente.");
    }
  });
});
