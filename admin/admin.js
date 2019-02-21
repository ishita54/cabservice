const express=require('express');
const router=express.Router();
const validator=require('./validator/admin-validate')
const routeHandler=require('./controller/admin-controller')

router.post('/login',                      validator.loginValidate,                      routeHandler.admin_login);
router.put('/assign_booking',                                                            routeHandler.driver_assign)
router.get('/show_booking',                                                              routeHandler.show_booking)

module.exports=router;