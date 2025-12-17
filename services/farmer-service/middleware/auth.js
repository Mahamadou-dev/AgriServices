const jwt = require('jsonwebtoken');

// SECURITY: JWT_SECRET must be provided via environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
    console.error('   The application cannot start without a valid JWT secret.');
    process.exit(1);
}

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                error: 'Access denied',
                message: 'No authorization header provided'
            });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: 'Access denied',
                message: 'Invalid authorization header format. Expected: Bearer <token>'
            });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = {
            userId: decoded.sub || decoded.userId,
            username: decoded.username,
            roles: decoded.roles || []
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Access denied',
                message: 'Token has expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Access denied',
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Error validating token'
        });
    }
};

module.exports = { verifyToken };
