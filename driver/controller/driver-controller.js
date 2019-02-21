const bcrypt = require('bcrypt');
const
{
    runQuery
} = require('../../database/db_connection');
const handler = require('../services/driver-service')
const response = require('../../routes/response')
const jwt = require('jsonwebtoken')

/**
 * @param {driver_details} req 
 * @param {driver added to database} res 
 */
const signup = (req, res) =>
{
    let driver = req.driver;
    handler.check_driver(driver).then((result) =>
    {
        if (result.length == 0)
        {
            bcrypt.hash(driver.password, 10, (err, hash) =>
            {
                if (err)
                {
                    response.errorResponse(res, 400, err.message)
                }
                else
                {
                    driver.password = hash
                }
                handler.insert_driver(driver).then((result) =>
                {
                    let data = {
                        status: 200,
                        message: "Signup successfully"
                    }
                    response.successResponse(res, data.status, data.message)
                }).catch((err) =>
                {
                    response.errorResponse(res, 400, err.message)
                })
            })
        }
        else
        {
            let data = {
                message: "Driver already exist"
            }
            response.errorResponse(res, 409, data.message)
        }
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err.message)
    })
}

/**
 * @param {phone,password} req 
 * @param {driver details} res 
 */
const login = (req, res) =>
{
    let driver = {
        phone: req.body.phone,
        password: req.body.password
    }
    handler.check_driver(driver).then((result) =>
    {
        if (result.length == 0)
        {
            let data = {
                status: 400,
                message: "Contact doesnot exist,Login First"
            }
            response.successResponse(res, data.status, data.message)
        }
        else
        {
            bcrypt.compare(driver.password, result[0].password).then((results) =>
            {
                if (results == true)
                {
                    handler.fetch_details(driver).then((result) =>
                    {
                        const token = jwt.sign(
                        {
                            phone: driver.phone,
                            driver_id: result[0].driver_id
                        }, "ishitapanwar")
                        driver.token = token
                        driver.first_name = result[0].first_name
                        driver.driver_id = result[0].driver_id
                        let output = {
                            status: 200,
                            message: "Login successfully",
                        }
                        response.successResponse(res, output.status, output.message, driver)
                    }).catch((err) =>
                    {
                        response.errorResponse(res, 400, err.message)
                    })
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
                response.errorResponse(res, 400, err.message)
            })
        }
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err.message)
    })
}

/**
 * @function<b>currentBooking</b>
 * displays current booking assigned to driver
 * @param {token} req  
 */
const currentBooking = (req, res) =>
{
    let token = req.header('token');
    let driver_id
    jwt.verify(token, "ishitapanwar", (err, decoded) =>
    {
        if (err)
        {
            response.errorResponse(res, 400, "token is not valid")
        }
        driver_id = decoded.driver_id;
    });
    handler.show_currentbooking(driver_id).then((result) =>
    {
        if (result.length == 0)
        {
            response.successResponse(res, 200, "No booking found")
        }
        else
        {
            response.successResponse(res, 200, result)
        }
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err)
    })
}

/**
 * @function<b>past_booking</b>
 * displays past booking by driver
 * @param {token,limit} req  
 */
const pastBooking = (req, res) =>
{
    let details = {
        token: req.header('token'),
        limit: req.header('limit')
    }
    jwt.verify(details.token, "ishitapanwar", (err, decoded) =>
    {
        if (err)
        {
            response.errorResponse(res, 400, "token is not valid")
        }
        details.driver_id = decoded.driver_id;
    });
    console.log(details.driver_id)
    handler.show_pastbooking(details).then((result) =>
    {
        response.successResponse(res, 200, result)
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err)
    })
}


/**
 * @function<b>completeBooking</b>
 * driver updates status(value=2)
 * booking_status{0-booking_unassigned,1-booking_assigned,2-booking_completed}
 * driver_status{0-driver_available,1-driver_busy}
 * @param {token} req  
 */
const completeBooking = (req, res) =>
{
    let token = req.header('token');
    let driver_id
    jwt.verify(token, "ishitapanwar", (err, decoded) =>
    {
        if (err)
        {
            response.errorResponse(res, 400, "token is not valid")
        }
        driver_id = decoded.driver_id;
    });
    console.log(driver_id)
    handler.complete_booking(driver_id).then((result) =>
    {
        response.successResponse(res, 200, "Booking completed")
    }).catch((err) =>
    {
        response.errorResponse(res, 400, err)
    })
}
module.exports = {
    signup,
    login,
    currentBooking,
    pastBooking,
    completeBooking
}