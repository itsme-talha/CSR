const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const registerUser = async (name, email, password, role) => {
    // 1. Check karein ke kya is email se pehle koi account bana hua hai
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('Yeh email pehle se registered hai');
    }

    // 2. Password ko secure (Hash) karein
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Naya user database mein create karein
    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role
        }
    });

    return user;
};

// Naya Login Function
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email ya password ghalat hai');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Email ya password ghalat hai');

    // JWT Token banana (7 din ke liye valid)
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { user, token };
};

module.exports = { registerUser, loginUser };