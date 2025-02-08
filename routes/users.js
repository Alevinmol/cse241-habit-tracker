const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/users');

router.get('/', contactsController.getAll);

router.post('/', contactsController.createUser);

router.put('/:id');

router.delete('/:id');

module.exports = router;