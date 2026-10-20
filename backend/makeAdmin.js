const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Aapke auth controller mein jo bhi use hua hai (bcrypt ya bcryptjs)
const prisma = new PrismaClient();

async function main() {
  try {
    const userEmail = "admin@gmail.com"; 
    const plainPassword = "12345678"; // Naya password

    // Password ko secure (hash) karna zaroori hai
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { 
        role: 'ADMIN',
        passwordHash: hashedPassword // Database column ka naam jaisa screenshot mein tha
      },
    });
    
    console.log('✅ Success! Account has been updated to ADMIN with new password.');
    console.log(`Email: ${updatedUser.email} | Role: ${updatedUser.role}`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();