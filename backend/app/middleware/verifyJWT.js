const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    // return res.json(authHeader);

    if (!authHeader?.startsWith('Token ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1];

    // return res.json(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "yomogan",
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            next();
        }
    )
};

module.exports = verifyJWT;