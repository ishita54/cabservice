const bcrypt = require('bcrypt');
const promise = require('bluebird');
const
{
    runQuery
} = require('../../database/db_connection')
const handler = require('../services/admin-service')
const response = require('../../routes/response')
const jwt = require('jsonwebtoken')

const admin_signup = (async() =>
{
    const result = await handler.verify_admin()
    if (result.length != 0)
    {}
    else
    {
        handler.insert_admin()
    }
})();


/**
 * @function<b>add user in database</b>
 * @param {email,password} req 
 * @param {token} res
 */
const admin_login = (req, res) =>
{
    let admin = {
        email: req.body.email,
        password: req.body.password
    }
    handler.check_admin(admin).then((result) =>
    {
        if (result.length == 0)
        {
            let data = {
                status: 400,
                message: "Email doesnot exist"
            }
            response.successResponse(res, data.status, data.message)
        }
        else
        {
            bcrypt.compare(admin.password, result[0].password).then((results) =>
            {
                if (results == true)
                {
                    const token = jwt.sign(
                    {
                        email: req.body.email
                    }, "ishitapanwar")
                    admin.token = token
                    let output = {
                        status: 200,
                        message: "Login successfully",
                        data: admin
                    }
                    response.successResponse(res, output.status, output.message, output.data)
                }
                else
                {
                    let data = {
                        status: 400,
                        message: "Password is incorrect"
                    }
                    response.successResponse(res, data.status, data.message)
                }
            }).catch((err) =>
            {
                response.errorResponse(res, 400, err)
            })
        }
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err)
    })
}


/**
 * @function{driver_assign}assings driver for booking
 * @param {token} req 
 * @param {driver_id,first_name,last_name} res 
 */
const driver_assign = (req, res) =>
{
    let token = req.header('token')
    let email;
    jwt.verify(token, "ishitapanwar", (err, decoded) =>
    {
        if (err)
        {
            response.errorResponse(res, 400, "token is not valid")
        }
        email = decoded.email;
    });
    handler.assign_driver(email).then((result) =>
    {
        response.successResponse(res, 200, "Booking assigned successfully", result)
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err.message)
    })
}


/**
 * 
 * @param {token} req 
 * @param {booking made by admin} res 
 */
const show_booking = (req, res) =>
{
    let token = req.header('token');
    let email;
    jwt.verify(token, "ishitapanwar", (err, decoded) =>
    {
        if (err)
        {
            response.errorResponse(res, 400, "token is not valid")
        }
        email = decoded.email;
    });
    handler.get_booking(email).then((result) =>
    {
        if (result.length == 0)
        {
            response.successResponse(res, 200, "No booking assigned by admin")
        }
        else
        {
            response.successResponse(res, 200, result)
        }
    }).catch((err) =>
    {
        response.errorResponse(res, 400, "Driver not available")
    })
}
module.exports = {
    admin_login,
    admin_signup,
    driver_assign,
    show_booking
}