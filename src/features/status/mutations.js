import { AuthenticationError, UserInputError } from 'apollo-server'
import { NotFoundError } from '../../graphql.js'
import { Project } from '../project/schema.js'
import { DayStatus } from './schema.js'

export const StatusMutationsDefs = `
   createStatus(
      projectId: ID!
      date: String!
   ): CreateStatusResponse

   deleteStatus(
      id: ID!
   ): DeleteStatusResponse

   updateStatus(
      projectId: ID
      date: String
      marked: Boolean
   ) : UpdateStatusResponse
`

export const StatusMutations = {
   updateStatus: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')

      const { projectId, date, marked } = args

      const status = await DayStatus.findOne({
         projectId,
         date,
      })

      if (!status && marked) {
         const result = await StatusMutations.createStatus(root, args, context)
         return { ...result, action: 'created' }
      }

      // If exists and new value is false
      if (status && !marked) {
         const result = await StatusMutations.deleteStatus(
            root,
            { id: status._id },
            context
         )
         return { ...result, action: 'deleted' }
      }

      return null
   },

   createStatus: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')

      try {
         const { userId } = await Project.findById(args.projectId)
         if (userId.toString() !== context.currentUser._id.toString())
            throw new NotFoundError()

         const newStatus = new DayStatus({
            projectId: args.projectId,
            date: args.date,
            value: 1,
         })

         const savedStatus = await newStatus.save()

         const newCount = await DayStatus.countDocuments({
            projectId: args.projectId,
         })

         return {
            status: savedStatus,
            newCount,
         }
      } catch (err) {
         throw new UserInputError(err.message)
      }

      return null
   },

   deleteStatus: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')

      try {
         const status = await DayStatus.findById(args.id)

         if (!status) throw new NotFoundError()

         const { userId } = await Project.findById(status.projectId)

         if (userId.toString() !== context.currentUser._id.toString())
            throw new NotFoundError()

         await DayStatus.findByIdAndDelete(args.id)

         const newCount = await DayStatus.countDocuments({
            projectId: status.projectId,
         })

         return {
            status: {
               id: args.id,
            },
            newCount,
         }
      } catch (err) {
         throw new UserInputError(err.message)
      }

      return null
   },
}
