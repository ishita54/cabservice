const express=require('express');
const router=express.Router();
const validator=require('./validator/driver-validate')
const routeHandler=require('./controller/driver-controller')

router.post('/signup',                  validator.validateDriver,               routeHandler.signup)
router.post('/login',                   validator.login_validate,               routeHandler.login)
router.get('/get_currentbooking',                                        routeHandler.currentBooking)
router.get('/get_pastbooking',                                              routeHandler.pastBooking)
router.put('/complete_booking',                                          routeHandler.completeBooking)


module.exports=router