const Job = require('../models/Job');
const {StatusCodes} = require("http-status-codes");
const {NotFoundError,BadRequestError} = require('../errors');

const createJob = async(req,res)=>{
  req.body.createdBy = req.user.userid
  const job = await Job.create({...req.body});
  res.status(StatusCodes.CREATED).json({job})
}

const getAllJobs = async(req,res)=>{
  const jobs = await Job.find({});
  res.status(StatusCodes.OK).json({jobs})
}

const getJob = async(req,res)=>{
  // res.send('Single Job')
  const {params:{id:jobId} , user:{userid : userId}} = req;
  const job = await Job.findOne({
    _id:jobId,
    createdBy: userId
  });
  if(!job){
    throw new NotFoundError('Job doesnot exist');
  }
  res.status(StatusCodes.OK).json({job});
}

const updateJob = async(req,res)=>{
  // res.send('Job updated')
  const data = req.body;
  const {body: { company, position }, params:{id:jobId} , user:{userid : userId}} = req;

  if(!company || !position){
    throw new BadRequestError('Company or Position fields cannot be empty')
  }

  const job = await Job.findOneAndUpdate({
      _id:jobId,
      createdBy: userId
    },data,{
      runValidators: true,
      new: true,
  });
  if(!job){
    throw new NotFoundError(`No job found with id:${jobId}`);
  }
  res.status(StatusCodes.OK).json({job});

}

const deleteJob = async (req,res)=>{
  // res.send('Job deleted')
  const {params:{id:jobId} , user:{userid : userId}} = req;
  const job = await Job.findOneAndDelete({
    _id:jobId,
    createdBy: userId
  });
  if(!job){
    throw new NotFoundError('Job doesnot exist');
  }
  res.status(StatusCodes.OK).json({job});
}

module.exports = { createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob};