const response=require('../../routes/response');
const validate=require('../../validator/joi-validate')
const Joi=require('joi');

/**
 * @param {first_name,last_name,phone,latitude,password,confirm_password,longitude} req
 * @param {signup}next 
 */
const validateCustomer=(req,res,next)=>
{
    let user=
    {
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        phone:req.body.phone,
        latitude:req.body.latitude,
        password:req.body.password,
        confirm_password:req.body.confirm_password,
        longitude:req.body.longitude
    }
    const schema=
    {
        first_name:Joi.string().min(3).max(15).required(),
        last_name:Joi.string().min(3).max(15).required(),
        phone:Joi.number().required(),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        confirm_password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        latitude:Joi.number().min(-90).max(90).required(),
        longitude:Joi.number().min(-180).max(180).required()
    }
    if(user.password===user.confirm_password)
    {
        user.password=req.body.password
        let valid=validate.joi_validate(res,user,schema)
        if(valid){

          
            req.user=user
            next();

        }
    }
    else
    {
        response.errorResponse(res,400,"password and confirm password mismatch")
        
    }
}

/**
 * @param {phone,password} req 
 * @param {login} next 
 */
const login_validate=(req,res,next)=>{
    let userLogin={
        phone:req.body.phone,
        password:req.body.password
    }
    const schema={
        phone:Joi.number().required(),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()

    }
    let valid=validate.joi_validate(res,userLogin,schema)
    if(valid){
        next()
    }
}

/**
 * 
 * @param {booking_details} req 
 * @param {booking added to database} res 
 * @param {create_booking} next 
 */
const booking=(req,res,next)=>{
   
    let booking_details={
        longitude_from:req.body.longitude_from,
        latitude_from:req.body.latitude_from,
        longitude_to:req.body.longitude_to,
        latitude_to:req.body.latitude_to,
    }
    const schema={
        latitude_from:Joi.number().min(-90).max(90).required(),
        longitude_from:Joi.number().min(-180).max(180).required(),
        latitude_to:Joi.number().min(-90).max(90).required(),
        longitude_to:Joi.number().min(-180).max(180).required()

    }
    let valid=validate.joi_validate(res,booking_details,schema)
    if(valid){
        next()
    }
}
module.exports={validateCustomer,login_validate,booking}
