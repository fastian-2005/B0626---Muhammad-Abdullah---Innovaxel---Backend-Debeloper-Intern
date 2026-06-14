const express = require('express')
const router = express.Router()
const registerController = require('../controllers/registrationController')
const authenticate = require('../middleware/authMiddleware')

router.post('/registration',authenticate,registerController.registerUser)
router.delete('/registration/:event_id',authenticate,registerController.cancelRegistration)

module.exports = router