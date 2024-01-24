const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.MY_SECRET);
        const userId = decodedToken.userId;
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authorization token' });
    }
};

module.exports = authenticateToken;