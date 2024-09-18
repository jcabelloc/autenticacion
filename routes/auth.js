const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/ingresar', authController.getIngresar);

router.post('/ingresar', authController.postIngresar);

router.post('/salir', authController.postSalir);

module.exports = router;