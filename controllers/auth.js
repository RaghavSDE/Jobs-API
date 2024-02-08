const User = require("../models/User")
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors")

const register = async(req,res)=>{
    const user = await User.create({...req.body});
    const Token = await user.createJWT();
    res.status(StatusCodes.CREATED).json({Token});
}

const login = async(req,res)=>{
  const {email,password} = req.body;
  if(!email || !password){
    throw new BadRequestError('Please enter email and password');
  }
  const user = await User.findOne({email});
  if(!user){
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isMatch = await user.comparePassword(password);
  if(!isMatch){
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const token = await user.createJWT();
  res.status(StatusCodes.OK).send({"user":user.name,token});
}

module.exports = {login,register};