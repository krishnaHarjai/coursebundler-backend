import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorHandler.js"
import {User} from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEMail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {Course} from "../models/Course.js"
export const register = catchAsyncError(async (req,res,next)=>{

    const {name,email,password,role} = req.body;

    if(!name || !email || !password) return next(new ErrorHandler("Please Enter all fields",400));

    let user = await User.findOne({email});

    if (user) return next(new ErrorHandler("User Already Exist", 409)); 

    // upload file on cloudnary
    user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"tempid",
            url:"tempurl",
        }
    })
    sendToken(res,user,"Registered Successfully");
})

export const login = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter all field", 400));
    }
    const user = await User.findOne({email}).select("+password");

    if(!user) return next(ErrorHandler("User Doesn't exist", 401));


    const isMatch = await user.comparePassword(password);

    if(!isMatch) return next(new ErrorHandler("Incorrect Email or Password",401));

    sendToken(res,user,`Welcome back, ${user.name}`,201);
})

export const logout = catchAsyncError( async (req,res,next) =>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
        sameSite:true,
    }).json({
        success:true,
        message:"Logged Out Successfully",
    })
} )

// get my profile
export const getMyProfile = catchAsyncError( async (req,res,next) =>{

    const user = await User.findById(req.user._id).select("+password");

    res.status(200).json({
        success:true,
        user,
    })
} )

export const changePassword = catchAsyncError( async (req,res,next) =>{

    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please enter all field", 400));
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if(!isMatch){
        return next(new ErrorHandler("Incorrect old password", 400));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success:true,
        message:"Password changes successfully",
    })
} )

export const updateProfile = catchAsyncError( async (req,res,next) =>{

    const {name,email} = req.body;

    const user = await User.findById(req.user._id);

    if(name) user.name = name;
    if(email) user.email = email;

    await user.save();

    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
    })
} )

 export const updateProfilePicture = catchAsyncError( async (req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
    })
})

 export const forgetPassword = catchAsyncError( async (req,res,next)=>{

    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) return next(new ErrorHandler("User Not Found",400));

    const resetToken = await user.getResetToken();
     await user.save({validateBeforeSave:false});


     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/resetpassword/${resetToken}`;

     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it`;


     try{

        await sendEMail({
            email:user.email,
            subject:" CourseBundler user password recovery",
            message
        });
         
         res.status(200).json({
             success:true,
             message:`Reset Token has been sent to ${user.email}`,
         })

     } catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message, 500))


     }

})

 export const resetPassword = catchAsyncError( async (req,res,next)=>{
    const {token} = req.params;

    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await user.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt:Date.now(),
        },
    })

    if(!user) return next(new ErrorHandler("Reset Password token is invalid or has been expire"))

    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    res.status(200).json({
        success:true,
        message:"Password changed successfully",
    })

})

export const addToPlaylist = catchAsyncError(async (req,res,next)=>{

    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if(!course) return next(new ErrorHandler("Invalid coourse id",404));

    const itemExist = user.playlist.find((item)=>{
        if(item.course.toString()===course._id.toString()) return true;
    })

    user.playlist.push({
        course:course._id,
        poster:course.poster.url,
    })

    await user.save();

    res.status(200).json({
        success:true,
        message:"Added to playlist",
    })
    


})
export const removeFromPlaylist = catchAsyncError(async (req,res,next)=>{

    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.body.id);
    if(!course) return next(new ErrorHandler("Invalid coourse id",404));

    const newPlaylist = user.playlist.filter((item)=>{
        if(item.course.toString() !== course._id.toString() ) return item;
    });

    user.playlist = newPlaylist;


    await user.save();

    res.status(200).json({
        success:true,
        message:"Removed From playlist",
    })
})

