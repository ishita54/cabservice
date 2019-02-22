const
{
    runQuery
} = require('../../database/db_connection')
const Promise = require('bluebird')

/**
 * @input{user}
 * @return {user added to database}
 */
const insert_user = Promise.coroutine(function*(user)
{
    let sql = "INSERT INTO customer(first_name,last_name,password,phone,latitude,longitude) VALUES (?,?,?,?,?,?)"
    let query = {
        sql: sql,
        args: [user.first_name, user.last_name, user.password, user.phone, user.latitude, user.longitude],
    }
    return yield runQuery(query.sql, query.args)
})


const check_user = Promise.coroutine(function*(user)
{
    let sql = "SELECT * from customer where phone=?";
    return yield runQuery(sql, [user.phone])
})

/**
 * @input{phone}
 * @return{booking_details}
 */
const userBooking = Promise.coroutine(function*(booking_details)
{
    const customerId = yield runQuery("SELECT customer_id from customer where phone=? ", [booking_details.phone]);
    booking_details.customer_id = customerId[0].customer_id;
    let sql = "INSERT INTO booking(longitude_from,latitude_from,longitude_to,latitude_to,customer_id) VALUES (?,?,?,?,?)";
    return yield runQuery(sql, [booking_details.longitude_from, booking_details.latitude_from, booking_details.longitude_to, booking_details.latitude_to, booking_details.customer_id])
})

/**
 * @input{phone}
 * @return{displays booking details}
 */
const showBooking = Promise.coroutine(function*(phone)
{
    const customerId = yield runQuery("SELECT customer_id from customer where phone=?", [phone]);
    let customer_id = customerId[0].customer_id
    let sql = "SELECT booking_id,customer_id,booking_status,date,latitude_from,longitude_from,latitude_to,longitude_to from booking where customer_id=?";
    return yield runQuery(sql, [customer_id])
})
module.exports = {
    check_user,
    insert_user,
    userBooking,
    showBooking
}