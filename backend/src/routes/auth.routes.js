const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth.controller');

router.post('/', authController.authenticate);

module.exports = router;

