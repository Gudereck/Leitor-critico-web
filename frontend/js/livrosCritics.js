document.addEventListener('DOMContentLoaded', () => {
  carregarCriticasServer();
  inicializarForm();
});

function inicializarForm() {
  const form = document.getElementById('criticaForm');
  if (!form) return;

  const texto = document.getElementById('texto');
  const contador = document.getElementById('contador');

  texto.addEventListener('input', () => {
   contador.textContent = `${texto.value.length}/100`;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const corpo = {
      id_livro: window.LIVRO_ID,
      texto: document.getElementById('texto').value.trim(),
      nota: Number(document.getElementById('nota').value),
      link_resenha: document.getElementById('link').value.trim()
    };

    const res = await fetch('/api/criticas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(corpo)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || data.message);
      return;
    }

    form.reset();
    contador.textContent = "0/100";
    carregarCriticasServer();
  });
}

async function carregarCriticasServer() {
  const container = document.getElementById('criticasContainer');
  const mediaElem = document.getElementById('mediaNotas');

  const res = await fetch(`/api/criticas/livro/${window.LIVRO_ID}`, {
    credentials: "include"
  });

  const data = await res.json();

  container.innerHTML = "";

  data.criticas.forEach(c => {
    const div = document.createElement("div");
    div.className = "critica";
    div.innerHTML = `
      <p><strong>${c.nome_usuario}</strong> — Nota: ${c.nota}</p>
      <p>${c.texto}</p>
      ${c.link_resenha ? `<a href="${c.link_resenha}" target="_blank">Ver resenha completa</a>` : ""}
      <small>${new Date(c.data_critica).toLocaleString("pt-BR")}</small>
      <hr>
    `;
    container.appendChild(div);
  });

  if (data.media === null) {
    mediaElem.textContent = "Sem avaliações ainda.";
  } else {
    mediaElem.textContent = `Média das avaliações: ${data.media} (${data.qtd} avaliações)`;
  }
}
