async function preencherLivrosBackend() {
  const containers = document.querySelectorAll("#todasAsImagens .imgContainer");

  try {
    const res = await fetch("/api/livros");
    const livros = await res.json();

    for (let i = 0; i < livros.length && i < containers.length; i++) {
      const livro = livros[i];
      console.log(livro);
      const container = containers[i];

      container.querySelector("img.imgLivros").src = livro.link_imagem;
      container.querySelector(".h1Livros").textContent = livro.titulo;
      container.querySelector(".nomeAutor").textContent = livro.autor;
      container.querySelector(".notaCriticaContainer").textContent = livro.media_avaliacao || "NR";
const media = Number(livro.media_avaliacao);
const notaEl = container.querySelector(".notaCriticaContainer");

if (!livro.media_avaliacao) {
   // branco
} else if (media > 69) {
  notaEl.style.color = "#3CCF4E"; // verde elegante
} else if (media > 59 && media <= 69) {
  notaEl.style.color = "#FFD93D"; // amarelo suave
} else if (media <= 59) {
  notaEl.style.color = "#FF4E4E"; // vermelho moderno
}
      const links = container.querySelectorAll("a");
      links.forEach((link) => {
        link.href = `/livros?id=${livro.id_livro}`;
      });
    }
  } catch (err) {
    console.error("Erro ao carregar livros:", err);
  }
}


document.addEventListener("DOMContentLoaded", preencherLivrosBackend);
