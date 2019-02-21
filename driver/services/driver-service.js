const
{
    runQuery
} = require('../../database/db_connection')
const Promise = require('bluebird')
const moment = require('moment')

/**
 * @input{driver_details}
 * @return{driver added to database}
 */
const insert_driver = Promise.coroutine(function*(driver)
{
    let sql = "INSERT INTO driver(first_name,last_name,password,phone,latitude,longitude) VALUES (?,?,?,?,?,?)"
    let query = {
        sql: sql,
        args: [driver.first_name, driver.last_name, driver.password, driver.phone, driver.latitude, driver.longitude],
    }
    return yield runQuery(query.sql, query.args)
})
const check_driver = Promise.coroutine(function*(driver)
{
    let sql = "SELECT * from driver where phone=?";
    let query = {
        sql: sql,
        args: [driver.phone]
    }
    return yield runQuery(query.sql, query.args)
})

/**
 * @input{driver_details}
 * @return {driver_id,name}
 */
const fetch_details = Promise.coroutine(function*(driver)
{
    let sql = "SELECT driver_id,first_name from driver where phone=?"
    let query = {
        sql: sql,
        args: [driver.phone]
    }
    return yield runQuery(query.sql, query.args)
})

/**
 * @input{driver_id}
 * @return {details of current booking}
 */
const show_currentbooking = Promise.coroutine(function*(driver_id)
{
    return yield runQuery("SELECT * from booking where driver_id=? AND booking_status=?", [driver_id, 1])
})
const show_pastbooking = Promise.coroutine(function*(details)
{
    let LIMIT = parseInt(details.limit)
    let sql = "SELECT * from booking where driver_id=? AND booking_status=? LIMIT ? ";
    let query = {
        sql: sql,
        args: [details.driver_id, 2, LIMIT]
    }
    return yield runQuery(query.sql, query.args)
})

/**
 * @input{driver_id}
 * @return {updates driver_status,booking_status}
 */
const complete_booking = Promise.coroutine(function*(driver_id)
{
    let sql = "UPDATE booking set booking_status=2 where driver_id=?";
    console.log(driver_id)
    let query = {
        sql: sql,
        args: [driver_id]
    }
    yield runQuery(query.sql, query.args)
    let date = moment().format('MMMM Do YYYY, h:mm:ss a');
    let log = ["driver with id", query.args, "completes booking at", date];
    let result = log.join(' ')
    dbo.collection("driverlogs").insert(
    {
        logs: result
    })
    return yield runQuery("UPDATE driver set driver_status=0 where driver_id=?", query.args)
})
module.exports = {
    insert_driver,
    check_driver,
    fetch_details,
    show_currentbooking,
    show_pastbooking,
    complete_booking
}