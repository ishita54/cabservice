const successResponse=(res,status,message,data)=>
{
    res.status(status).json({
        status:status,
        message:message,
        data:data
    })
    
}
const errorResponse=(res,status,error)=>
{
    res.status(status).json({
        status:status,
        error:error
    })

}

module.exports={successResponse,errorResponse}