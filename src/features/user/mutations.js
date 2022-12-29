import { AuthenticationError, UserInputError } from 'apollo-server'
import {
   generateToken,
   checkPassword,
   hashPassword,
} from '../../helpers/credentials.js'
import { User } from './schema.js'

export const UserMutationsDefs = `
   createUser(
      name: String!
      email: String!
      password: String!
   ): UserResponse

   login(
      email: String!
      password: String!
   ): UserResponse
`

export const UserMutations = {
   createUser: async (root, args) => {
      const { password, ...rest } = args
      const passwordHash = await hashPassword(password)

      try {
         const user = new User({ ...rest, password: passwordHash })
         const savedUser = await user.save()
         const token = generateToken(savedUser)

         return {
            token,
            user: savedUser,
         }
      } catch (err) {
         throw new UserInputError(err.message)
      }
   },

   login: async (root, args) => {
      const { email, password } = args

      try {
         const user = await User.findOne({ email })

         if (!user) throw new AuthenticationError('Wrong credentials')

         const passwordCorrect = await checkPassword(password, user.password)

         if (!passwordCorrect)
            throw new AuthenticationError('Wrong credentials')

         const token = generateToken(user)
         return {
            token,
            user,
         }
      } catch (err) {
         throw new UserInputError(err.message)
      }
   },
}
