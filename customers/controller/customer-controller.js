const bcrypt = require('bcrypt');
const promise = require('bluebird');
const { runQuery } = require('../../database/db_connection');
const handler = require('../services/customer-service')
const response = require('../../routes/response')
const jwt = require('jsonwebtoken')

/**
 * @param {user} req 
 * @param {add user to database} res 
 */
const sign_up = (req, res) => {
    let user = req.user;
    handler.check_user(user).then((result) => {
        if (result.length == 0) {
            bcrypt.hash(user.password, 10, (err, hash) => {
                if (err) {
                    response.errorResponse(res, 400, err.message)
                }
                else {
                    user.password = hash
                }
                handler.insert_user(user).then((result) => {
                    let data =
                        {
                            status: 200,
                            message: "Signup successfully"
                        }
                    response.successResponse(res, 200, data.message)
                }).catch((err) => {
                    response.errorResponse(res, 400, err.message)
                })
            })
        }
        else {
            let data =
                {
                    message: "User already exist"
                }
            response.errorResponse(res, 409, data.message)
        }
    }).catch((err) => {
        response.errorResponse(res, 400, err.message)
    })
}

/**
 * @param {phone,password} req 
 * @param {token} res 
 */

const user_login = (req, res) => {
    let user =
        {
            phone: req.body.phone,
            password: req.body.password
        }
    handler.check_user(user).then((result) => {
        if (result.length == 0) {
            let data =
                {
                    status: 400,
                    message: "Contact doesnot exist,Login First"
                }
            response.errorResponse(res, 400, data.message)
        }
        else {
            bcrypt.compare(user.password, result[0].password).then((results) => {
                if (results == true) {
                    const token = jwt.sign({ phone: req.body.phone }, "ishitapanwar")
                    user.token = token
                    user.customer_id=result[0].customer_id;
                    user.first_name=result[0].first_name;
                    user.last_name=result[0].last_name;
                    

                    let output =
                        {
                            status: 200,
                            message: "Login successfully",
                            data: user
                        }
                    response.successResponse(res, 200, output.message, output.data)
                }
                else {
                    let data =
                        {
                            status: 400,
                            message: "Password is incorrect"
                        }
                    response.successResponse(res, data.status, data.message)
                }
            }).catch((err) => {
                response.errorResponse(res, 400, err.message)
            })
        }
    }).catch((err) => {
        response.errorResponse(res, 400, err.message)
    })
}

/**
 * 
 * @param {booking_details} req 
 * @param {booking added to database} res 
 */

const createBooking = (req, res) => {
    let phone;
    let booking_details =
        {
            longitude_from: req.body.longitude_from,
            latitude_from: req.body.latitude_from,
            longitude_to: req.body.longitude_to,
            latitude_to: req.body.latitude_to,
            token: req.body.token
        }
     jwt.verify(booking_details.token, "ishitapanwar",(err,decoded)=>{
         if(err){
            response.errorResponse(res, 400, "token is not valid")
         }
         phone = decoded.phone;
    });
   
    booking_details.phone=phone
    handler.userBooking(booking_details).then((result) => {
        let output =
            {
                status: 200,
                message: "Booking done successfully",
                data: booking_details
            }
        response.successResponse(res, 200, output.message, output.data)
    }).catch((err) => {
        response.errorResponse(res, 400, err.message)
    })
}

/**
 * 
 * @param {token} req 
 * @param {get booking of user} res 
 */

const getBooking = (req, res) => {
  
    let token = req.header('token')
    let phone;
     jwt.verify(token, "ishitapanwar",(err,decoded)=>{
        if(err)
        {
            response.errorResponse(res, 400, "token is not valid")
        }
        phone = decoded.phone
    });
    
    handler.showBooking(phone).then((result) => {
        let output =
            {
                status: 200,
                data: result
            }
        response.successResponse(res, 200, output.message, output.data)
    }).catch((err) => {
        response.errorResponse(res, 400, err.message)
    })
}

module.exports = { sign_up, user_login, getBooking, createBooking };