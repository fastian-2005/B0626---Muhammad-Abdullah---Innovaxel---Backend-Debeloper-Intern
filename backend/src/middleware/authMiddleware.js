const verify = require('../utils/verifyToken')

const authenticate = (req,res,next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message:'Unauthorized access'})
        }
        const decoded = verify(token)
        if (decoded)
        {
            req.user = decoded
            next()
        }
        else{
            res.status(401).json({message: 'Unauthorized access'})
        }
    }
    catch(err)
    {
        res.status(500).json({message:'Server error'})
    }
}

module.exports = authenticate