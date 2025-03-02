const express = require('express');
const router = express.Router();
const passport = require("../middleware/auth").passport; 


const habitsController = require('../controllers/habits');

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/", requireAuth, habitsController.getAll);

router.post('/', requireAuth, 
    habitsController.createHabit);

router.put('/:id', requireAuth, habitsController.updateHabit);

router.delete('/:id', requireAuth, habitsController.deleteHabit);

module.exports = router;