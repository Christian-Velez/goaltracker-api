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
`

export const StatusMutations = {
   createStatus: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')

      try {
         const { userId } = await Project.findById(args.projectId)
         if (userId.toString() !== context.currentUser._id.toString())
            throw new NotFoundError()

         const statusAlreadyExists = await DayStatus.findOne({
            projectId: args.projectId,
            date: args.date,
         })

         if (statusAlreadyExists) {
            const currentCount = await DayStatus.countDocuments({
               projectId: args.projectId,
            })

            return {
               status: null,
               newCount: currentCount,
            }
         }

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
            id: args.id,
            newCount,
         }
      } catch (err) {
         throw new UserInputError(err.message)
      }

      return null
   },
}
