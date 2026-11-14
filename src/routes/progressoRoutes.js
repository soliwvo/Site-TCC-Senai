const express = require('express');
const router = express.Router();
const { concluir, listar } = require('../controllers/progressoController');
const auth = require('../middlewares/auth');

router.post('/progressos', auth, concluir);
router.get('/progressos', auth, listar);

module.exports = router;
