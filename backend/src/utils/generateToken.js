const token = require('jsonwebtoken')

const generate = (userId,email) => {
    const jwt = token.sign({id: userId, email: email}, process.env.JWT_SECRET, {expiresIn:'7d'})
    return jwt
}

module.exports = generate