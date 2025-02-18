const express = require('express');
const router = express.Router();
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

const contactsController = require('../controllers/users');

router.get('/', contactsController.getAll);

router.post('/', 
    regValidate.registrationRules(),
    utilities.handleErrors(contactsController.createUser));

router.put('/:id', contactsController.updateUser);

router.delete('/:id', contactsController.deleteUser);

module.exports = router;