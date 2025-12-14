// fixAutoresEspeciais.js
const pool = require("./database/db");

async function fixAutoresEspeciais() {
  const conn = await pool.getConnection();

  async function setAutorUnico(idLivro, nomeAutor) {
    const [autorResult] = await conn.query(
      `INSERT INTO autores (nome)
       VALUES (?)
       ON DUPLICATE KEY UPDATE id_autor = LAST_INSERT_ID(id_autor)`,
      [nomeAutor]
    );
    const idAutor = autorResult.insertId;

    await conn.query(
      `DELETE FROM livros_autores WHERE id_livro = ?`,
      [idLivro]
    );

    await conn.query(
      `INSERT IGNORE INTO livros_autores (id_livro, id_autor)
       VALUES (?, ?)`,
      [idLivro, idAutor]
    );

    console.log(`Livro ${idLivro} agora tem autor único: ${nomeAutor}`);
  }

  await setAutorUnico(13, "Vários Autores");
  await setAutorUnico(15, "Miguel de Cervantes");
  await setAutorUnico(16, "J. R. R. Tolkien");
  await setAutorUnico(18, "C. S. Lewis");
  await setAutorUnico(22, "Stephenie Meyer");
  await setAutorUnico(23, "Suzanne Collins");
  await setAutorUnico(25, "Anne Frank");
  await setAutorUnico(26, "William P. Young");
  await setAutorUnico(29, "Noah Gordon");
  await setAutorUnico(30, "Thiago Nigro");
  await setAutorUnico(32, "Thomas Harris");
  await setAutorUnico(40, "Mário de Andrade");
  await setAutorUnico(41, "Clarice Lispector");
  await setAutorUnico(42, "Graciliano Ramos");
  await setAutorUnico(43, "Graciliano Ramos");
  await setAutorUnico(48, "Augusto dos Anjos");
  await setAutorUnico(52, "Érico Veríssimo");
  await setAutorUnico(54, "Lima Barreto");
  await setAutorUnico(60, "Monteiro Lobato");
  await setAutorUnico(62, "Raul Pompeia");
  await setAutorUnico(64, "Padre Antônio Vieira");
  await setAutorUnico(88, "Junior Rostirola");
  await setAutorUnico(90, "Colleen Hoover");
  await setAutorUnico(91, "Colleen Hoover");
  await setAutorUnico(94, "Morgan Housel");
  await setAutorUnico(95, "Colleen Hoover");
  await setAutorUnico(96, "Andy Riley");
  await setAutorUnico(98, "James Clear");
  await setAutorUnico(101, "David Goggins");
  await setAutorUnico(102, "Forte");
  await setAutorUnico(103, "Freida McFadden");
  await setAutorUnico(104, "Antoine de Saint-Exupéry");
  await setAutorUnico(107, "Napoleon Hill");
  await setAutorUnico(109, "Greg McKeown");

  await conn.release();
  process.exit(0);
}

fixAutoresEspeciais().catch((err) => {
  console.error(err);
  process.exit(1);
});
