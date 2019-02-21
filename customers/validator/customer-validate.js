const response=require('../../routes/response');
const Joi=require('joi');

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
        let promise=new Promise((resolve,reject)=>{
            const result=Joi.validate(user,schema);
            if(result.error)
            {
                reject(result.error);
            }
            else{
                resolve();
            }
            
        })
        promise.then(()=>{
            req.user=user;
            next()
        }).catch((error)=>{
            response.errorResponse(res,400,error.details[0].message)
    
        })
    }
    else
    {
        response.errorResponse(res,400,"password and confirm password mismatch")
        
    }
}


const login_validate=(req,res,next)=>{
    let userLogin={
        phone:req.body.phone,
        password:req.body.password
    }
    const schema={
        phone:Joi.number().required(),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()

    }
    let promise=new Promise((resolve,reject)=>{
        const result=Joi.validate(userLogin,schema);
        if(result.error)
        {
            reject(result.error);
        }
        else{
            resolve();
        }
        
    })
    promise.then(()=>{
        next()
    }).catch((error)=>{
        response.errorResponse(res,400,error.details[0].message)

    })
}


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
    let promise=new Promise((resolve,reject)=>{
        const result=Joi.validate(booking_details,schema);
        if(result.error)
        {
            reject(result.error);
        }
        else{
            resolve();
        }
        
    })
    promise.then(()=>{
        next()
    }).catch((error)=>{
        response.errorResponse(res,400,error.details[0].message)

    })


}
module.exports={validateCustomer,login_validate,booking}
