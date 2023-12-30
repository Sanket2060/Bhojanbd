import { asyncHandler } from "../utils/AsyncHandler.js";

const registerUser=asyncHandler(async(req,res)=>{   //asyncHandler le pathako function lai try..catch ra async.. await dinxa so code ma feri feri lekhnu pardaina
    res.status(200).json({  //res has these properties in it so we can use it
        message:'chai aur code'
    })
})

export  {registerUser}