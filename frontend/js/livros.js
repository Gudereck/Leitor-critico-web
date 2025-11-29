async function preencherLivrosBackend() {
  const containers = document.querySelectorAll("#todasAsImagens .imgContainer");

  try {
    const res = await fetch("/api/livros");
    const livros = await res.json();

    for (let i = 0; i < livros.length && i < containers.length; i++) {
      const livro = livros[i];
      const container = containers[i];

      container.querySelector("img.imgLivros").src = livro.link_imagem;
      container.querySelector(".h1Livros").textContent = livro.titulo;
      container.querySelector(".nomeAutor").textContent = "autor no banco";

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
