document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const tipo_usuario = document.getElementById("tipo").value;

    if (!nome || !email || !senha || !tipo_usuario) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha, tipo_usuario }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "/login";
      } else {
        alert(data.msg || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
