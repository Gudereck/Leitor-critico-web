document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

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
      // Supondo que o backend retorne { token, tipo: "user" ou "crítico" }
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipo", data.tipo);

      if (data.tipo === "user") {
        window.location.href = "dashboard-user.html";
      } else {
        window.location.href = "dashboard-critico.html";
      }
    } else {
      alert(data.msg || "Login inválido");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor.");
  }
});
