const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dGhpcy1pcy1hLWxvbmctYW5kLXNlY3VyZS1zZWNyZXQta2V5LWZvci10aGUtanctdC1hdXRoLXNlcnZpY2UtdG8tc2lnbi1hbmQtdmFsaWRhdGUtam9zLTM4';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const token = authHeader.substring(7);
        
        const decoded = jwt.verify(token, Buffer.from(JWT_SECRET, 'base64'));
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
