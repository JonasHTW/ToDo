const jwt = require("jsonwebtoken");

const getUser = async (username) => {
    return { userId: 5, password: "123", username };
};

module.exports = async (req, res) => {
    const { username, password } = req.body;

    const user = await getUser(username);

    if (user.password !== password) {
        return res.status(403).json({
            error: "Invalid login",
        });
    }


    delete user.password;

    const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
    });

    return res.redirect("/welcome");

}