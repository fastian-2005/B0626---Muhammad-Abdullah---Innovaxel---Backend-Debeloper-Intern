const hash = require('../utils/hashPassword')
const generate = require('../utils/generateToken')
const compare = require('../utils/comparePassword')
const db = require('../db/database.js')

const signup = async (req,res) => {
    try {
    const {email,password} = req.body
    if (!email)
    {
        return res.status(400).json({message: 'Email not entered'})
    }
    else if (!password)
    {
        return res.status(400).json({message:'Password not entered'})
    }
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*?]).{8,}$/
    if(!regex.test(password))
        return res.status(400).json({message:'Password  should be minimum 8 characters long and must have one uppercase alphabet one lowercase alphabet one number and one symbol(!@#$%^&*?)'})
    const regex1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!regex1.test(email))
        return res.status(400).json({message:'Invalid email format'})
    const hashedPassword = await hash(password)
    db.run(`INSERT INTO users(email,password) VALUES(?,?)`,[email,hashedPassword],async function(err) {
        if (err)
        {
            if(err.code === 'SQLITE_CONSTRAINT')
            {
                return res.status(400).json({message: 'Email already exists'})
            }
            return res.status(500).json({message:'Database Error'})
        }
        const token = generate(this.lastID,email)

        res.cookie('token',token,{httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
        return res.status(201).json({message:'User created'})
    })
    }
    catch(err)
    {
        return res.status(500).json({message:'Server Error'})
    }

}


const signin = async(req,res) => {
    try{
        const {email,password} = req.body
        //console.log(`Email function called with value ${email}`)
        if(!email)
        {
            return res.status(400).json({message:'Email not entered'})
        }
        else if(!password)
        {
            return res.status(400).json({message:'Password not entered'})
        }
        db.get(`SELECT * from users where email = ?`,[email],async function(err,row) {
            if (err)
            {
                return res.status(500).json({message:'Databse Error'})
            }
            if(!row)
            {
                return res.status(400).json({message:'Invalid credentials'})
            }
            if( await compare(password,row.password) )
            {
                const token = generate(row.id,email)
                res.cookie('token', token,{httpOnly:true, maxAge: 7 * 24 * 60 * 60 * 1000})
                return res.status(200).json({message:'User Logged In'})
            }
            else
            {
                return res.status(400).json({message:'Wrong Credentials'})
            }


        })

    }
    catch(err)
    {
        return res.status(500).json({message:'Server Error'})
    }
}

const me = async(req,res) => {
    return res.status(200).json({body:req.user})
}

module.exports = {signin, signup, me}