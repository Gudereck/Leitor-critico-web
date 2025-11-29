async function carregarPopulares() {
  try {
    const res = await fetch("/api/livros/populares");
    const livros = await res.json();

    const containers = document.querySelectorAll(".imgContainer");

    livros.forEach((livro, i) => {
      if (!containers[i]) return;

      const c = containers[i];

      // Imagem
      c.querySelector("img").src = livro.link_imagem || "/img/placeholder.png";

      // Título
      c.querySelector(".h1Livros").textContent = livro.titulo;

      // Autor
      c.querySelector(".nomeAutor").textContent =
        livro.autores || livro.categoria_principal || "Autor não disponível";

      // Links
      c.querySelectorAll("a").forEach((link) => {
        link.href = `/livros?id=${livro.id_livro}`;
      });
    });
  } catch (err) {
    console.error("Erro ao carregar Populares:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarPopulares);
