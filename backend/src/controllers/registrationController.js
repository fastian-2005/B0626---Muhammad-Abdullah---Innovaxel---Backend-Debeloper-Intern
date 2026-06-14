const db = require('../db/database')



const wrapper = (sql,parameter) => {
    return new Promise((resolve,reject) => {
        db.run(sql,parameter,function(err) {
            if(err)
                return reject(err)
            else
                return resolve(this.lastID)
        })

    })
}

const registerUser = async(req,res) => {
    const {event_id,idempotency_key} = req.body
    const user_id = req.user.id
    if (!event_id)
    {
        return res.status(400).json({message: 'Event Id not entered'})
    }
    const nevent_id=Number(event_id)
    if(nevent_id < 1)
    {
        return res.status(400).json({message: 'Invalid event id'})   
    }
    if(!idempotency_key)
    {
        return res.status(400).json({message: 'Impotency key not given'})
    }
    db.get(`SELECT total_seats - COUNT(registrations.id) AS count FROM events LEFT JOIN registrations ON events.id = registrations.event_id WHERE events.id = ? GROUP BY events.id`,[nevent_id],async function(err,row){
        if(err)
        {
            return res.status(500).json({message: 'Database error'})
        }
        if (!row)
        {
            return res.status(400).json({message: 'Event Id not present'})
        }
        if(row.count > 0)
        {
            try{
            await wrapper('BEGIN IMMEDIATE')
            await wrapper('INSERT INTO registrations(event_id,user_id,idempotency_key) VALUES(?,?,?)',[nevent_id,user_id,idempotency_key])
            await wrapper('COMMIT')
            return res.status(201).json({message:'User registered for event'})
            }
            catch(err)
            {
                await wrapper('ROLLBACK')
                if(err.code == 'SQLITE_CONSTRAINT')
                {
                    return res.status(400).json({message: 'Duplicate request'})
                }
                return res.status(500).json({message: 'Database error'})
            }
        } 
        else
        {
            return res.status(400).json({message: 'Event is full'})
        }
})
}

const cancelRegistration= async(req,res) =>{
    let {event_id} = req.params
    const user_id = req.user.id
    if(!event_id)
    {
        return res.status(400).json({message: 'event_id not present'})
    }
    event_id = Number(event_id)
    if(event_id < 1)
    {
        return res.status(400).json({message: 'event_id invalid'})
    }
    db.run(`DELETE FROM registrations WHERE event_id = ? and user_id = ?`,[event_id,user_id], async function(err){
        if(err)
        {
            return res.status(500).json({message: 'Database error'})
        }
        if(this.changes === 0)
        {
            return res.status(400).json({message: 'Not registered'})
        }
        return res.status(200).json({message: 'Registration deleted'})
})

}


module.exports = {registerUser,cancelRegistration}