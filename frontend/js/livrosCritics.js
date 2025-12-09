// document.addEventListener("DOMContentLoaded", () => {
//   const usuario = window.USUARIO || null;
//   const idLivro = window.LIVRO_ID;

//   if (!idLivro) return alert("ID do livro não informado.");

//   // Formulário só para críticos
//   const form = document.getElementById("formCritico");
//   if (usuario && usuario.cargo === "critico") {
//     form.style.display = "block";
//   }

//   carregarCriticas(idLivro);
//   carregarMedia(idLivro);
// async function carregarMedia(id) {
//     const res = await fetch(`/api/criticas/media/${id}`);
//     const data = await res.json();

//     const mediaElemento = document.querySelector(".media-avaliacao");

//     if (!data.media) {
//         mediaElemento.innerText = "NR";
//         return;
//     }

//     const media = parseFloat(data.media).toFixed(1);
//     mediaElemento.innerText = media;

//     // Cores automáticas
//     if (media >= 70) mediaElemento.style.color = "limegreen";
//     else if (media >= 50) mediaElemento.style.color = "gold";
//     else mediaElemento.style.color = "red";
// }

//   // Enviar crítica
// document
//   .getElementById("criticaForm")
//   .addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const texto = document.getElementById("texto").value.trim();
//     const nota = document.getElementById("nota").value;
//     const link = document.getElementById("link").value.trim();

//     const res = await fetch("/api/criticas", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         id_livro: idLivro,
//         texto,
//         nota,
//         link_resenha: link,
//       }),
//     });

//     const response = await res.json();

//     if (response.success) {
//       alert("Crítica enviada!");
//       window.location.href = `/livros?id=${idLivro}`;
//     } else {
//       alert("Erro ao salvar: " + (response.message || response.erro || "Erro desconhecido"));
//     }
//   });


// async function carregarCriticas(id) {
//   const res = await fetch(`/api/criticas/${id}`);
//   const criticas = await res.json();
//   const container = document.getElementById("criticasContainer");
//   container.innerHTML = "";

//   if (!criticas.length) return (container.innerHTML = "Nenhuma crítica ainda.");

//   // 🔥 AQUI É A VERSÃO FINAL — SOMENTE ESSA
//   criticas.forEach((c) => {
//     container.innerHTML += `
//         <div class="critica-box">
        
//             <div class="avaliacao-nota ${
//               c.nota >= 70 ? "verde" : c.nota >= 50 ? "amarelo" : "vermelho"
//             }">
//                 ${c.nota}
//             </div>

//             <div class="critica-info">
//                 <div class="critico-nome">
//                     <span class="usuario">${c.usuario}</span>
//                     ${
//                       c.cargo === "critico"
//                         ? `<span class="estrela">⭐</span>`
//                         : ""
//                     }
//                 </div>

//                 <p class="texto">${c.texto}</p>

//                 ${
//                   c.link_resenha
//                     ? `
//                     <a href="${c.link_resenha}" target="_blank" class="link-review">Ver resenha completa →</a>
//                 `
//                     : ""
//                 }

//                 <span class="data">${new Date(c.data_critica).toLocaleString(
//                   "pt-BR"
//                 )}</span>
//             </div>
//         </div>
//         `;
//   });
// }


document.addEventListener("DOMContentLoaded", () => {
  const usuario = window.USUARIO || null;
  const idLivro = window.LIVRO_ID;

  console.log("LIVRO_ID no front:", idLivro);

  if (idLivro === undefined || idLivro === null || idLivro === "") {
    alert("ID do livro não informado.");
    return;
  }

  // Formulário só para críticos
  const form = document.getElementById("formCritico");
  if (usuario && usuario.cargo === "critico") {
    form.style.display = "block";
  }

  carregarCriticas(idLivro);
  carregarMedia(idLivro);

  async function carregarMedia(id) {
    const res = await fetch(`/api/criticas/media/${id}`);
    const data = await res.json();

    const mediaElemento = document.querySelector(".media-avaliacao");

    if (!data.media) {
      mediaElemento.innerText = "NR";
      return;
    }

    const media = parseFloat(data.media).toFixed(1);
    mediaElemento.innerText = media;

    if (media >= 70) mediaElemento.style.color = "limegreen";
    else if (media >= 50) mediaElemento.style.color = "gold";
    else mediaElemento.style.color = "red";
  }

  // Enviar crítica
  document
    .getElementById("criticaForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const texto = document.getElementById("texto").value.trim();
      const nota = document.getElementById("nota").value;
      const link = document.getElementById("link").value.trim();

      const res = await fetch("/api/criticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_livro: idLivro,
          texto,
          nota,
          link_resenha: link,
        }),
      });

      // const response = await res.json();

      // if (response.success) {
      //   alert("Crítica enviada!");
      //   window.location.href = `/livros?id=${idLivro}`;
      // } else {
      //   alert(
      //     "Erro ao salvar: " +
      //       (response.message || response.erro || "Erro desconhecido")
      //   );
      // }

      const response = await res.json();

if (response.success) {
  alert("Crítica enviada!");
  window.location.href = `/livros?id=${idLivro}`;
}else{
  alert("Critica enviada!!");
}

    });

  async function carregarCriticas(id) {
    const res = await fetch(`/api/criticas/${id}`);
    const criticas = await res.json();
    const container = document.getElementById("criticasContainer");
    container.innerHTML = "";

    if (!criticas.length)
      return (container.innerHTML = "Nenhuma crítica ainda.");

    criticas.forEach((c) => {
      container.innerHTML += `
        <div class="critica-box">
          <div class="avaliacao-nota ${
            c.nota >= 70 ? "verde" : c.nota >= 50 ? "amarelo" : "vermelho"
          }">
            ${c.nota}
          </div>
          <div class="critica-info">
            <div class="critico-nome">
              <span class="usuario">${c.usuario}</span>
              ${
                c.cargo === "critico"
                  ? `<span class="estrela">⭐</span>`
                  : ""
              }
            </div>
            <p class="texto">${c.texto}</p>
            ${
              c.link_resenha
                ? `<a href="${c.link_resenha}" target="_blank" class="link-review">Ver resenha completa →</a>`
                : ""
            }
            <span class="data">${new Date(
              c.data_critica
            ).toLocaleString("pt-BR")}</span>
          </div>
        </div>
      `;
    });
  }
});
