document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".cadastro-form");

  if (!form) {
    console.error("Formulário .cadastro-form não encontrado!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const redeSocial = document.getElementById("redeSocial").value;


    // Validação simples no frontend
    if (!nome || !email || !senha || !confirmarSenha || !redeSocial) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // Preparar os dados para envio
    const dadosCadastro = {
      nome: nome,
      email: email,
      senha: senha,
      redeSocial: redeSocial,
    };

    try {
      // Envia os dados para a API usando Fetch
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCadastro),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.msg); // "Cadastro realizado com sucesso!"
        window.location.href = "/login";
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  });
});
