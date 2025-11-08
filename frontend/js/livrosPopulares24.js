const livrosMaisVendidos2024 = [
  { titulo: "Café com Deus Pai 2024: Porções Diárias de paz", autor: "Júnior Rostirola" },
  { titulo: "A Biblioteca da Meia-Noite", autor: "Matt Haig & Adriana Fidalgo" },
  { titulo: "É Assim que Acaba: 1", autor: "Colleen Hoover & Priscila Catão" },
  { titulo: "É Assim que Começa", autor: "Colleen Hoover & Priscila Catão" },
  { titulo: "O homem mais rico da Babilônia", autor: "George S. Clason & Luiz Cavalcanti de M. Guerra" },
  { titulo: "Tudo é rio", autor: "Carla Madeira" },
  { titulo: "A psicologia financeira: lições atemporais sobre fortuna, ganância e felicidade", autor: "Morgan Housel, Roberta Clapp & outros" },
  { titulo: "Verity", autor: "Colleen Hoover & Thaís Britto" },
  { titulo: "Perigoso!", autor: "Tim Warnes" },
  { titulo: "Como fazer amigos e influenciar pessoas", autor: "Dale Carnegie & Livia de Almeida" }
];

async function preencherLivrosGoogleBooks() {
  const containers = document.querySelectorAll("#todasAsImagens .imgContainer");

  for (let i = 0; i < livrosMaisVendidos2024.length && i < containers.length; i++) {
    const { titulo, autor } = livrosMaisVendidos2024[i];
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

        container.querySelector("img.img2024").src = imagem;
        container.querySelector("img.img2024").alt = `Capa do livro ${tituloAPI}`;
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
