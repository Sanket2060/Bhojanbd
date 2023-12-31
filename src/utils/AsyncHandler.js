// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status( 500).json({
            success: false,
            message: error.message
        })
    }
}


export {asyncHandler}


// const asyncHandler = (requestHandler) => {   //alternative way to upper function but not crystal clear
//    return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }





