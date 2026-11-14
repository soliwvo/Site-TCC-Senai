const express = require('express');
const router = express.Router();
const { cadastrar, perfil } = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

router.post('/usuarios', cadastrar);
router.get('/usuarios/perfil', auth, perfil);

module.exports = router;
