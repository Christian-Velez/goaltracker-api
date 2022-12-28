import { UserInputError } from 'apollo-server'
import { User } from './schema.js'

export const UserQueriesDefs = `
   getAllUsers: [User]

   me: User
`

export const UserQueries = {
   getAllUsers: async () => {
      try {
         const users = await User.find()
         return users
      } catch (err) {
         throw new UserInputError(err.message)
      }

      return null
   },

   me: async (root, args, context) => {
      return context.currentUser
   },
}
