import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const checkPassword = async (password, hashedPassword) => {
   return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user) => {
   const userForToken = {
      id: user.id,
      email: user.email,
   }

   return jwt.sign(userForToken, process.env.JWT_SECRET)
}
