let paginaAtual = 0;
const TAMANHO_PAGINA = 10; // número de cards por página
let livrosCache = [];

async function carregarPopulares2024() {
  try {
    const res = await fetch("/api/livros/populares-2024");
    livrosCache = await res.json();

    renderPagina();
    configurarPaginacao();
  } catch (err) {
    console.error("Erro carregando livros populares 2024:", err);
  }
}

function renderPagina() {
  const containers = document.querySelectorAll(".imgContainer");
  const inicio = paginaAtual * TAMANHO_PAGINA;
  const paginaLivros = livrosCache.slice(inicio, inicio + TAMANHO_PAGINA);

  containers.forEach((c, i) => {
    const livro = paginaLivros[i];

    if (!livro) {
      c.style.display = "none";
      return;
    }
    c.style.display = "";

    const img = c.querySelector("img.img2024");
    if (img) {
      img.src = livro.link_imagem || "";
      img.alt = "Capa do livro " + livro.titulo;
    }

    const h1 = c.querySelector(".h1Livros");
    if (h1) h1.textContent = livro.titulo;

    const autorEl = c.querySelector(".nomeAutor");
    if (autorEl) autorEl.textContent = livro.autor || "";

    c.querySelectorAll("a").forEach((a) => {
      if (a.href.includes("/criticsreviews")) {
        a.href = `/criticsreviews?id=${livro.id_livro}`;
      } else {
        a.href = `/livros?id=${livro.id_livro}`;
      }
    });
  });
}

function configurarPaginacao() {
  const btnProx = document.getElementById("btnProxima");
  const btnAnt = document.getElementById("btnAnterior");

  if (btnProx) {
    btnProx.onclick = () => {
      if ((paginaAtual + 1) * TAMANHO_PAGINA < livrosCache.length) {
        paginaAtual++;
        renderPagina();
      }
    };
  }

  if (btnAnt) {
    btnAnt.onclick = () => {
      if (paginaAtual > 0) {
        paginaAtual--;
        renderPagina();
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", carregarPopulares2024);
