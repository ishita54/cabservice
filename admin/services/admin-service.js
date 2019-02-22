const
{
    runQuery
} = require('../../database/db_connection')
const Promise = require('bluebird');
const moment = require('moment')

/**
 * @function{check_admin}<b>check for admin in database</b>
 * @input{email}
 */
const check_admin = Promise.coroutine(function*(admin)
{
    let sql = "SELECT email,password from admin where email=?";
    let query = {
        sql: sql,
        args: [admin.email]
    }
    return yield runQuery(query.sql, query.args)
})

/**
 * @function{assign_driver}<b>assign booking to driver</b>
 * @input{email}
 * return{driver_id,admin_id}
 */

const assign_driver = Promise.coroutine(function*(email)
{  
    let booking_status=yield runQuery("SELECT booking_status from booking where booking_status=0");
    if(booking_status.length==0){
        throw new Error("There is no booking to assign driver")
    } 
    else{
        let adminId = yield runQuery("SELECT admin_id from admin where email=?", [email]);
        let driverid = yield runQuery("SELECT driver_id from driver where driver_status=0 LIMIT 1");
        if (!driverid)
        {
            throw new Error("Driver not available");
        }
        
        let date = moment().format('MMMM Do YYYY, h:mm:ss a');
        let logs = ["Admin with id", adminId[0].admin_id, "assigned driver with id", driverid[0].driver_id, "on", date];
        let result = logs.join(' ')
        dbo.collection("adminlogs").insert(
        {
            admin_id: adminId[0].admin_id,
            driver_id: driverid[0].driver_id,
            logs: result
        })
        yield runQuery("UPDATE booking set driver_id=?,booking_status=1,admin_id=? where booking_status=0 LIMIT 1", [driverid[0].driver_id, adminId[0].admin_id])
        yield runQuery("UPDATE driver set driver_status=1 where driver_id=?", [driverid[0].driver_id])
        return yield runQuery("SELECT driver_id,first_name,last_name from driver where driver_id=?", [driverid[0].driver_id])

    }
    
})

/**
 * @function{verify_admin}<b>admin exist or not</b>
 * return{email}
 */
const verify_admin = async() =>
{
    let result = await runQuery("SELECT email from admin")
    return result;
}


/**
 * @function{insert_admin}<b>admin added to database</b>
 * @input{adminDetails}
 */
const insert_admin = async(adminDetails) =>
{
    await runQuery("INSERT INTO admin(name,email,password) VALUES ('ichchha','ichchha123@gmail.com','$2b$10$TQa/7qMzHLXlYydcKO4zVuyDdKmlwCyIeGAVswD.shCEt97iCMuvW')");
    await runQuery("INSERT INTO admin(name,email,password) VALUES ('kanika','kanika123@gmail.com','$2b$10$TQa/7qMzHLXlYydcKO4zVuyDdKmlwCyIeGAVswD.shCEt97iCMuvW')");
}


/**
 * @function{get_booking}<b>display booking made by admin</b>
 * @input{email}
 */
const get_booking = Promise.coroutine(function*(email)
{   
    let adminId = yield runQuery("SELECT admin_id from admin where email=? ", [email])
    let admin_id = adminId[0].admin_id
    let sql = `SELECT first_name AS driver_name,driver.driver_id AS driver_id,booking.customer_id AS customer_id,
                booking.booking_id AS booking_id from driver INNER JOIN booking ON driver.driver_id=booking.driver_id where admin_id=?`
    return yield runQuery(sql, [admin_id])
})


module.exports = {
    check_admin,
    insert_admin,
    verify_admin,
    assign_driver,
    get_booking
}