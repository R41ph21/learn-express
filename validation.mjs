import { body, param, validationResut } from 'express-validator'

// Validering för användare 
export const validateUser = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50})
        .withMessage('Namnet måste vara 2-50 tecken'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMesssage('Ogoltig e-postadress'),
]

export const validateUserId =[
    param('id')
        .isInt({ min: 1})
        .withMessages('Id måste vara ett positivt heltal')
]

//Middleware för att hantera valideringsfel
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400),json({
            errors: errors.array()
        })
    }
    next()
}