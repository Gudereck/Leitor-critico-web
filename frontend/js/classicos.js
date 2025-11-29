async function carregarClassicos() {
  try {
    const res = await fetch("/api/livros/classicos");
    const livros = await res.json();

    const containers = document.querySelectorAll(".imgContainer");

    livros.forEach((livro, i) => {
      if (!containers[i]) return;

      const c = containers[i];

      // imagem
      c.querySelector("img").src = livro.link_imagem || "";

      // título
      c.querySelector(".h1Livros").textContent = livro.titulo;

      // autor (se houver)
      c.querySelector(".nomeAutor").textContent =
        livro.autores || livro.categoria_principal || "";

      // links
      c.querySelectorAll("a").forEach(link => {
        link.href = `/livros?id=${livro.id_livro}`;
      });
    });
  } catch (err) {
    console.error("Erro carregando clássicos:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarClassicos);
