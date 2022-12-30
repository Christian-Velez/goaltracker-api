import { AuthenticationError, UserInputError } from 'apollo-server'
import { NotFoundError } from '../../graphql.js'
import { Project } from './schema.js'

export const ProjectMutationsDefs = `
   createProject(
      title: String!
      description: String
      color: String!
   ): Project

   updateProject(
      id: ID!
      title: String!
      description: String
      color: String!
   ): Project

   deleteProject(
      id: ID!
   ): ID
`

export const ProjectMutations = {
   createProject: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')

      try {
         const project = new Project({
            userId: context.currentUser._id,
            ...args,
         })

         return await project.save()
      } catch (err) {
         throw new UserInputError(err.message)
      }
   },

   updateProject: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')
      const { _id: userId } = context.currentUser

      try {
         let project = await Project.findById(args.id)

         if (!project || project?.userId?.toString() !== userId.toString())
            throw new NotFoundError()

         return await Project.findByIdAndUpdate(
            args.id,
            { ...args },
            { new: true }
         )
      } catch (err) {
         throw new UserInputError(err.message)
      }
   },

   deleteProject: async (root, args, context) => {
      if (!context?.currentUser?._id)
         throw new AuthenticationError('Not authenticated')
      const { _id: userId } = context.currentUser

      try {
         let project = await Project.findById(args.id)

         if (!project || project?.userId?.toString() !== userId.toString())
            throw new NotFoundError()

         await Project.findByIdAndDelete(args.id)
         return args.id
      } catch (err) {
         throw new UserInputError(err.message)
      }
   },
}
