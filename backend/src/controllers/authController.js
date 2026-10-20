const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic input validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tamam fields (name, email, password, role) required hain' 
            });
        }

        // Service function ko call karein
        const user = await authService.registerUser(name, email, password, role);

        // API Response Standard
        res.status(201).json({
            success: true,
            message: 'User successfully register ho gaya hai',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Naya login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email aur password required hai' });
        }
        
        const { user, token } = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'User successfully login ho gaya hai',
            data: {
                id: user.id,
                name: user.name,
                role: user.role,
                token: token
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = { register, login };