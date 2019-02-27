const jwt = require('jsonwebtoken')
const response = require('../routes/response')

const authenticate = (req, res, token, key) => {
    try {
        let result = jwt.verify(token, key);
        req.decoded = result
        return true;
    }

    catch (err) {
        response.errorResponse(res, 400, "Invalid Signature")
        return false;
    }

}

module.exports = { authenticate }