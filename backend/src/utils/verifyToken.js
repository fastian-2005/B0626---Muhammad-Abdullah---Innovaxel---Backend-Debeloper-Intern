const token = require('jsonwebtoken')

const verify = (jwt) => {
    try{
    return token.verify(jwt,process.env.JWT_SECRET)
    }
    catch(err)
    {
        return null
    }
}

module.exports = verify