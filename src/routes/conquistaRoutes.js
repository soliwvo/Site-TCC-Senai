const express = require('express');
const router = express.Router();
const { cadastrar, listar } = require('../controllers/conquistaController');
const auth = require('../middlewares/auth');
const permitir = require('../middlewares/checkRole');

router.post('/conquistas', auth, permitir('administrador'), cadastrar);
router.get('/conquistas', auth, listar);

module.exports = router;
