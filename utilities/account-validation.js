const {body, validationResult} = require("express-validator")
const validate = {}

validate.registrationRules = () => {
    return [
        body("name")
            .trim()
            .isString()
            .isLength({ min:1 })
            .withMessage("Please provide a name."),
        
        body("email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("please enter a valid email.")    
    ]
}

module.exports = validate