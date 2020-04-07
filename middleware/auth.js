const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// middleware for user authentication
const auth=async (req, res,next)=>{
    try {
        // convert 'Bearer <token bla bla bla>' => '<token bla bla bla bla>'
        const token = req.header('Authorization').replace("Bearer ",'')
        const payload=jwt.verify(token, process.env.TOKEN_KEY)

        // user exist in the system?
        const user= await User.findOne({    _id: payload._id,
                                            'tokens.token':token})
        if(!user){throw new Error()}

        //attach user object to the request
        req.user=user
        req.token=token

        next()
    } catch (error) {
        res.status(401).json({error:'Not authorized to access this resource.'})
    }
}

module.exports =auth