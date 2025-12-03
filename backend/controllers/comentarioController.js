module.exports = {
    async criarComentario(req, res) {
        try {
            const { id_usuario, id_livro, comentario } = req.body;

            // Validação mínima
            if (!id_usuario || !id_livro || !comentario) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos." });
            }

            const sql = `
                INSERT INTO comentarios (id_usuario, id_livro, comentario)
                VALUES (?, ?, ?)
            `;

            const valores = [id_usuario, id_livro, comentario];

            db.query(sql, valores, (erro, resultado) => {
                if (erro) {
                    console.error("Erro ao inserir comentário:", erro);
                    return res.status(500).json({ erro: "Erro interno ao registrar comentário." });
                }

                return res.status(201).json({
                    mensagem: "Comentário registrado com sucesso.",
                    id_comentario: resultado.insertId
                });
            });

        } catch (e) {
            console.error(e);
            return res.status(500).json({ erro: "Erro inesperado." });
        }
    }
};