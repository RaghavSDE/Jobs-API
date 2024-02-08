const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors')

const authMiddleware = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('User Not authenticated');
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userid:payload.userid, name:payload.name};
        console.log('user authenticated');
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = authMiddleware;