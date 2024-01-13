import mongoose, { Schema } from "mongoose";
import  jwt  from "jsonwebtoken";  //???
import bcrypt from "bcrypt"
const donorSchema=new Schema({
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
    name:{
        type:String,
        trim:true,
        index:true
    },
    avatar:{
        type:String,  //cloudnary(alternative to AWS) url to be used
    },
    // coverImage:{
    //     type:String,  //cloudnary(alternative to AWS) url to be used
    // },
    // watchHistory:[
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:'Video'

    //     }
    // ],
    password:{
        type:String,
        required:[true,'Password is required']  //custom error message for true fields
    },
    refreshToken:{
        type:String
    },
    address:{
        type:String,
        trim:true,
    },
    contact:{
        type:Number,
        trim:true,
    },
    isCatering:{
        type:Boolean,
        default:true
    },
    timesDonated:{
        type:Number,
        default:0
    },
    order:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Order"
            },
        ],
    OTP:Number,
    numberOfPeopleFeed:{
        type:Number,
        default:0
    }
    


},{timestamps:true})

donorSchema.pre("save",async function(next){      //arrow function can't be used.Why?? arrow function can't access schema(by this)
    if (!this.isModified("password")) return next(); //???this.isModified is method of?????
    this.password=await bcrypt.hash(this.password,10);    //pre runs before data is set and this.password must be empty??
    console.log("Encrypted password:",this.password);
    next();                                                //hash rounds-10    //next as parameter for middleware
    //??bcrypt also should be awaited??
})

donorSchema.methods.isPasswordCorrect = async function(password){  //custom methods to schema
        // console.log("isPasswordCorrect parameter:",password);
        // console.log("this.password at isPasswordCorrect ",this.password);
        return  await  bcrypt.compare(password,this.password);  //this

}
donorSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,   //payload or data

            email:this.email,
            username:this.username,
            name:this.name

        },
        process.env.ACCESS_TOKEN_SECRET,  //secret
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY  //expiry
        }

    )

}

donorSchema.methods.generateRefreshToken=function(){
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
export const Donor=mongoose.model("Donor",donorSchema);