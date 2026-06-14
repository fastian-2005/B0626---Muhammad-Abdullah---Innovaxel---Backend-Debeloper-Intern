const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authenticate = require('../middleware/authMiddleware')

router.post('/signin',authController.signin)

router.post('/signup', authController.signup)

router.get('/me',authenticate,authController.me)


module.exports = router