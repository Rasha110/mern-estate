import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
export const test=(req,res)=>{
   res.json({
      message:'Hello !'
    }
)};


export const updateUser=async(req,res,next)=>{
if (req.user.id!==req.params.id) 
    return next (errorHandler(401,'You can only update your account'));
try{
    if(req.body.password){
        req.body.password=bcryptjs.hashSync(req.body.password,10)
    }
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            _id: user._id, 
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar
        }
    },{new:true})
    const {password,...rest}=updatedUser._doc
    res.status(200).json(rest)
}
catch(err){
    next (err)
    res.status(500).json({ message: error.message });
}
}
