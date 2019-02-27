const bcrypt = require('bcrypt');
const promise = require('bluebird');
const auth=require('../../authenticate/jwt-authenticate')
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
 * @function<b>admin_login</b>
 * generate token
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
          if (results)
          {
            const token = jwt.sign(
            {
              email: req.body.email
            }, "ishita")
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
   * @function<b>driver_assign</b>
   * assings driver for booking
   * @param {token} req 
   * @param {driver_id,first_name,last_name} res 
   */
const driver_assign = (req, res) =>
  {
    let token = req.header('token')
    let email;
    let valid=auth.authenticate(req,res,token,"ishita");
      if(valid)
      {
        email =req.decoded.email;
        handler.assign_driver(email).then((result) =>
        {
          response.successResponse(res, 200, "Booking assigned successfully", result)
        }).catch((err) =>
        {
          response.errorResponse(res, 400, err.message)
        })
      }
  }


  /**
   * @function<b>display all bookings</b>
   * @param {token} req 
   * @param {booking made by admin} res 
   */
const show_booking = (req, res) =>
{
  let token = req.header('token');
  let email;
  let valid=auth.authenticate(req,res,token, "ishita")
    if(valid)
    {
      email = req.decoded.email;
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
}
module.exports = {
  admin_login,
  admin_signup,
  driver_assign,
  show_booking
}