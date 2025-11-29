document.addEventListener("DOMContentLoaded", async () => {
  if (!window.LIVRO_ID) return;

  try {
    const res = await fetch(`/api/livros/detalhes/${window.LIVRO_ID}`);
    const livro = await res.json();

    document.getElementById("nome-livro").textContent = livro.titulo;
    document.getElementById("nome-autor").textContent = livro.autores || "";
    document.getElementById("capa-livro").src = livro.link_imagem || "";

    document.getElementById("info-ano").textContent =
      livro.ano || "Não disponível";

    document.getElementById("info-editora").textContent =
      livro.editora || "Não disponível";

    document.getElementById("detalhes-livro").textContent =
      livro.descricao || "Sem detalhes disponíveis";

  } catch (err) {
    console.error("Erro ao carregar livro:", err);
  }
});
