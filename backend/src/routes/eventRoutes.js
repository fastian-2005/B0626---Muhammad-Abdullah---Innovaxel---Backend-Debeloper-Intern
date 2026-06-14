const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController.js')
const authenticate = require('../middleware/authMiddleware')
router.post('/events',authenticate, eventController.createEvent)
router.get('/events',eventController.getEvents)

module.exports = router