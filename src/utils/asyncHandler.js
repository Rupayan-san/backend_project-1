//asyncHandler is used in Express.js to handle errors in async routes so that we dont have to write try catch multiple times.
const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((err) => next(err))
    }
}


//same thing with a different approach
// const asyncHandler = (func) => async() => {
//     try {
//         await func(req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }



export {asyncHandler}