const Joi = require('joi');
const response=require('../../routes/response');
const validate=require('../../validator/joi-validate')

/**
 * @function<b>validate credentials of admin</b>
 * @param {email,password} req 
 * @param {admin_login} next 
 */

const loginValidate = (req, res, next) =>
{
    let adminLogin = {
        email: req.body.email,
        password: req.body.password
    }
    const schema = {
        email: Joi.string().email(
        {
            minDomainAtoms: 2
        }).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }
    let valid=validate.joi_validate(res,adminLogin,schema)
    if(valid){
        next()
    }
}

module.exports = {
    loginValidate
}