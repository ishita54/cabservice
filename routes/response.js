/**
 * @function<b>to display success message</b>
 * @param {Object} res 
 * @param {integer} status 
 * @param {string} message 
 * @param {Object} data 
 */
const successResponse=(res,status,message,data)=>
{
    res.status(status).json({
        status,
        message,
        data
    })
    
}

/**
 * @function<b>to display error message</b>
 * @param {Object} res 
 * @param {integer} status 
 * @param {String} error 
 */
const errorResponse=(res,status,error)=>
{
    res.status(status).json({
        status:status,
        error:error
    })

}

module.exports={successResponse,errorResponse}