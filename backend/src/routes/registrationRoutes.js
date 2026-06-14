const express = require('express')
const router = express.Router()
const registerController = require('../controllers/registrationController')
const authenticate = require('../middleware/authMiddleware')

router.post('/registration',authenticate,registerController.registerUser)
router.delete('/registration/:event_id',authenticate,registerController.cancelRegistration)
router.get('/registration/my_events',authenticate,registerController.getRegisteredEvents)

module.exports = router