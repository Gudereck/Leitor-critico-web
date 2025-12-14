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
  const notaEl = container.querySelector(".notaCriticaContainer");

// se vier null/undefined, mostra "NR"
if (livro.media_criticos == null) {
  notaEl.textContent = "NR";
  notaEl.style.color = ""; // opcional: reseta cor
} else {
  const media = Number(livro.media_criticos);
  notaEl.textContent = media.toFixed(1);

  if (media > 69) {
    notaEl.style.color = "#3CCF4E";
  } else if (media > 59 && media <= 69) {
    notaEl.style.color =  "#d4af37";;
  } else {
    notaEl.style.color = "#FF4E4E";
  }
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
