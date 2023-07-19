const morgan = require("morgan");
const responseCodes = require('../../constants/responseCodes')

morgan.token("body", (req, res) => console.log(req.body));

module.exports = morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
);