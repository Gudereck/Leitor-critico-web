function resetForm() {
  const form = document.querySelector(".login-form");
  if (form) {
    form.reset();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");

  if (!loginForm) {
    console.error("Formulário .login-form não encontrado!");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      alert("Por favor, preencha o email e a senha.");
      return;
    }

    const dadosLogin = { email, senha };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dadosLogin)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("usuarioLogado", JSON.stringify(result.user));
        window.location.href = "/";
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  });
});
