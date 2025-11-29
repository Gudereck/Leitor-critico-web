// -------------------------
// SISTEMA DE CRÍTICAS (localStorage)
// -------------------------

// Simulação de usuário logado
const usuarioAtual = {
  nome: "Me Julga - Cintia Brunelli",
  cargo: "critico",
};

const isCritico = usuarioAtual.cargo === "critico";

// Exibe ou oculta o formulário de críticas
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formCritico").style.display = isCritico ? "block" : "none";
  document.getElementById("usuario").value = usuarioAtual.nome;

  carregarCriticas();
  configurarFormulario();
});

// -------------------------
// Formulário
// -------------------------

function configurarFormulario() {
  const form = document.getElementById("criticaForm");
  const contador = document.getElementById("contador");
  const texto = document.getElementById("texto");

  // contador caracteres
  texto.addEventListener("input", () => {
    contador.textContent = `${texto.value.length} / 100`;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const critica = {
      usuario: document.getElementById("usuario").value,
      texto: texto.value.trim(),
      nota: parseInt(document.getElementById("nota").value),
      link: document.getElementById("link").value.trim(),
      data: new Date().toLocaleString("pt-BR"),
    };

    salvarCritica(critica);
    adicionarCriticaNaTela(critica);
    atualizarMedia();

    form.reset();
    contador.textContent = "0 / 100";
  });
}

// -------------------------
// LocalStorage
// -------------------------

function salvarCritica(critica) {
  const criticas = JSON.parse(localStorage.getItem("criticas")) || [];
  criticas.unshift(critica);
  localStorage.setItem("criticas", JSON.stringify(criticas));
}

function carregarCriticas() {
  const criticas = JSON.parse(localStorage.getItem("criticas")) || [];
  criticas.forEach(adicionarCriticaNaTela);
  atualizarMedia();
}

// -------------------------
// Renderização das críticas
// -------------------------

const container = document.getElementById("criticasContainer");

function adicionarCriticaNaTela(critica) {
  const div = document.createElement("div");
  div.classList.add("critica");

  const cor = getCorNota(critica.nota);

  div.innerHTML = `
    <div id="container-critica-interno">
      <div id="nota-autor">
        <p class="nota ${cor}">${critica.nota}</p>
        <p class="autor">por ${critica.usuario}</p>
      </div>

      <p>${critica.texto}</p>

      ${critica.link
        ? `<p class="link"><a href="${critica.link}" target="_blank">Ver resenha completa</a></p>`
        : ""}

      <small>Postado em: ${critica.data}</small>
    </div>
  `;

  container.appendChild(div);
}

// -------------------------
// Cores da nota
// -------------------------

function getCorNota(nota) {
  if (nota <= 50) return "vermelha";
  if (nota <= 69) return "amarela";
  return "verde";
}

// -------------------------
// Média de avaliações
// -------------------------

function atualizarMedia() {
  const criticas = JSON.parse(localStorage.getItem("criticas")) || [];
  const mediaElem = document.querySelector(".media-avaliacao");
  const mediaNotasElem = document.getElementById("mediaNotas");

  if (criticas.length === 0) {
    mediaNotasElem.textContent = "Sem avaliações ainda.";
    mediaElem.textContent = "?";
    mediaElem.classList.remove("vermelha", "amarela", "verde");
    return;
  }

  const media = (
    criticas.reduce((acc, c) => acc + c.nota, 0) / criticas.length
  ).toFixed(1);

  const cor = getCorNota(media);

  mediaNotasElem.textContent = `Média das Avaliações: ${media}`;
  mediaElem.textContent = media;

  mediaElem.classList.remove("vermelha", "amarela", "verde");
  mediaElem.classList.add(cor);
}
