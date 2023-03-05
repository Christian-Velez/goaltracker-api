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

   updateUser(
      name: String!
      changePassword: Boolean!
      currentPassword: String
      newPassword: String
   ) : User

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
         const user = new User({ ...rest, name: '', password: passwordHash })
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

   updateUser: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')

      const id = context.currentUser._id

      if (args.changePassword) {
         const user = await User.findById(id)
         const passwordCorrect = await checkPassword(
            args.currentPassword,
            user.password
         )

         if (!passwordCorrect) throw new AuthenticationError('Invalid password')
      }

      try {
         const passwordHash = await hashPassword(args.newPassword)
         const user = await User.findByIdAndUpdate(
            id,
            { ...args, password: passwordHash },
            { new: true }
         )
         return user
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
