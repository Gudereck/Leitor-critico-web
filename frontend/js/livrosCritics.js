// ============== CARREGAR DETALHES DO LIVRO ==============
async function carregarLivro() {
  const id = window.LIVRO_ID;
  if (!id) return;

  try {
    const res = await fetch(`/api/livros/detalhes/${id}`);
    const livro = await res.json();

    document.getElementById("titulo-livro").textContent = livro.titulo || "";
    document.getElementById("autor-livro").textContent = livro.autores || "";
    document.getElementById("capa-livro").src = livro.link_imagem || "/img/placeholder.png";

    document.getElementById("editora").textContent = livro.editora || "—";
    document.getElementById("ano").textContent = livro.data_publicacao?.substring(0,4) || "—";
    document.getElementById("idioma").textContent = livro.idioma || "—";
    document.getElementById("paginas").textContent = livro.numero_paginas || "—";
    document.getElementById("categoria").textContent = livro.categoria_principal || "—";
    document.getElementById("isbn10").textContent = livro.isbn_10 || "—";
    document.getElementById("isbn13").textContent = livro.isbn_13 || "—";
    document.getElementById("descricao").textContent = livro.descricao || "Descrição não disponível";

  } catch (error) {
    console.error("Erro ao carregar detalhes do livro:", error);
  }
}



// ============== SISTEMA DE CRÍTICAS LOCAL (mantido igual ao seu) ==============

const usuarioAtual = { nome: "Crítico Teste", cargo: "critico" };
const isCritico = usuarioAtual.cargo === "critico";

document.addEventListener("DOMContentLoaded", () => {
  carregarLivro();
  carregarCriticas();

  if (isCritico) {
    document.getElementById("formCritico").style.display = "block";
    document.getElementById("usuario").value = usuarioAtual.nome;
  }
});

const form = document.getElementById("criticaForm");
const container = document.getElementById("criticasContainer");
const texto = document.getElementById("texto");
const contador = document.getElementById("contador");

texto?.addEventListener("input", () => {
  contador.textContent = `${texto.value.length}/100`;
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const critica = {
    usuario: usuarioAtual.nome,
    texto: texto.value,
    nota: Number(document.getElementById("nota").value),
    link: document.getElementById("link").value,
    data: new Date().toLocaleString("pt-BR"),
  };

  salvarCritica(critica);
  adicionarCriticaNaTela(critica);
  atualizarMedia();

  form.reset();
  contador.textContent = "0/100";
});

function salvarCritica(critica) {
  const cx = JSON.parse(localStorage.getItem("criticas")) || [];
  cx.unshift(critica);
  localStorage.setItem("criticas", JSON.stringify(cx));
}

function carregarCriticas() {
  const cx = JSON.parse(localStorage.getItem("criticas")) || [];
  cx.forEach(adicionarCriticaNaTela);
  atualizarMedia();
}

function adicionarCriticaNaTela(critica) {
  const div = document.createElement("div");
  div.classList.add("critica");

  div.innerHTML = `
    <p><strong>${critica.usuario}</strong> — Nota: ${critica.nota}</p>
    <p>${critica.texto}</p>
    ${critica.link ? `<a href="${critica.link}" target="_blank">Ver resenha completa</a>` : ""}
    <small>${critica.data}</small>
    <hr>
  `;

  container.appendChild(div);
}

function atualizarMedia() {
  const cx = JSON.parse(localStorage.getItem("criticas")) || [];
  const mediaElem = document.getElementById("mediaNotas");

  if (cx.length === 0) {
    mediaElem.textContent = "Sem avaliações ainda.";
    return;
  }

  const media = cx.reduce((s, n) => s + n.nota, 0) / cx.length;
  mediaElem.textContent = `Média das avaliações: ${media.toFixed(1)}`;
}
