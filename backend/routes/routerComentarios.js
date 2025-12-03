const express = require('express');
const router = express.Router();
const comentariosController = require('../controllers/comentarioController');

router.post('/comentarios', comentariosController.criarComentario);

module.exports = router;