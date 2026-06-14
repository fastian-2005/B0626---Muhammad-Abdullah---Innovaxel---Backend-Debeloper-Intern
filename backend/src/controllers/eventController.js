const db = require('../db/database')

const createEvent = async(req,res) => {
    const {event_name,total_seats,event_date} = req.body
    if(!event_name)
    {
        return res.status(400).json({message:'Event name not entered'})
    }
    else if (total_seats !== 0 && !total_seats)
    {
        return res.status(400).json({message:'Total seats not entered'})
    }
    else if(!event_date)
    {
        return res.status(400).json({message:'Event_date not entered'})

    }
    new_seats = Number(total_seats)
    if(!Number.isInteger(new_seats))
        return res.status(400).json({message:'Total seats should be an integer'})
    if (new_seats <= 0)
    {
        return res.status(400).json({message:'Total seats must be greater than 0'})
    }
    const dateObj = new Date(event_date)
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' })
    }

    current_date = new Date().toISOString().split('T')[0]
    if (event_date <= current_date)
    {
        return res.status(400).json({message:'Date must be in future'})
    }
    db.run(`INSERT INTO events(event_name,total_seats,event_date) VALUES(?,?,?)`, [event_name,new_seats,event_date], async function(err) {
        if (err)
        {
            if (err.code === 'SQLITE_CONSTRAINT')
            {
                return res.status(400).json({message: 'Event with this name already exist'})
            }
            return res.status(500).json({message:'Database Error'})
        }
        return res.status(200).json({message: 'Event created successfully', id:this.lastID})
    })
}




const getEvents = async(req,res) => {
    let {upcoming} = req.query
    let {sort} = req.query
    currentDate = new Date()
    if(upcoming !== 'true' && upcoming !== 'false')
        upcoming = 'false'
    if(sort !== 'ascending' && sort !== 'descending')
        sort = 'ascending'
    if(sort === 'ascending')
    {
        if(upcoming === 'true')
        {
        db.all(`SELECT events.id,events.event_name,events.total_seats,events.event_date,
        total_seats - COUNT(registrations.id) as available_seats,COUNT(registrations.id) as total_registrations 
        FROM events LEFT JOIN registrations ON events.id = registrations.event_id 
        WHERE events.event_date > date('now')
        GROUP BY events.id
        ORDER BY events.event_date ASC`, function(err,rows) {
            if(err)
                return res.status(500).json({message:'Database Error'})
            return res.status(200).json({body: rows})

    })
        }
        else
        {
        db.all(`SELECT events.id,events.event_name,events.total_seats,events.event_date,
        total_seats - COUNT(registrations.id) as available_seats,COUNT(registrations.id) as total_registrations 
        FROM events LEFT JOIN registrations ON events.id = registrations.event_id 
        GROUP BY events.id
        ORDER BY events.event_date ASC` , function(err,rows) {
            if(err)
                return res.status(500).json({message:'Database Error'})
            return res.status(200).json({body: rows})

    })
        }   
    }
    else if(sort === 'descending')
    {
        if(upcoming === 'true')
        {
       db.all(`SELECT events.id,events.event_name,events.total_seats,events.event_date,
        total_seats - COUNT(registrations.id) as available_seats,COUNT(registrations.id) as total_registrations 
        FROM events LEFT JOIN registrations ON events.id = registrations.event_id 
        WHERE events.event_date > date('now') 
        GROUP BY events.id
        ORDER BY events.event_date DESC` , function(err,rows) {
            if(err)
                return res.status(500).json({message:'Database Error'})
            return res.status(200).json({body: rows})

    })
       }
       else
       {
        db.all(`SELECT events.id,events.event_name,events.total_seats,events.event_date,
        total_seats - COUNT(registrations.id) as available_seats,COUNT(registrations.id) as total_registrations 
        FROM events LEFT JOIN registrations ON events.id = registrations.event_id 
        GROUP BY events.id
        ORDER BY events.event_date DESC` , function(err,rows) {
            if(err)
                return res.status(500).json({message:'Database Error'})
            return res.status(200).json({body: rows})

    })
       }
    }
}

module.exports = {createEvent,getEvents}