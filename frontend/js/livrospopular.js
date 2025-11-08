const livros = [
  { titulo: "A Bíblia", autor: "Vários autores" },
  { titulo: "O Alcorão", autor: "Maomé" },
  { titulo: "Dom Quixote", autor: "Miguel de Cervantes" },
  { titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry" },
  { titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling" },
  { titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien" },
  { titulo: "O Hobbit", autor: "J.R.R. Tolkien" },
  { titulo: "As Crônicas de Nárnia", autor: "C.S. Lewis" },
  { titulo: "Cem Anos de Solidão", autor: "Gabriel García Márquez" },
  { titulo: "Orgulho e Preconceito", autor: "Jane Austen" }
];

async function preencherLivrosGoogleBooks() {
  const containers = document.querySelectorAll("#todasAsImagens .imgContainer");

  for (let i = 0; i < livros.length && i < containers.length; i++) {
    const { titulo, autor } = livros[i];
    const container = containers[i];
    const query = encodeURIComponent(`${titulo} ${autor}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&langRestrict=pt`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.items?.length > 0) {
        const info = data.items[0].volumeInfo;

        const imagem = info.imageLinks?.thumbnail || "";
        const tituloAPI = info.title || titulo;
        const autorAPI = info.authors?.[0] || autor;

        container.querySelector("img.imgpopular").src = imagem;
        container.querySelector("img.imgpopular").alt = `Capa do livro ${tituloAPI}`;
        container.querySelector(".h1Livros").textContent = tituloAPI;
        container.querySelector(".nomeAutor").textContent = autorAPI;

        container.querySelectorAll("a").forEach(link => {
          if (link.href.includes("/criticsreviews")) {
            link.href = `/criticsreviews?titulo=${encodeURIComponent(tituloAPI)}&autor=${encodeURIComponent(autorAPI)}`;
          } else {
            link.href = `/livros?titulo=${encodeURIComponent(tituloAPI)}&autor=${encodeURIComponent(autorAPI)}`;
          }
        });
      }

    } catch (err) {
      console.error(`Erro ao buscar "${titulo}" de ${autor}:`, err);
    }
  }
}

document.addEventListener("DOMContentLoaded", preencherLivrosGoogleBooks);
