let comments = [];

function adicionarComentários() {
  const inputComentário = document.getElementById("inputComentário");
  let comentário = inputComentário.value.trim();

  comments.push(comentário);
  renderizarComentários();
}

inputComentário.value = "";

function renderizarComentários() {
  const commentsList = document.getElementById("commentsList");
  commentsList.innerHTML = "";

  for (let i = 0; i < comments.length; i++) {
    let novoComentário = document.createElement("li");
    novoComentário.textContent = comments[i];

    let botaoRemover = document.createElement("button");
    botaoRemover.className = "remover";
    botaoRemover.textContent = "Remover";
    botaoRemover.onclick = () => removerTarefa(i);

    let botaoEditar = document.createElement("button");
    botaoEditar.className = "editar";
    botaoEditar.textContent = "Editar";
    botaoEditar.onclick = () => editarComentário(i);

    novoComentário.appendChild(botaoRemover);
    novoComentário.appendChild(botaoEditar);
    commentsList.appendChild(novoComentário);
  }

  atualizarBotaoRemoverTudo();
}

function atualizarBotaoRemoverTudo() {
  let botaoRemoverTudo = document.getElementById("botaoRemoverTudo");

  if (comments.length > 0) {
    if (!botaoRemoverTudo) {
      botaoRemoverTudo = document.createElement("button");
      botaoRemoverTudo.id = "botaoRemoverTudo";
      botaoRemoverTudo.textContent = "Remover Tudo";
      botaoRemoverTudo.onclick = limparComentário;
      document.getElementById("apagarTudo").appendChild(botaoRemoverTudo);
    }
  } else {
    if (botaoRemoverTudo) {
      botaoRemoverTudo.remove();
    }
  }
}

function removerTarefa(i) {
  comments.splice(i, 1);
  renderizarComentários();
  atualizarBotaoRemoverTudo(); // Garante que o botão suma ao remover a última tarefa
}

function editarTarefa(i) {
  let tarefaEditada = prompt("Edite a tarefa:");
  if (tarefaEditada && tarefaEditada.trim() !== "") {
    comments[i] = tarefaEditada.trim();
    renderizarComentários();
  }
}

function limparComentário() {
  comments = [];
  renderizarComentários();
  document.getElementById("mensagem").textContent =
    "Comentário limpo com sucesso";
  atualizarBotaoRemoverTudo(); // Garante que o botão suma ao remover tudo
}
