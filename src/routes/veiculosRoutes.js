const express = require('express');
const router = express.Router();
const veiculosController = require('../controllers/veiculosController');

router.get('/', veiculosController.listar);
router.get('/:id', veiculosController.buscarPorId);
router.post('/', veiculosController.criar);
router.put('/:id', veiculosController.atualizar);
router.patch('/:id', veiculosController.atualizarParcial);
router.delete('/:id', veiculosController.deletar);
router.get('/estatisticas/nao-vendidos', veiculosController.contarNaoVendidos);
router.get('/estatisticas/por-decada', veiculosController.distribuicaoPorDecada);
router.get('/estatisticas/por-marca', veiculosController.distribuicaoPorMarca);
router.get('/registrados/semana', veiculosController.cadastradosUltimaSemana);

module.exports = router;