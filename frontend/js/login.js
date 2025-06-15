document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      // Salva token e tipo de usuário
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipo", data.tipo);

      if (data.tipo === "usuario") {
        window.location.href = "dashboardUsuario.html";
      } else if (data.tipo === "critico") {
        window.location.href = "dashboardCritico.html";
      } else {
        alert("Tipo de usuário desconhecido.");
      }
    } else {
      alert(data.msg || "Login inválido.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor.");
  }
});
