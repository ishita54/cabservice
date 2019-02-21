const Joi = require('joi');
const response=require('../../routes/response');

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
    let promise = new Promise((resolve, reject) =>
    {
        const result = Joi.validate(adminLogin, schema);
        if (result.error)
        {
            reject(result.error);
        }
        else
        {
            resolve();
        }
    })
    promise.then(() =>
    {
        next()
    }).catch((error) =>
    {
        response.errorResponse(res, 400, error.details[0].message)
    })
}

module.exports = {
    loginValidate
}