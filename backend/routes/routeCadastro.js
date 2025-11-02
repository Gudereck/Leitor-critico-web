const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alertas.leitorcritico@gmail.com", // O e-mail que VAI ENVIAR
    pass: "skwt vfmg xssu kvpd", // A Senha de App gerada
  },
});

// Função Auxiliar para enviar o e-mail
// (O link precisa ser o seu domínio real ou http://localhost:PORTA para testes)
async function notificarAdminNovoUsuario(usuarioId, nome, email) {
  const adminEmail = "leitorcriticotcc@gmail.com"; // E-mail do Admin
  const seuDominio = "http://localhost:3000"; // Mudar para o endereço do site (https://seusite.com)

  // Este é o link que o admin vai clicar
  const linkPromocao = `${seuDominio}/api/admin/promover-critico/${usuarioId}`;

  const mailOptions = {
    from: '"Sistema de Cadastro" <o-email-da-sua-conta@gmail.com>',
    to: adminEmail,
    subject: "Novo Usuário Cadastrado - Ação Necessária",
    html: `
            <h1>Novo Usuário Cadastrado</h1>
            <p>Um novo usuário (<b>${nome}</b> / <b>${email}</b>) se cadastrou.</p>
            <p>ID do Usuário: ${usuarioId}</p>
            <p>Por padrão, ele é um 'usuarioComum'. Se desejar promovê-lo para 'Critico', clique no link abaixo:</p>
            <br>
            <a href="${linkPromocao}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Tornar Usuário (ID: ${usuarioId}) um Crítico
            </a>
            <br>
            <p><small>Se o botão não funcionar, copie e cole este link: ${linkPromocao}</small></p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de notificação para ${adminEmail} enviado com sucesso.`);
  } catch (error) {
    // Importante: Se o e-mail falhar, o cadastro não deve falhar.
    // Apenas registramos o erro no console.
    console.error("Falha ao enviar e-mail de notificação:", error);
  }
}

// Rota de cadastro
router.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ msg: "Preencha todos os campos!" });
  }

  // Obter uma conexão do pool
  let connection;
  try {
    connection = await pool.getConnection();

    // Verificar se o email já existe
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ msg: "Email já cadastrado!" });
    }

    // Criptografar (hash) a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Inserir o novo usuário no banco de dados (com usuario padrão definido como usuarioComum)
    const [result] = await connection.execute(
      "INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, "usuarioComum"]
    );

    const novoUsuarioId = result.insertId;
    console.log("Usuário cadastrado com ID:", novoUsuarioId);

    notificarAdminNovoUsuario(novoUsuarioId, nome, email);

    return res.status(201).json({
      msg: "Cadastro realizado com sucesso!",
      usuarioId: novoUsuarioId,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ msg: "Erro no servidor." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
