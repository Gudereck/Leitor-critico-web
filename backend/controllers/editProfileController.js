const db = require("../database/db");
const util = require("util");
const bcrypt = require("bcrypt");

const query = util.promisify(db.query).bind(db);

/**
 * Obtém os dados de um perfil (exceto senha)
 */
exports.obterPerfil = async (req, res) => {
  try {
    // Assume que a PK da tabela usuarios é 'id', mas o frontend envia 'id_usuario'
    const id_usuario = Number(req.params.id);

    // Seleciona campos, excluindo a senha
    const sql = `SELECT id AS id_usuario, nome, email, cargo FROM usuarios WHERE id = ?`;
    const resultado = await query(sql, [id_usuario]);

    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // Retorna o primeiro resultado
    res.json(resultado[0]);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({ erro: "Erro ao obter perfil." });
  }
};

/**
 * Atualiza o perfil do usuário (incluindo a possibilidade de atualizar a senha)
 */
exports.editarPerfil = async (req, res) => {
  try {
    const { id_usuario, nome, email, senha } = req.body;

    // 1. Validação
    if (!id_usuario || !nome || !email) {
      return res
        .status(400)
        .json({
          erro: "Campos obrigatórios (ID, Nome, Email) não preenchidos.",
        });
    }

    const campos = [];
    const valores = [];

    campos.push("nome = ?");
    valores.push(nome);
    campos.push("email = ?");
    valores.push(email);

    // 2. Processamento da Senha (SE for enviada)
    if (senha) {
      // Hashing da nova senha
      const hashSenha = await bcrypt.hash(senha, 10);
      campos.push("senha = ?");
      valores.push(hashSenha);
    }

    valores.push(id_usuario);

    // 3. Execução do UPDATE
    const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`; // Usando 'id' como PK
    await query(sql, valores);

    res.json({ mensagem: "Perfil atualizado com sucesso." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ erro: "O email fornecido já está em uso por outro usuário." });
    }
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ erro: "Erro ao atualizar perfil." });
  }
};

/**
 * Deleta o perfil do usuário
 */
exports.deletarConta = async (req, res) => {
  try {
    const id_usuario = Number(req.params.id);

    if (!id_usuario) {
      return res
        .status(400)
        .json({ erro: "ID do usuário não fornecido para exclusão." });
    }

    const sql = `DELETE FROM usuarios WHERE id = ?`;
    const resultado = await query(sql, [id_usuario]);

    if (resultado.affectedRows === 0) {
      return res
        .status(404)
        .json({ erro: "Usuário não encontrado para exclusão." });
    }

    res.json({ mensagem: "Conta excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    res.status(500).json({ erro: "Erro interno ao deletar conta." });
  }
};
