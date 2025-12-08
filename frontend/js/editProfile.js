// Adiciona listener para carregar os dados do perfil quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  carregarDadosPerfil();

  // Listener para o botão Salvar (deve ter id="submitSalvar" ou similar no EJS)
  const submitSalvar = document.getElementById("buttonSalvar");
  if (submitSalvar) {
    submitSalvar.addEventListener("click", handleEditProfile);
  }
});

// Função para carregar os dados do perfil ao iniciar a página
async function carregarDadosPerfil() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    alert("Sessão expirada. Redirecionando para login.");
    window.location.href = "/login";
    return;
  }

  try {
    const { id_usuario } = JSON.parse(usuarioLogado);

    // Chama a rota GET /api/perfil/getProfile/:id
    const response = await fetch(`/api/perfil/getProfile/${id_usuario}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.erro || `Erro ao carregar perfil: ${response.status}`
      );
    }

    const userData = await response.json();

    // Preenche o formulário
    document.getElementById("name").value = userData.nome || "";
    document.getElementById("email").value = userData.email || "";
    // Campo senha permanece vazio por segurança.
  } catch (error) {
    console.error("Erro ao carregar dados do perfil:", error);
    alert(`Não foi possível carregar os dados do perfil. ${error.message}`);
    // Redireciona em caso de falha crítica na obtenção do perfil
    window.location.href = "/dashboardCritico";
  }
}

// Função para lidar com o envio do formulário de edição
async function handleEditProfile(event) {
  event.preventDefault(); // Impede o envio padrão

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (!usuarioLogado) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "/login";
    return;
  }

  const { id_usuario } = JSON.parse(usuarioLogado);

  const data = {
    id_usuario: id_usuario,
    nome: name,
    email: email,
    ...(password && { senha: password }),
  };

  try {
    // Chama a rota POST /api/perfil/updateProfile
    const response = await fetch("/api/perfil/updateProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.mensagem);

      // Atualiza o localStorage com o novo nome/email (se não tiver sido alterada a senha)
      const novoUsuarioLogado = {
        ...JSON.parse(usuarioLogado),
        nome: name,
        email: email,
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuarioLogado));

      window.location.href = "/dashboardCritico";
    } else {
      alert(`Erro ao salvar perfil: ${result.erro}`);
    }
  } catch (error) {
    console.error("Erro ao enviar edição de perfil:", error);
    alert("Erro de comunicação com o servidor.");
  }
}

// Função para deletar conta
async function deletarConta() {
  const confirmDelete = confirm(
    "Tem certeza que deseja excluir sua conta? Essa ação é irreversível."
  );

  if (confirmDelete) {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
      alert("Erro: Nenhum usuário logado encontrado.");
      window.location.href = "/login";
      return;
    }

    const { id_usuario } = JSON.parse(usuarioLogado);

    try {
      // Chama a rota DELETE /api/perfil/delete-account/:id
      const response = await fetch(`/api/perfil/delete-account/${id_usuario}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.mensagem);
        localStorage.clear();
        window.location.href = "/";
      } else {
        alert(`Erro ao excluir conta: ${result.erro}`);
      }
    } catch (error) {
      console.error("Erro de comunicação ao deletar conta:", error);
      alert("Erro de comunicação com o servidor.");
    }
  }
}

// Função para voltar ao dashboard (mantida)
function voltarCritico() {
  window.location.href = "/dashboardCritico";
}

// Cria um evento de Logout (mantido)
const logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener("click", () => {
    localStorage.clear(); // Limpa todos os dados da sessão
    alert(`Logout realizado!`);
    window.location.href = "/";
  });
}
