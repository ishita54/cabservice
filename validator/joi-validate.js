const response=require('../routes/response')
const Joi = require('joi');

const joi_validate=(res,data,schema)=>{
   let result = Joi.validate(data,schema)
        if(result.error){
            response.errorResponse(res,400,result.error.details[0].message)
            return false;
        }
        else{
            return true;

        }

}
module.exports={joi_validate}