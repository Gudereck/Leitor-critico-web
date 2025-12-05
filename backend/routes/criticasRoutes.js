const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// ==================== LISTAR CRÍTICAS DE UM LIVRO ====================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT c.id_critica, c.texto, c.nota, c.data_critica, c.link_resenha,
                   u.nome AS usuario, u.cargo
            FROM criticas c
            JOIN usuarios u ON u.id = c.id_usuario
            WHERE c.id_livro = ?
            ORDER BY c.data_critica DESC
        `, [id]);

        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erro ao carregar críticas" });
    }
});

// Média das notas de um livro
// Média das notas de um livro
router.get("/media/:id", async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query(`
        SELECT AVG(nota) AS media 
        FROM criticas 
        WHERE id_livro = ?
    `, [id]);

    res.json({ media: rows[0].media });
});


// ==================== SALVAR NOVA CRÍTICA ====================
router.post("/", async (req, res) => {

    if (!req.session.user)
        return res.json({ success:false, message:"Faça login para comentar." });

    if (req.session.user.cargo !== "critico")
        return res.json({ success:false, message:"Apenas críticos podem avaliar." });

    const { id_livro, texto, nota, link_resenha } = req.body;

    if (!id_livro || !texto || !nota)
        return res.json({ success:false, message:"Preencha todos os campos." });

    try {
        await pool.query(
            `INSERT INTO criticas (id_usuario, id_livro, texto, nota, link_resenha, data_critica)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [req.session.user.id, id_livro, texto, nota, link_resenha || null]
        );

        const [rows] = await pool.query(`
        SELECT AVG(nota) AS media 
        FROM criticas 
        WHERE id_livro = ?
    `, [id]);

    await pool.query(
            `UPDATE livros SET media_avaliacao = ? WHERE id_livro = ?`,
            [rows[0].media, id_livro]
        );

        res.json({ success:true });
    } catch (err) {
        console.log(err);
        res.json({ success:false, message:"Erro ao salvar no banco." });
    }
});


module.exports = router;
