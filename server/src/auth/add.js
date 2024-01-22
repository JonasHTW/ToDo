const { JwtAuth } = require("../jwt/JwtAuth");

module.exports = (req, res) => {
    res.redirect("/welcome");
};