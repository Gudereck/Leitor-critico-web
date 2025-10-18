const livros = [
  { titulo: "Memórias póstumas de Brás Cubas", autor: "Machado de Assis" },
  { titulo: "O Diário de Um Banana - Dias de Cão", autor: "Jeff Kinney" },
  { titulo: "Dom Casmurro", autor: "Machado de Assis" },
  { titulo: "A Menina que Roubava Livros", autor: "Markus Zusak" },
  { titulo: "1984", autor: "George Orwell" },
  { titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry" },
  { titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling" },
  { titulo: "A Revolução dos Bichos", autor: "George Orwell" },
  { titulo: "O Alquimista", autor: "Paulo Coelho" },
  { titulo: "Capitães da Areia", autor: "Jorge Amado" },
  { titulo: "O Programador Pragmático: De Aprendiz a Mestre", autor: "Aldir José Coelho Corrêa da Silva" },
  { titulo: "Entendendo Algoritmos", autor: "Aditya Y. Bhargava" }
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

      if (data.items && data.items.length > 0) {
        const info = data.items[0].volumeInfo;
        const imagem = info.imageLinks?.thumbnail || "";
        const tituloAPI = info.title || titulo;
        const autorAPI = (info.authors && info.authors[0]) || autor;

        // Atualiza os elementos como antes
        container.querySelector("img.imgLivros").src = imagem;
        container.querySelector("img.imgLivros").alt = `Capa do livro ${tituloAPI}`;
        container.querySelector(".h1Livros").textContent = tituloAPI;
        container.querySelector(".nomeAutor").textContent = autorAPI;

        // **Modificação: Define o href para /livros com parâmetros**
        const links = container.querySelectorAll('a');
        links.forEach(link => {
          link.href = `/livros?titulo=${encodeURIComponent(tituloAPI)}&autor=${encodeURIComponent(autorAPI)}`;
        });
      }
      const links2 = container.querySelectorAll('a');
        links2.forEach(link => {
          link.href = `/criticsreviews?titulo=${encodeURIComponent(tituloAPI)}&autor=${encodeURIComponent(autorAPI)}`;
        });
    } catch (err) {
      console.error(`Erro ao buscar "${titulo}" de ${autor}:`, err);
    }
  }
}

document.addEventListener("DOMContentLoaded", preencherLivrosGoogleBooks);