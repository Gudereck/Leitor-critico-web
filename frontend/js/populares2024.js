// Busca livros no backend
async function carregarPopulares2024() {
  try {
    const res = await fetch("/api/livros/populares-2024");
    const livros = await res.json();

    const containers = document.querySelectorAll(".imgContainer");

    livros.forEach((livro, i) => {
      if (!containers[i]) return;

      const c = containers[i];

      c.querySelector("img.img2024").src = livro.link_imagem || "";
      c.querySelector("img.img2024").alt = "Capa do livro " + livro.titulo;

      c.querySelector(".h1Livros").textContent = livro.titulo;
      c.querySelector(".nomeAutor").textContent = livro.autor || "";

      // Atualiza links
      c.querySelectorAll("a").forEach((a) => {
        if (a.href.includes("/criticsreviews")) {
          a.href = `/criticsreviews?id=${livro.id_livro}`;
        } else {
          a.href = `/livros?id=${livro.id_livro}`;
        }
      });
    });
  } catch (err) {
    console.error("Erro carregando livros populares 2024:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarPopulares2024);
