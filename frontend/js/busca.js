const input = document.getElementById("inputBusca");
const resultados = document.getElementById("resultadoBusca");
const form = document.getElementById("formBusca");

if (input && resultados && form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      resultados.innerHTML = "";
      return;
    }

    const res = await fetch(`/busca?q=${encodeURIComponent(q)}`);
    const livros = await res.json();

    if (!livros.length) {
      resultados.innerHTML = "<div class='item-busca'>Nenhum livro encontrado</div>";
      return;
    }

    resultados.innerHTML = livros
      .map(
        (l) =>
          `<a href="/livros?id=${l.id_livro}" class="item-busca">${l.titulo}</a>`
      )
      .join("");
  });
}
