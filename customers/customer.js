const express=require('express');
const router=express.Router();
const validate=require('./validator/customer-validate')
const routeHandler=require('./controller/customer-controller')


router.post('/signup',             validate.validateCustomer,                          routeHandler.sign_up);
router.post('/login',              validate.login_validate,                            routeHandler.user_login);
router.post('/create_booking',     validate.booking,                                   routeHandler.createBooking)
router.get('/get_booking',                                                             routeHandler.getBooking)

module.exports=router

