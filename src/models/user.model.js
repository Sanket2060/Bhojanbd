import mongoose, { Schema } from "mongoose";
import  JsonWebToken  from "jsonwebtoken";  //???
import bcrypt from "bcrypt"
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //makes optimised for searching  username
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,  //cloudnary(alternative to AWS) url to be used
        required:true,



    },
    coverImage:{
        type:String,  //cloudnary(alternative to AWS) url to be used
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Video'

        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']  //custom error message for true fields
    },
    refreshToken:{
        type:String
    }



},{timestamps:true})

userSchema.pre("save",async function(next){      //arrow function can't be used.Why?? arrow function can't access schema(by this)
    if (this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10);    //pre runs before data is set and this.password must be empty??
    next();                                                //hash rounds-10    //next as parameter for middleware
})

userSchema.methods.isPasswordCorrect = async function(password){  //custom methods to schema
       return   await  bcrypt.compare(password,this.password);  //this
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,   //payload or data

            email:this.email,
            username:this.username,
            fullname:this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,  //secret
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY  //expiry
        }

    )

}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,   //payload or data
        },
        process.env.REFRESH_TOKEN_SECRET,  //secret
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY  //expiry
        }

    )

}
//pre and methods are from userSchema itself so they can have access to there data members.
export const User=mongoose.model("User",userSchema);