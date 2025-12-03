const express = require('express');
const router = express.Router();
const criticasController = require('../controllers/criticasController');
const auth = require('../middleware/auth');

router.post('/criticas', auth, criticasController.criarCritica);
router.put('/criticas/:id', auth, criticasController.atualizarCritica);
router.delete('/criticas/:id', auth, criticasController.deletarCritica);
router.get('/criticas/livro/:id_livro', criticasController.obterCriticasPorLivro);

module.exports = router;
