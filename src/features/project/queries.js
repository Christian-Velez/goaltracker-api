import { AuthenticationError, UserInputError } from 'apollo-server'
import mongoose from 'mongoose'
import { Project } from './schema.js'
import { NotFoundError } from '../../graphql.js'
import { DayStatus } from '../status/schema.js'

export const ProjectQueriesDefs = `
   getProjects: [Project]
   getProject(
      id: ID!
   ): Project
`

export const ProjectQueries = {
   getProjects: async (root, args, context) => {
      try {
         const { currentUser } = context

         if (!currentUser._id)
            throw new AuthenticationError('Not authenticated')

         const projects = await Project.aggregate([
            {
               $lookup: {
                  from: 'daystatuses',
                  localField: '_id',
                  foreignField: 'projectId',
                  as: 'statusList',
               },
            },
            { $addFields: { daysAchieved: { $size: '$statusList' } } },
            { $match: { userId: mongoose.Types.ObjectId(currentUser._id) } },
            { $sort: { title: 1 } },
         ])

         return projects
      } catch (err) {
         throw new UserInputError(err.message)
      }

      return null
   },

   getProject: async (root, args, context) => {
      const { currentUser } = context

      if (!currentUser._id) throw new AuthenticationError('Not authenticated')

      try {
         const project = await Project.findById(args.id)

         if (currentUser._id.toString() !== project?.userId?.toString())
            throw new NotFoundError()

         const statusList = await DayStatus.find({ projectId: project._id })
         const daysAchieved = statusList.length

         project.statusList = statusList
         project.daysAchieved = daysAchieved

         return project
      } catch (err) {
         if (err.kind === 'ObjectId') throw new NotFoundError()

         throw new UserInputError(err.message)
      }

      return null
   },
}
