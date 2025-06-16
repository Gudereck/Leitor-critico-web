 async function buscarLivros() {
      const termo = document.getElementById('termo').value;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termo)}&maxResults=10&langRestrict=pt&printType=books`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      const container = document.getElementById('resultado');
      container.innerHTML = '';

      if (!dados.items) {
        container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;
        const titulo = info.title || 'Sem título';
        const imagem = info.imageLinks?.thumbnail || '';

        const div = document.createElement('div');
        div.className = 'imglivro';
        div.innerHTML = `
          ${imagem ? `<img src="${imagem}" alt="Capa do livro">` : '<p>Sem imagem</p>'}
          <h3>${titulo}</h3>
        `;

        container.appendChild(div);
      });
    }