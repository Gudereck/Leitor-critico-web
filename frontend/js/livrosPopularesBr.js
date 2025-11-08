const popularesBr = [
  { titulo: "Grande Sertão: Veredas", autor: "João Guimarães Rosa" },
  { titulo: "Dom Casmurro", autor: "Machado de Assis" },
  { titulo: "Memórias Póstumas de Brás Cubas", autor: "Machado de Assis" },
  { titulo: "O Cortiço", autor: "Aluísio Azevedo" },
  { titulo: "Os Sertões", autor: "Euclides da Cunha" },
  { titulo: "Macunaíma", autor: "Mário de Andrade" },
  { titulo: "A Paixão Segundo G.H.", autor: "Clarice Lispector" },
  { titulo: "São Bernardo", autor: "Graciliano Ramos" },
  { titulo: "Vidas Secas", autor: "Graciliano Ramos" },
  { titulo: "Angústia", autor: "Graciliano Ramos" }
];



async function preencherLivrosPopularesBr() {
  const containers = document.querySelectorAll("#todasAsImagens .imgContainer");

  for (let i = 0; i < popularesBr.length && i < containers.length; i++) {
    const { titulo, autor } = popularesBr[i];
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

        // Atualiza capa e texto
        container.querySelector("img.imgBr").src = imagem;
        container.querySelector("img.imgBr").alt = `Capa do livro ${tituloAPI}`;
        container.querySelector(".h1LivrosBr").textContent = tituloAPI;
        container.querySelector(".nomeAutorBr").textContent = autorAPI;

        // Define links para /livros e /criticsreviews
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

// dispara ao carregar DOM
document.addEventListener("DOMContentLoaded", preencherLivrosPopularesBr);
