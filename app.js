const express = require('express');
const app = express();
const admin_routes = require('./admin/admin');
const customer_routes = require('./customers/customer');
const driver_routes = require('./driver/driver');
const mysql = require('mysql')
const dbo = require('./database/mongo-connect')
const bodyparser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



require('./admin/controller/admin-controller')

app.use('/admin', admin_routes)
app.use('/customer', customer_routes);
app.use('/driver', driver_routes);


app.listen(3000);
