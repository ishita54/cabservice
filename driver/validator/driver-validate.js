const response = require('../../routes/response');
const Joi = require('joi');
const validateDriver = (req, res, next) =>
{
    let driver = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        latitude: req.body.latitude,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        longitude: req.body.longitude
    }
    const schema = {
        first_name: Joi.string().min(3).max(15).required(),
        last_name: Joi.string().min(3).max(15).required(),
        phone: Joi.number().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        confirm_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
    }
    if (driver.password === driver.confirm_password)
    {
        driver.password = req.body.password
        let promise = new Promise((resolve, reject) =>
        {
            const result = Joi.validate(driver, schema);
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
            req.driver = driver;
            next()
        }).catch((error) =>
        {
            response.errorResponse(res, 400, error.details[0].message)
        })
    }
    else
    {
        response.errorResponse(res, 400, "password and confirm password mismatch")
    }
}
const login_validate = (req, res, next) =>
{
    let driverLogin = {
        phone: req.body.phone,
        password: req.body.password
    }
    const schema = {
        phone: Joi.number().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }
    let promise = new Promise((resolve, reject) =>
    {
        const result = Joi.validate(driverLogin, schema);
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
    validateDriver,
    login_validate
}