const jwt = require('jsonwebtoken');

// Token verify karne wala middleware
const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1]; // "Bearer" word ko alag karna
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // User ki id aur role req mein save kar diya
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Specific Roles check karne wala middleware (Admin, Donor, Beneficiary)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is route ke liye authorized nahi hai` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };