const express = require('express');
const myController = require('../controllers')
const router = express.Router();

router.get('/', myController.awesomeFunction)
router.use('/users', require('./users'))
router.use('/', require('./swagger'));

module.exports = router;