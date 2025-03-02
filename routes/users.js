const express = require('express');
const router = express.Router();
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const passport = require("../middleware/auth").passport; 


const contactsController = require('../controllers/users');

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/", requireAuth, contactsController.getAll);

router.post('/', requireAuth, 
    contactsController.createUser);

router.put('/:id', requireAuth, contactsController.updateUser);

router.delete('/:id', requireAuth, contactsController.deleteUser);

module.exports = router;